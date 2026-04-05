import { create } from "zustand";
import {
	type Edge,
	type Node,
	type OnNodesChange,
	type OnEdgesChange,
	type Connection,
	applyNodeChanges,
	applyEdgeChanges,
	addEdge,
} from "@xyflow/react";
import { clearAutosave } from "@/lib/autosave";
import { exportSitemapMarkdown } from "@/lib/sitemap-markdown";
import {
	ACTIVE_PROJECT_LS_KEY,
	deleteProjectRow,
	getProjectRow,
	listProjectsMeta,
	putProject,
} from "@/lib/projects-db";
import type { ProjectMeta } from "@/lib/projects-db";
import { layoutSitemapNodes } from "@/lib/sitemap-layout";

export type { ProjectMeta };

export type PageSection = {
	id: string;
	title: string;
	/** szkic treści, notatki, bullet points */
	content: string;
};

export type PageSeo = {
	title: string;
	metaDescription: string;
	slug: string;
	h1: string;
	keyword: string;
	pageIntent: string;
};

export function defaultPageSeo(): PageSeo {
	return {
		title: "",
		metaDescription: "",
		slug: "",
		h1: "",
		keyword: "",
		pageIntent: "",
	};
}

export type SitemapNodeData = {
	label: string;
	/** segment ścieżki URL, np. "o-nas" — pełną ścieżkę budujemy z hierarchii w UI */
	pathSegment: string;
	sections: PageSection[];
	seo: PageSeo;
};

export type SitemapFlowNode = Node<SitemapNodeData>;

interface SitemapState {
	nodes: SitemapFlowNode[];
	edges: Edge[];
	selectedPageId: string | null;
	setSelectedPageId: (id: string | null) => void;
	onNodesChange: OnNodesChange<SitemapFlowNode>;
	onEdgesChange: OnEdgesChange;
	onConnect: (connection: Connection) => void;
	addPage: (parentId: string, label: string) => void;
	updateNodeData: (
		id: string,
		partial: Partial<SitemapNodeData>,
	) => void;
	updateNodeSeo: (id: string, partial: Partial<PageSeo>) => void;
	/** Ustawia `pathSegment` z SEO slug (tylko nie-root); slug jest normalizowany jak etykieta URL */
	syncPathSegmentFromSeoSlug: (id: string) => void;
	addSection: (pageId: string) => void;
	updateSection: (
		pageId: string,
		sectionId: string,
		partial: Partial<Pick<PageSection, "title" | "content">>,
	) => void;
	removeSection: (pageId: string, sectionId: string) => void;
	moveSection: (
		pageId: string,
		sectionId: string,
		direction: "up" | "down",
	) => void;
	removeSubtree: (id: string) => void;
	/** Kopia strony pod tymi samymi rodzicami (bez dzieci); nie dotyczy root */
	duplicatePage: (id: string) => void;
	/** Zaznaczenie w React Flow + panel boczny */
	selectNode: (id: string | null) => void;
	runAutoLayout: () => void;
	exportJson: () => string;
	exportMarkdown: () => string;
	importJson: (json: string) => void;
	reset: () => void;

	currentProjectId: string | null;
	projectsMeta: ProjectMeta[];
	projectsReady: boolean;
	flushCurrentProjectToDb: () => Promise<void>;
	refreshProjectsMeta: () => Promise<void>;
	createProject: (name?: string) => Promise<string>;
	openProject: (id: string) => Promise<void>;
	deleteProject: (id: string) => Promise<void>;
	renameProject: (id: string, name: string) => Promise<void>;
	/** Nowy projekt z kopią JSON istniejącego workspace */
	duplicateWorkspaceProject: (sourceId: string) => Promise<void>;
}

function collectSubtreeIds(rootId: string, edges: Edge[]): Set<string> {
	const byParent = new Map<string, string[]>();
	for (const e of edges) {
		const list = byParent.get(e.source);
		if (list) list.push(e.target);
		else byParent.set(e.source, [e.target]);
	}
	const ids = new Set<string>();
	const queue = [rootId];
	while (queue.length) {
		const id = queue.shift();
		if (id === undefined) break;
		ids.add(id);
		for (const c of byParent.get(id) ?? []) {
			if (!ids.has(c)) queue.push(c);
		}
	}
	return ids;
}

function slugFromLabel(label: string): string {
	const base = label
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9-]/gi, "");
	return base || "strona";
}

const initialNodes: SitemapFlowNode[] = [
	{
		id: "root",
		type: "sitemapNode",
		position: { x: 0, y: 0 },
		data: {
			label: "Strona główna",
			pathSegment: "",
			sections: [],
			seo: defaultPageSeo(),
		},
	},
];

const initialEdges: Edge[] = [];

function applyLayout(
	nodes: SitemapFlowNode[],
	edges: Edge[],
): SitemapFlowNode[] {
	return layoutSitemapNodes(nodes, edges, "TB");
}

function normalizeImportedNodes(raw: SitemapFlowNode[]): SitemapFlowNode[] {
	return raw.map((n) => {
		const rawSections = n.data?.sections;
		const sections: PageSection[] = Array.isArray(rawSections)
			? rawSections.map((s) => ({
					id: typeof s.id === "string" ? s.id : crypto.randomUUID(),
					title: typeof s.title === "string" ? s.title : "Sekcja",
					content: typeof s.content === "string" ? s.content : "",
				}))
			: [];
		const r = (
			n.data?.seo && typeof n.data.seo === "object"
				? n.data.seo
				: {}
		) as Partial<PageSeo>;
		const seo: PageSeo = {
			title: typeof r.title === "string" ? r.title : "",
			metaDescription:
				typeof r.metaDescription === "string" ? r.metaDescription : "",
			slug: typeof r.slug === "string" ? r.slug : "",
			h1: typeof r.h1 === "string" ? r.h1 : "",
			keyword: typeof r.keyword === "string" ? r.keyword : "",
			pageIntent: typeof r.pageIntent === "string" ? r.pageIntent : "",
		};

		return {
			...n,
			data: {
				...n.data,
				label: typeof n.data?.label === "string" ? n.data.label : "Strona",
				pathSegment:
					typeof n.data?.pathSegment === "string" ? n.data.pathSegment : "",
				sections,
				seo,
			},
		};
	});
}

export function createDefaultGraphJson(): string {
	const nodes = applyLayout(
		initialNodes.map((n) => ({
			...n,
			data: {
				...n.data,
				sections: [],
				seo: { ...defaultPageSeo() },
			},
		})),
		[],
	);
	return JSON.stringify({ nodes, edges: initialEdges });
}

const useStore = create<SitemapState>((set, get) => ({
	nodes: applyLayout(initialNodes, initialEdges),
	edges: initialEdges,
	selectedPageId: null,

	currentProjectId: null,
	projectsMeta: [],
	projectsReady: false,

	setSelectedPageId: (id) => set({ selectedPageId: id }),

	onNodesChange: (changes) => {
		const safe = changes.filter(
			(c) => !(c.type === "remove" && "id" in c && c.id === "root"),
		);
		const hadRemove = safe.some((c) => c.type === "remove");
		let nodes = applyNodeChanges(safe, get().nodes) as SitemapFlowNode[];
		const ids = new Set(nodes.map((n) => n.id));
		const edges = get().edges.filter(
			(e) => ids.has(e.source) && ids.has(e.target),
		);

		const sel = get().selectedPageId;
		const nextSel = sel && ids.has(sel) ? sel : null;

		if (hadRemove) {
			nodes = applyLayout(nodes, edges);
		}

		set({
			nodes,
			edges,
			selectedPageId: nextSel,
		});
	},

	onEdgesChange: (changes) => {
		set({
			edges: applyEdgeChanges(changes, get().edges),
		});
	},

	onConnect: (connection) => {
		if (!connection.source || !connection.target) return;
		set({
			edges: addEdge(
				{
					...connection,
					id: `e-${connection.source}-${connection.target}-${crypto.randomUUID().slice(0, 8)}`,
					type: "smoothstep",
				},
				get().edges,
			),
		});
	},

	addPage: (parentId, label) => {
		const newNodeId = crypto.randomUUID();
		const segment = slugFromLabel(label);
		const newNode: SitemapFlowNode = {
			id: newNodeId,
			type: "sitemapNode",
			position: { x: 0, y: 0 },
			data: {
				label,
				pathSegment: segment,
				sections: [],
				seo: defaultPageSeo(),
			},
		};
		const newEdge: Edge = {
			id: `e-${parentId}-${newNodeId}`,
			source: parentId,
			target: newNodeId,
			type: "smoothstep",
		};
		const nodes = [...get().nodes, newNode];
		const edges = [...get().edges, newEdge];
		set({
			nodes: applyLayout(nodes, edges),
			edges,
		});
	},

	updateNodeData: (id, partial) => {
		set({
			nodes: get().nodes.map((n) => {
				if (n.id !== id) return n;
				const { seo: partialSeo, sections: partialSections, ...rest } =
					partial;
				return {
					...n,
					data: {
						...n.data,
						...rest,
						sections:
							partialSections !== undefined
								? partialSections
								: (n.data.sections ?? []),
						seo: {
							...defaultPageSeo(),
							...(n.data.seo ?? {}),
							...(partialSeo ?? {}),
						},
					},
				};
			}),
		});
	},

	updateNodeSeo: (id, partial) => {
		set({
			nodes: get().nodes.map((n) =>
				n.id === id
					? {
							...n,
							data: {
								...n.data,
								sections: n.data.sections ?? [],
								seo: {
									...defaultPageSeo(),
									...(n.data.seo ?? {}),
									...partial,
								},
							},
						}
					: n,
			),
		});
	},

	syncPathSegmentFromSeoSlug: (id) => {
		if (id === "root") return;
		const node = get().nodes.find((n) => n.id === id);
		if (!node) return;
		const raw = node.data.seo?.slug?.trim() ?? "";
		if (!raw) return;
		const segment = slugFromLabel(raw);
		get().updateNodeData(id, { pathSegment: segment });
	},

	addSection: (pageId) => {
		const edges = get().edges;
		const nextNodes = get().nodes.map((node) => {
			if (node.id !== pageId) return node;
			const sections = [...(node.data.sections ?? [])];
			sections.push({
				id: crypto.randomUUID(),
				title: "Nowa sekcja",
				content: "",
			});
			return { ...node, data: { ...node.data, sections } };
		});
		set({ nodes: applyLayout(nextNodes, edges) });
	},

	updateSection: (pageId, sectionId, partial) => {
		set({
			nodes: get().nodes.map((node) => {
				if (node.id !== pageId) return node;
				const sections = (node.data.sections ?? []).map((s) =>
					s.id === sectionId ? { ...s, ...partial } : s,
				);
				return { ...node, data: { ...node.data, sections } };
			}),
		});
	},

	removeSection: (pageId, sectionId) => {
		const edges = get().edges;
		const nextNodes = get().nodes.map((node) => {
			if (node.id !== pageId) return node;
			return {
				...node,
				data: {
					...node.data,
					sections: (node.data.sections ?? []).filter(
						(s) => s.id !== sectionId,
					),
				},
			};
		});
		set({ nodes: applyLayout(nextNodes, edges) });
	},

	moveSection: (pageId, sectionId, direction) => {
		const edges = get().edges;
		const nextNodes = get().nodes.map((node) => {
			if (node.id !== pageId) return node;
			const sections = [...(node.data.sections ?? [])];
			const i = sections.findIndex((s) => s.id === sectionId);
			if (i < 0) return node;
			const j = direction === "up" ? i - 1 : i + 1;
			if (j < 0 || j >= sections.length) return node;
			const a = sections[i];
			const b = sections[j];
			if (!a || !b) return node;
			sections[i] = b;
			sections[j] = a;
			return { ...node, data: { ...node.data, sections } };
		});
		set({ nodes: applyLayout(nextNodes, edges) });
	},

	removeSubtree: (id) => {
		if (id === "root") return;
		const { nodes, edges, selectedPageId } = get();
		const removeIds = collectSubtreeIds(id, edges);
		const nextNodes = nodes.filter((n) => !removeIds.has(n.id));
		const nextEdges = edges.filter(
			(e) => !removeIds.has(e.source) && !removeIds.has(e.target),
		);
		set({
			nodes: applyLayout(nextNodes, nextEdges),
			edges: nextEdges,
			selectedPageId:
				selectedPageId && removeIds.has(selectedPageId)
					? null
					: selectedPageId,
		});
	},

	duplicatePage: (id) => {
		if (id === "root") return;
		const { nodes, edges } = get();
		const node = nodes.find((n) => n.id === id);
		if (!node) return;
		const parents = edges.filter((e) => e.target === id).map((e) => e.source);
		if (parents.length === 0) return;

		const newId = crypto.randomUUID();
		const newLabel = `${node.data.label} (kopia)`;
		const newSections = (node.data.sections ?? []).map((s) => ({
			...s,
			id: crypto.randomUUID(),
		}));
		const newSeo = { ...defaultPageSeo(), ...(node.data.seo ?? {}) };

		const newNode: SitemapFlowNode = {
			...node,
			id: newId,
			position: { ...node.position },
			selected: true,
			data: {
				...node.data,
				label: newLabel,
				pathSegment: slugFromLabel(newLabel),
				sections: newSections,
				seo: newSeo,
			},
		};

		const newEdges: Edge[] = parents.map((source) => ({
			id: `e-${source}-${newId}-${crypto.randomUUID().slice(0, 8)}`,
			source,
			target: newId,
			type: "smoothstep" as const,
		}));

		const cleared = nodes.map((n) => ({ ...n, selected: false }));
		const nextNodes = [...cleared, newNode];
		const nextEdges = [...edges, ...newEdges];

		set({
			nodes: applyLayout(nextNodes, nextEdges),
			edges: nextEdges,
			selectedPageId: newId,
		});
	},

	selectNode: (id) => {
		set({
			nodes: get().nodes.map((n) => ({
				...n,
				selected: id !== null && n.id === id,
			})),
			selectedPageId: id,
		});
	},

	runAutoLayout: () => {
		const { nodes, edges } = get();
		set({
			nodes: applyLayout(nodes, edges),
		});
	},

	exportJson: () => {
		const { nodes, edges } = get();
		return JSON.stringify({ nodes, edges }, null, 2);
	},

	exportMarkdown: () => {
		const { nodes, edges } = get();
		return exportSitemapMarkdown(nodes, edges);
	},

	importJson: (json) => {
		try {
			const parsed = JSON.parse(json) as {
				nodes?: SitemapFlowNode[];
				edges?: Edge[];
			};
			if (!parsed.nodes?.length) return;
			const nodes = normalizeImportedNodes(parsed.nodes);
			const edges = parsed.edges ?? [];
			set({
				nodes: applyLayout(nodes, edges),
				edges,
				selectedPageId: null,
			});
		} catch {
			// ignore invalid JSON
		}
	},

	reset: () => {
		clearAutosave();
		set({
			nodes: applyLayout(
				initialNodes.map((n) => ({
					...n,
					data: {
						...n.data,
						sections: (n.data.sections ?? []).map((s) => ({ ...s })),
						seo: { ...defaultPageSeo(), ...n.data.seo },
					},
				})),
				[],
			),
			edges: [],
			selectedPageId: null,
		});
	},

	flushCurrentProjectToDb: async () => {
		const { currentProjectId, projectsReady } = get();
		if (!currentProjectId || !projectsReady) return;
		const row = await getProjectRow(currentProjectId);
		if (!row) return;
		const graphJson = get().exportJson();
		await putProject({
			...row,
			graphJson,
			updatedAt: Date.now(),
		});
	},

	refreshProjectsMeta: async () => {
		const meta = await listProjectsMeta();
		set({ projectsMeta: meta });
	},

	createProject: async (name) => {
		await get().flushCurrentProjectToDb();
		const meta = await listProjectsMeta();
		const id = crypto.randomUUID();
		const defaultName =
			name?.trim() || `Projekt ${Math.max(1, meta.length + 1)}`;
		const graphJson = createDefaultGraphJson();
		await putProject({
			id,
			name: defaultName,
			updatedAt: Date.now(),
			graphJson,
		});
		get().importJson(graphJson);
		if (typeof localStorage !== "undefined") {
			localStorage.setItem(ACTIVE_PROJECT_LS_KEY, id);
		}
		set({ currentProjectId: id, selectedPageId: null });
		await get().refreshProjectsMeta();
		return id;
	},

	openProject: async (id) => {
		if (id === get().currentProjectId) return;
		await get().flushCurrentProjectToDb();
		const row = await getProjectRow(id);
		if (!row) return;
		get().importJson(row.graphJson);
		if (typeof localStorage !== "undefined") {
			localStorage.setItem(ACTIVE_PROJECT_LS_KEY, id);
		}
		set({ currentProjectId: id, selectedPageId: null });
		await get().refreshProjectsMeta();
	},

	deleteProject: async (id) => {
		if (id === get().currentProjectId) {
			await get().flushCurrentProjectToDb();
		}
		await deleteProjectRow(id);
		const meta = await listProjectsMeta();
		if (meta.length === 0) {
			const newId = crypto.randomUUID();
			const graphJson = createDefaultGraphJson();
			await putProject({
				id: newId,
				name: "Projekt 1",
				updatedAt: Date.now(),
				graphJson,
			});
			get().importJson(graphJson);
			if (typeof localStorage !== "undefined") {
				localStorage.setItem(ACTIVE_PROJECT_LS_KEY, newId);
			}
			set({
				currentProjectId: newId,
				projectsMeta: await listProjectsMeta(),
				selectedPageId: null,
			});
			return;
		}
		if (id === get().currentProjectId) {
			const next = meta[0];
			if (next) await get().openProject(next.id);
		} else {
			await get().refreshProjectsMeta();
		}
	},

	renameProject: async (id, name) => {
		const row = await getProjectRow(id);
		if (!row) return;
		const trimmed = name.trim();
		await putProject({
			...row,
			name: trimmed || row.name,
			updatedAt: Date.now(),
		});
		await get().refreshProjectsMeta();
	},

	duplicateWorkspaceProject: async (sourceId) => {
		await get().flushCurrentProjectToDb();
		const row = await getProjectRow(sourceId);
		if (!row) return;
		const newId = crypto.randomUUID();
		const newName = `${row.name} (kopia)`;
		await putProject({
			id: newId,
			name: newName,
			updatedAt: Date.now(),
			graphJson: row.graphJson,
		});
		await get().openProject(newId);
	},
}));

export default useStore;
