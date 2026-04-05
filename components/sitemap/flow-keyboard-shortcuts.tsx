"use client";

import { useReactFlow } from "@xyflow/react";
import { useEffect } from "react";
import useStore from "@/hooks/store";

/** Cmd/Ctrl+D duplicate, Cmd/Ctrl+K focus search — only when focus is not in a field. */
export function FlowKeyboardShortcuts() {
	const duplicatePage = useStore((s) => s.duplicatePage);
	const { getNodes } = useReactFlow();

	useEffect(() => {
		const inField = (t: EventTarget | null) => {
			const el = t as HTMLElement | null;
			return Boolean(
				el?.closest("input, textarea, select, [contenteditable=true]"),
			);
		};

		const onKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "d") {
				if (inField(e.target)) return;
				e.preventDefault();
				const selected = getNodes().filter((n) => n.selected);
				const one = selected[0];
				if (selected.length === 1 && one && one.id !== "root") {
					duplicatePage(one.id);
				}
			}
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				document.getElementById("sitemap-search")?.focus();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [getNodes, duplicatePage]);

	return null;
}
