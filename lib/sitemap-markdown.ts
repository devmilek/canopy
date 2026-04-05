import type { Edge } from "@xyflow/react";
import type { SitemapFlowNode } from "@/hooks/store";

function oneLine(s: string, max = 72): string {
	const t = s.replace(/\s+/g, " ").trim();
	if (!t) return "";
	return t.length <= max ? t : `${t.slice(0, max)}…`;
}

/** Drzewo stron z opcjonalnymi sekcjami — do Notion / Docs / briefu */
export function exportSitemapMarkdown(
	nodes: SitemapFlowNode[],
	edges: Edge[],
): string {
	const byId = new Map(nodes.map((n) => [n.id, n]));
	const children = new Map<string, string[]>();
	for (const e of edges) {
		const list = children.get(e.source);
		if (list) list.push(e.target);
		else children.set(e.source, [e.target]);
	}

	function walk(id: string, depth: number): string[] {
		const n = byId.get(id);
		if (!n) return [];
		const pad = "  ".repeat(depth);
		const lines: string[] = [`${pad}- **${n.data.label}**`];

		const seo = n.data.seo;
		if (seo) {
			const bits: string[] = [];
			if (seo.slug?.trim()) bits.push(`slug: \`${seo.slug.trim()}\``);
			if (seo.title?.trim()) bits.push(`title: ${oneLine(seo.title, 80)}`);
			if (seo.keyword?.trim()) bits.push(`keyword: ${seo.keyword.trim()}`);
			if (bits.length) lines.push(`${pad}  - _${bits.join(" · ")}_`);
		}

		for (const sec of n.data.sections ?? []) {
			const title = sec.title.trim() || "Sekcja";
			const body = oneLine(sec.content, 100);
			lines.push(
				`${pad}  - ${title}${body ? ` — ${body}` : ""}`,
			);
		}

		const ch = children.get(id) ?? [];
		for (const c of ch) {
			lines.push(...walk(c, depth + 1));
		}
		return lines;
	}

	const header = `# Mapa strony\n\n_Wygenerowano z Canopy._\n\n`;
	const body = walk("root", 0).join("\n");
	return header + body + "\n";
}
