import type { NodeTypes } from "@xyflow/react";
import SitemapNode from "@/components/sitemap-node";

export const sitemapNodeTypes: NodeTypes = {
	sitemapNode: SitemapNode,
};

export const sitemapDefaultEdgeOptions = {
	type: "smoothstep" as const,
	style: {
		strokeWidth: 2,
		stroke: "var(--primary)",
	},
};
