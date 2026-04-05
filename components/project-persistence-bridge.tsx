"use client";

import { useEffect, useRef } from "react";
import useStore, { createDefaultGraphJson } from "@/hooks/store";
import { readAutosave, clearAutosave } from "@/lib/autosave";
import {
	ACTIVE_PROJECT_LS_KEY,
	countProjects,
	getProjectRow,
	listProjectsMeta,
	putProject,
	projectsDb,
} from "@/lib/projects-db";

/**
 * Dexie (IndexedDB): wiele projektów + migracja ze starego localStorage.
 */
export default function ProjectPersistenceBridge() {
	const skipWrites = useRef(true);

	useEffect(() => {
		let cancelled = false;
		let hydrationTimer: number | undefined;

		(async () => {
			try {
				await projectsDb.open();
			} catch {
				if (!cancelled) {
					useStore.setState({ projectsReady: true });
				}
				return;
			}

			if (cancelled) return;

			const cnt = await countProjects();
			if (cnt === 0) {
				const legacy = readAutosave();
				let graphJson: string;
				let name: string;
				if (legacy) {
					try {
						const p = JSON.parse(legacy) as { nodes?: unknown[] };
						graphJson =
							Array.isArray(p?.nodes) && p.nodes.length > 0
								? legacy
								: createDefaultGraphJson();
						name = "Import (localStorage)";
					} catch {
						graphJson = createDefaultGraphJson();
						name = "Projekt 1";
					}
					clearAutosave();
				} else {
					graphJson = createDefaultGraphJson();
					name = "Projekt 1";
				}
				const id = crypto.randomUUID();
				await putProject({
					id,
					name,
					updatedAt: Date.now(),
					graphJson,
				});
			}

			if (cancelled) return;

			const meta = await listProjectsMeta();
			const activeLs =
				typeof localStorage !== "undefined"
					? localStorage.getItem(ACTIVE_PROJECT_LS_KEY)
					: null;
			const activeId =
				activeLs && meta.some((m) => m.id === activeLs)
					? activeLs
					: (meta[0]?.id ?? null);

			if (!activeId) {
				if (!cancelled) useStore.setState({ projectsReady: true });
				return;
			}

			const row = await getProjectRow(activeId);
			if (!row || cancelled) {
				if (!cancelled) useStore.setState({ projectsReady: true });
				return;
			}

			useStore.getState().importJson(row.graphJson);
			useStore.setState({
				currentProjectId: activeId,
				projectsMeta: meta,
				projectsReady: true,
			});

			hydrationTimer = window.setTimeout(() => {
				skipWrites.current = false;
			}, 400);
		})();

		return () => {
			cancelled = true;
			if (hydrationTimer !== undefined) window.clearTimeout(hydrationTimer);
		};
	}, []);

	useEffect(() => {
		let nodes = useStore.getState().nodes;
		let edges = useStore.getState().edges;
		let debounceId: number | undefined;

		const unsub = useStore.subscribe((state) => {
			if (skipWrites.current || !state.projectsReady) return;
			if (state.nodes === nodes && state.edges === edges) return;
			nodes = state.nodes;
			edges = state.edges;
			if (debounceId !== undefined) window.clearTimeout(debounceId);
			debounceId = window.setTimeout(() => {
				void useStore.getState().flushCurrentProjectToDb();
			}, 850);
		});
		return () => {
			unsub();
			if (debounceId !== undefined) window.clearTimeout(debounceId);
		};
	}, []);

	return null;
}
