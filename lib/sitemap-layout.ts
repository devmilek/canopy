import dagre from "dagre";
import type { Edge, Node } from "@xyflow/react";

/** Domyślna szerokość — używana gdy brak `data.sections` w typie */
export const SITEMAP_NODE_WIDTH = 240;

/** Wysokość bloku: tytuł strony + URL + padding (zsynchronizuj z `SitemapNode`) */
const TOP_BLOCK = 58;
/** Nagłówek „Sekcje” + ramka wokół listy */
const SECTION_CHROME = 30;
const ROW_H = 36;
const MAX_VISIBLE_SECTIONS = 6;
const OVERFLOW_LABEL = 24;
const EMPTY_PREVIEW = 80;
const BOTTOM_GUTTER = 20;

type LayoutSectionData = {
	sections?: readonly unknown[] | null;
};

/** Wymiary węzła dla Dagre — zsynchronizowane z układem w `SitemapNode` */
export function getSitemapNodeLayoutSize(data: LayoutSectionData): {
	width: number;
	height: number;
} {
	const width = SITEMAP_NODE_WIDTH;
	const n = data.sections?.length ?? 0;

	if (n === 0) {
		return {
			width,
			height: TOP_BLOCK + EMPTY_PREVIEW + BOTTOM_GUTTER,
		};
	}

	const visible = Math.min(n, MAX_VISIBLE_SECTIONS);
	const overflow = n > MAX_VISIBLE_SECTIONS ? OVERFLOW_LABEL : 0;

	return {
		width,
		height:
			TOP_BLOCK +
			SECTION_CHROME +
			visible * ROW_H +
			overflow +
			BOTTOM_GUTTER,
	};
}

export function layoutSitemapNodes<T extends Record<string, unknown>>(
	nodes: Node<T>[],
	edges: Edge[],
	direction: "TB" | "LR" = "TB",
): Node<T>[] {
	if (nodes.length === 0) return nodes;

	const g = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
	g.setGraph({
		rankdir: direction,
		nodesep: 48,
		ranksep: 64,
		marginx: 48,
		marginy: 48,
	});

	for (const node of nodes) {
		const { width, height } = getSitemapNodeLayoutSize(
			node.data as LayoutSectionData,
		);
		g.setNode(node.id, { width, height });
	}
	for (const edge of edges) {
		g.setEdge(edge.source, edge.target);
	}

	dagre.layout(g);

	return nodes.map((node) => {
		const pos = g.node(node.id);
		if (!pos) return node;
		const { width, height } = getSitemapNodeLayoutSize(
			node.data as LayoutSectionData,
		);
		return {
			...node,
			position: {
				x: pos.x - width / 2,
				y: pos.y - height / 2,
			},
		};
	});
}
