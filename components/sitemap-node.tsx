"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PageSection, SitemapNodeData } from "@/hooks/store";
import useStore from "@/hooks/store";
import { getSitemapNodeLayoutSize } from "@/lib/sitemap-layout";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { Layers, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_VISIBLE_SECTIONS = 6;

const SECTION_ACCENTS = [
	"from-primary to-primary/75",
	"from-sky-500 to-blue-600 dark:from-sky-400 dark:to-blue-500",
	"from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500",
	"from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-500",
	"from-rose-500 to-pink-600 dark:from-rose-400 dark:to-pink-500",
	"from-fuchsia-500 to-purple-600 dark:from-fuchsia-400 dark:to-purple-500",
] as const;

function buildUrlPath(
	nodeId: string,
	nodes: { id: string; data: SitemapNodeData }[],
	edges: { source: string; target: string }[],
): string {
	const parentByTarget = new Map<string, string>();
	for (const e of edges) {
		parentByTarget.set(e.target, e.source);
	}
	const segments: string[] = [];
	let cur: string | undefined = nodeId;
	while (cur) {
		const n = nodes.find((x) => x.id === cur);
		if (n?.data.pathSegment) segments.unshift(n.data.pathSegment);
		cur = parentByTarget.get(cur);
	}
	if (segments.length === 0) return "/";
	return "/" + segments.join("/");
}

function snippetLine(content: string, max = 40): string {
	const t = content.replace(/\s+/g, " ").trim();
	if (!t) return "";
	return t.length <= max ? t : `${t.slice(0, max)}…`;
}

function SectionsWireframe({ sections }: { sections: PageSection[] }) {
	const t = useTranslations("editor");

	if (sections.length === 0) {
		return (
			<div className="pointer-events-none px-2 pb-2">
				<div className="from-muted/20 to-muted/5 flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/20 bg-gradient-to-b px-2 py-3.5 text-center">
					<Layers className="text-muted-foreground/50 mb-1 size-5" strokeWidth={1.25} />
					<p className="text-muted-foreground text-[10px] font-medium">
						{t("nodeEmptySections")}
					</p>
					<p className="text-muted-foreground/75 mt-0.5 text-[9px] leading-snug">
						{t("nodeEmptySectionsHint")}
					</p>
				</div>
			</div>
		);
	}

	const visible = sections.slice(0, MAX_VISIBLE_SECTIONS);
	const rest = sections.length - visible.length;

	return (
		<div className="pointer-events-none px-2 pb-2">
			<div className="border-border/50 from-primary/[0.06] to-muted/30 rounded-lg border bg-gradient-to-b p-1.5 shadow-[inset_0_1px_0_0_var(--color-border)]">
				<div className="text-muted-foreground mb-1 flex items-center gap-1 px-0.5">
					<Layers className="size-2.5 opacity-70" strokeWidth={2.5} />
					<span className="text-[8px] font-bold tracking-widest uppercase opacity-80">
						{t("nodeSectionsLabel")}
					</span>
				</div>
				<ul className="flex flex-col gap-1">
					{visible.map((s, i) => {
						const extra = snippetLine(s.content);
						return (
							<li
								key={s.id}
								className="border-border/40 bg-card/95 flex h-9 min-h-9 items-stretch overflow-hidden rounded-md border shadow-sm"
							>
								<div
									className={cn(
										"w-1 shrink-0 bg-gradient-to-b",
										SECTION_ACCENTS[i % SECTION_ACCENTS.length],
									)}
									aria-hidden
								/>
								<div className="flex min-w-0 flex-1 items-center gap-1.5 px-2">
									<span className="bg-muted text-muted-foreground flex size-5 shrink-0 items-center justify-center rounded-md text-[9px] font-bold tabular-nums">
										{i + 1}
									</span>
									<p className="text-foreground min-w-0 flex-1 truncate text-[10px] leading-tight">
										<span className="font-semibold">
											{s.title.trim() || t("nodeUnnamed")}
										</span>
										{extra ? (
											<span className="text-muted-foreground font-normal">
												{" "}
												· {extra}
											</span>
										) : null}
									</p>
								</div>
							</li>
						);
					})}
				</ul>
				{rest > 0 ? (
					<p className="text-muted-foreground mt-1 text-center text-[9px] font-medium tabular-nums">
						{t("nodeExtraSections", { count: rest })}
					</p>
				) : null}
			</div>
		</div>
	);
}

export default function SitemapNode({
	id,
	data,
	selected,
}: NodeProps<Node<SitemapNodeData>>) {
	const t = useTranslations("editor");
	const addPage = useStore((s) => s.addPage);
	const updateNodeData = useStore((s) => s.updateNodeData);
	const removeSubtree = useStore((s) => s.removeSubtree);
	const allNodes = useStore((s) => s.nodes);
	const edges = useStore((s) => s.edges);

	const [editing, setEditing] = useState(false);
	const [draftLabel, setDraftLabel] = useState<string>(data.label);
	const inputRef = useRef<HTMLInputElement>(null);

	const sections = data.sections ?? [];

	const dims = useMemo(() => getSitemapNodeLayoutSize(data), [data]);

	useEffect(() => {
		if (editing) inputRef.current?.focus();
	}, [editing]);

	const urlPath = useMemo(
		() => buildUrlPath(id, allNodes, edges),
		[id, allNodes, edges],
	);

	const commitLabel = useCallback(() => {
		const label = draftLabel.trim() || t("nodeUnnamed");
		const fallbackSeg = t("nodeUrlFallback");
		updateNodeData(id, {
			label,
			pathSegment:
				id === "root"
					? ""
					: label
							.toLowerCase()
							.replace(/\s+/g, "-")
							.replace(/[^a-z0-9-]/gi, "") || fallbackSeg,
		});
		setEditing(false);
	}, [draftLabel, id, updateNodeData, t]);

	const handleAddChild = (e: React.MouseEvent) => {
		e.stopPropagation();
		addPage(id, t("nodeNewPage"));
	};

	const handleRemove = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (id === "root") return;
		removeSubtree(id);
	};

	return (
		<div
			style={{ width: dims.width }}
			className={cn(
				"bg-card text-card-foreground border-border relative cursor-grab rounded-xl border shadow-md transition-[box-shadow,border-color] duration-200 select-none active:cursor-grabbing",
				"group hover:border-primary/35 hover:shadow-lg",
				selected && "border-primary ring-ring/35 ring-2",
			)}
		>
			<Handle
				type="target"
				position={Position.Top}
				className="border-background! h-2.5! w-2.5! bg-muted-foreground/60! opacity-0 transition-opacity group-hover:opacity-100"
			/>

			{id !== "root" && (
				<button
					type="button"
					title={t("nodeDeleteTitle")}
					onClick={handleRemove}
					className="text-muted-foreground hover:text-destructive absolute top-2 right-2 z-10 rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100"
				>
					<Trash2 className="size-3.5" />
				</button>
			)}

			<div className="px-3 pt-3 pb-1">
				{editing ? (
					<input
						ref={inputRef}
						className="border-input bg-background text-foreground w-full rounded-md border px-2 py-1 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring"
						value={draftLabel}
						onChange={(e) => setDraftLabel(e.target.value)}
						onBlur={commitLabel}
						onKeyDown={(e) => {
							if (e.key === "Enter") commitLabel();
							if (e.key === "Escape") {
								setDraftLabel(data.label);
								setEditing(false);
							}
						}}
						onClick={(e) => e.stopPropagation()}
					/>
				) : (
					<button
						type="button"
						className="hover:text-primary w-full text-left"
						onDoubleClick={(e) => {
							e.stopPropagation();
							setDraftLabel(data.label);
							setEditing(true);
						}}
					>
						<div className="text-sm font-semibold tracking-tight">
							{data.label}
						</div>
						<div className="text-muted-foreground mt-0.5 truncate font-mono text-[10px] leading-tight">
							{urlPath}
						</div>
					</button>
				)}
			</div>

			<SectionsWireframe sections={sections} />

			<div className="pointer-events-none absolute -bottom-3.5 left-1/2 z-10 -translate-x-1/2 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
				<button
					type="button"
					onClick={handleAddChild}
					className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-full text-lg font-light shadow-md transition-transform hover:scale-105"
					title={t("nodeAddChildTitle")}
				>
					<Plus className="size-4" strokeWidth={2.5} />
				</button>
			</div>

			<Handle
				type="source"
				position={Position.Bottom}
				className="border-background! h-2.5! w-2.5! bg-primary! opacity-0 transition-opacity group-hover:opacity-100"
			/>
		</div>
	);
}
