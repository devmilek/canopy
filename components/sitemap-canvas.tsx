"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PageSectionsPanel from "@/components/page-sections-panel";
import ProjectPersistenceBridge from "@/components/project-persistence-bridge";
import ProjectSwitcher from "@/components/project-switcher";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	ReactFlow,
	Background,
	Controls,
	MiniMap,
	Panel,
	ReactFlowProvider,
	useReactFlow,
	type NodeTypes,
	type OnSelectionChangeFunc,
} from "@xyflow/react";
import useStore, { type SitemapFlowNode } from "@/hooks/store";
import SitemapNode from "@/components/sitemap-node";
import {
	Copy,
	Download,
	FileJson,
	FileText,
	LayoutGrid,
	Menu,
	MousePointerClick,
	Search,
	Upload,
	RotateCcw,
	X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

const SELECT_HINT_DISMISSED_KEY = "canopy.dismissSelectHint";

const nodeTypes: NodeTypes = {
	sitemapNode: SitemapNode,
};

const defaultEdgeOptions = {
	type: "smoothstep" as const,
	style: {
		strokeWidth: 2,
		stroke: "var(--primary)",
	},
};

function FlowKeyboardShortcuts() {
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

function ToolbarSearch() {
	const t = useTranslations("editor");
	const nodes = useStore((s) => s.nodes);
	const selectNode = useStore((s) => s.selectNode);
	const { fitView } = useReactFlow();
	const [q, setQ] = useState("");
	const [open, setOpen] = useState(false);

	const matches = useMemo(() => {
		const text = q.trim().toLowerCase();
		if (!text) return [];
		return nodes
			.filter((n) => n.data.label.toLowerCase().includes(text))
			.slice(0, 8);
	}, [nodes, q]);

	const pick = useCallback(
		(id: string) => {
			selectNode(id);
			setOpen(false);
			setQ("");
			requestAnimationFrame(() => {
				fitView({
					nodes: [{ id }],
					padding: 0.4,
					maxZoom: 1.25,
					duration: 280,
				});
			});
		},
		[fitView, selectNode],
	);

	return (
		<div className="relative hidden max-w-[min(200px,28vw)] min-w-[120px] flex-1 md:block sm:max-w-[200px] sm:min-w-[140px]">
			<InputGroup>
				<InputGroupAddon>
					<Search />
				</InputGroupAddon>
				<InputGroupInput
					id="sitemap-search"
					type="search"
					autoComplete="off"
					value={q}
					placeholder={t("searchPlaceholder")}
					onChange={(e) => setQ(e.target.value)}
					onFocus={() => setOpen(true)}
					onBlur={() => {
						window.setTimeout(() => setOpen(false), 180);
					}}
				/>
			</InputGroup>
			{open && q.trim() && matches.length > 0 ? (
				<ul className="border-border bg-card text-card-foreground absolute top-full left-0 z-50 mt-1 max-h-48 w-full min-w-[200px] overflow-auto rounded-lg border py-1 shadow-md">
					{matches.map((n) => (
						<li key={n.id}>
							<button
								type="button"
								className="hover:bg-muted focus:bg-muted w-full px-2 py-1.5 text-left text-xs"
								onMouseDown={(e) => e.preventDefault()}
								onClick={() => pick(n.id)}
							>
								{n.data.label}
							</button>
						</li>
					))}
				</ul>
			) : null}
		</div>
	);
}

function Toolbar() {
	const t = useTranslations("editor");
	const nodes = useStore((s) => s.nodes);
	const runAutoLayout = useStore((s) => s.runAutoLayout);
	const exportJson = useStore((s) => s.exportJson);
	const exportMarkdown = useStore((s) => s.exportMarkdown);
	const importJson = useStore((s) => s.importJson);
	const reset = useStore((s) => s.reset);
	const duplicatePage = useStore((s) => s.duplicatePage);
	const { fitView } = useReactFlow();
	const fileRef = useRef<HTMLInputElement>(null);

	const stats = useMemo(() => {
		const pages = nodes.length;
		const sec = nodes.reduce((a, n) => a + (n.data.sections?.length ?? 0), 0);
		return t("stats", { pages, sections: sec });
	}, [nodes, t]);

	const selected = useMemo(() => nodes.filter((n) => n.selected), [nodes]);
	const canDuplicate =
		selected.length === 1 && selected[0] && selected[0].id !== "root";

	const handleLayout = useCallback(() => {
		runAutoLayout();
		requestAnimationFrame(() => {
			fitView({ padding: 0.2, duration: 300 });
		});
	}, [fitView, runAutoLayout]);

	const handleExportJson = useCallback(() => {
		const blob = new Blob([exportJson()], { type: "application/json" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = "sitemap.json";
		a.click();
		URL.revokeObjectURL(a.href);
	}, [exportJson]);

	const handleExportMd = useCallback(() => {
		const blob = new Blob([exportMarkdown()], {
			type: "text/markdown;charset=utf-8",
		});
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = "sitemap.md";
		a.click();
		URL.revokeObjectURL(a.href);
	}, [exportMarkdown]);

	const onFile = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;
			const reader = new FileReader();
			reader.onload = () => {
				const text = String(reader.result ?? "");
				importJson(text);
				requestAnimationFrame(() => {
					fitView({ padding: 0.2, duration: 300 });
				});
			};
			reader.readAsText(file);
			e.target.value = "";
		},
		[importJson, fitView],
	);

	const handleDuplicate = useCallback(() => {
		const one = selected[0];
		if (one && one.id !== "root") duplicatePage(one.id);
	}, [duplicatePage, selected]);

	const iconBtn =
		"border-input bg-background/90 hover:bg-muted/80 size-8 shrink-0 rounded-lg border p-0 shadow-none";

	return (
		<Panel
			position="top-left"
			className="bg-card/95 border-border !m-0 flex flex-wrap items-center gap-0.5 rounded-xl border p-1 shadow-sm backdrop-blur-sm !top-2 !right-2 !left-2 max-md:flex-nowrap max-md:gap-2 max-md:p-2.5 sm:!top-3 sm:!right-3 sm:!left-3 sm:gap-2 md:p-2 lg:flex-nowrap lg:gap-2"
		>
			<div className="flex min-w-0 flex-1 flex-wrap items-center gap-0.5 max-md:gap-2 max-md:flex-nowrap sm:gap-2 lg:flex-nowrap">
				<div className="border-border mr-0.5 flex min-w-0 shrink-0 items-center gap-2 border-r pr-2 max-md:mr-0 max-md:border-r-0 max-md:pr-0 sm:mr-1 sm:pr-3">
					<Image
						src="/logo.svg"
						alt=""
						width={28}
						height={28}
						className="size-7 shrink-0"
						unoptimized
					/>
					<div className="min-w-0 max-md:hidden">
						<div className="text-foreground text-sm font-semibold tracking-tight">
							Canopy
						</div>
						<div className="text-muted-foreground text-[10px]">
							{stats} · {t("brandSubtitle")}
						</div>
					</div>
				</div>

				<div className="min-w-0 max-md:flex-1">
					<ProjectSwitcher />
				</div>

				<ToolbarSearch />

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							className={cn(iconBtn, "max-md:hidden")}
							onClick={handleLayout}
						>
							<LayoutGrid className="size-3.5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="bottom">{t("layoutTooltip")}</TooltipContent>
				</Tooltip>
			</div>

			<div className="border-border hidden shrink-0 items-center gap-1 border-l pl-2 lg:ml-1 lg:flex xl:gap-1.5 xl:pl-2.5">
				<Tooltip>
					<TooltipTrigger asChild>
						<span className="inline-flex">
							<Button
								variant="outline"
								size="icon"
								className={iconBtn}
								disabled={!canDuplicate}
								onClick={handleDuplicate}
							>
								<Copy className="size-3.5" />
							</Button>
						</span>
					</TooltipTrigger>
					<TooltipContent side="bottom">{t("duplicateTooltip")}</TooltipContent>
				</Tooltip>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							className={iconBtn}
							title={t("exportMenuTooltip")}
						>
							<Download className="size-3.5" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="min-w-[9rem]">
						<DropdownMenuItem onClick={handleExportJson}>
							{t("exportJson")}
						</DropdownMenuItem>
						<DropdownMenuItem onClick={handleExportMd}>
							{t("exportMarkdown")}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							className={iconBtn}
							onClick={() => fileRef.current?.click()}
						>
							<Upload className="size-3.5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="bottom">{t("importTooltip")}</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="size-8 shrink-0"
							onClick={reset}
						>
							<RotateCcw className="size-3.5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="bottom">{t("resetTooltip")}</TooltipContent>
				</Tooltip>
			</div>

			<div className="shrink-0 lg:hidden">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							className={iconBtn}
							aria-label={t("moreActionsAria")}
							title={t("moreActions")}
						>
							<Menu className="size-3.5" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="min-w-[11.5rem]">
						<DropdownMenuItem className="md:hidden" onClick={handleLayout}>
							<LayoutGrid className="size-3.5" />
							{t("layout")}
						</DropdownMenuItem>
						<DropdownMenuSeparator className="md:hidden" />
						<DropdownMenuItem
							disabled={!canDuplicate}
							onClick={handleDuplicate}
						>
							<Copy className="size-3.5" />
							{t("duplicate")}
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuLabel className="text-muted-foreground text-xs font-normal">
							{t("exportMenuTooltip")}
						</DropdownMenuLabel>
						<DropdownMenuItem onClick={handleExportJson}>
							<FileJson className="size-3.5" />
							{t("exportJson")}
						</DropdownMenuItem>
						<DropdownMenuItem onClick={handleExportMd}>
							<FileText className="size-3.5" />
							{t("exportMarkdown")}
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => {
								fileRef.current?.click();
							}}
						>
							<Upload className="size-3.5" />
							{t("import")}
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem variant="destructive" onClick={reset}>
							<RotateCcw className="size-3.5" />
							{t("reset")}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<input
				ref={fileRef}
				type="file"
				accept="application/json,.json"
				className="hidden"
				onChange={onFile}
			/>
		</Panel>
	);
}

function SelectPageHint() {
	const t = useTranslations("editor");
	const [hydrated, setHydrated] = useState(false);
	const [dismissed, setDismissed] = useState(false);

	useEffect(() => {
		try {
			setDismissed(localStorage.getItem(SELECT_HINT_DISMISSED_KEY) === "1");
		} catch {
			/* private mode */
		}
		setHydrated(true);
	}, []);

	const dismiss = useCallback(() => {
		try {
			localStorage.setItem(SELECT_HINT_DISMISSED_KEY, "1");
		} catch {
			/* ignore */
		}
		setDismissed(true);
	}, []);

	if (!hydrated || dismissed) return null;

	return (
		<Panel
			position="top-right"
			className="border-border bg-card/95 text-card-foreground !m-0 max-w-[min(320px,calc(100vw-1.25rem))] rounded-xl border p-3 shadow-sm backdrop-blur-sm !right-2 !top-2 sm:!right-3 sm:!top-3 max-lg:!top-[6.5rem] lg:!top-3 lg:max-w-[min(300px,calc(100vw-2rem))]"
		>
			<div className="flex gap-2">
				<MousePointerClick
					className="text-primary mt-0.5 size-4 shrink-0"
					aria-hidden
				/>
				<div className="min-w-0 flex-1">
					<p className="text-sm font-semibold leading-tight">
						{t("selectHintTitle")}
					</p>
					<p className="text-muted-foreground mt-1 text-xs leading-relaxed">
						{t("selectHintBody")}
					</p>
				</div>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="text-muted-foreground hover:text-foreground size-8 shrink-0"
					aria-label={t("selectHintDismiss")}
					title={t("selectHintDismiss")}
					onClick={dismiss}
				>
					<X className="size-4" />
				</Button>
			</div>
		</Panel>
	);
}

function Flow() {
	const t = useTranslations("editor");
	const nodes = useStore((s) => s.nodes);
	const edges = useStore((s) => s.edges);
	const onNodesChange = useStore((s) => s.onNodesChange);
	const onEdgesChange = useStore((s) => s.onEdgesChange);
	const onConnect = useStore((s) => s.onConnect);
	const setSelectedPageId = useStore((s) => s.setSelectedPageId);
	const selectedPageId = useStore((s) => s.selectedPageId);
	const { fitView } = useReactFlow();

	const onSelectionChange = useCallback<OnSelectionChangeFunc<SitemapFlowNode>>(
		({ nodes: selectedNodes }) => {
			if (selectedNodes.length !== 1) {
				setSelectedPageId(null);
				return;
			}
			const only = selectedNodes[0];
			setSelectedPageId(only ? only.id : null);
		},
		[setSelectedPageId],
	);

	return (
		<ReactFlow
			nodes={nodes}
			edges={edges}
			onNodesChange={onNodesChange}
			onEdgesChange={onEdgesChange}
			onConnect={onConnect}
			onSelectionChange={onSelectionChange}
			nodeTypes={nodeTypes}
			defaultEdgeOptions={defaultEdgeOptions}
			fitView
			minZoom={0.15}
			maxZoom={1.5}
			proOptions={{ hideAttribution: true }}
			onInit={() => {
				requestAnimationFrame(() => fitView({ padding: 0.2, duration: 0 }));
			}}
		>
			<FlowKeyboardShortcuts />
			<Background
				gap={20}
				size={1}
				className="bg-gradient-to-br from-muted/50 via-background to-primary/[0.04]"
			/>
			<Controls
				className="bg-card! border-border! overflow-hidden rounded-lg! border! shadow-sm!"
				showInteractive={false}
			/>
			<MiniMap
				className={cn(
					"border-border! rounded-lg! border! bg-card/90!",
					"hidden md:block",
				)}
				maskColor="var(--background)"
				nodeClassName={cn("rounded! border! border-primary/30! bg-primary/20!")}
			/>
			<Toolbar />
			{!selectedPageId ? <SelectPageHint /> : null}
			<Panel
				position="bottom-center"
				className="text-muted-foreground mb-3 hidden max-w-[min(720px,94vw)] text-center text-[10px] leading-snug sm:mb-4 sm:text-[11px] md:block"
			>
				{t("hints")}{" "}
				<kbd className="bg-muted rounded px-1 py-0.5 font-mono">Del</kbd> —{" "}
				{t("hintsDelete")}{" "}
				<kbd className="bg-muted rounded px-1 py-0.5 font-mono">⌘K</kbd> —{" "}
				{t("hintsSearch")}{" "}
				<kbd className="bg-muted rounded px-1 py-0.5 font-mono">⌘D</kbd> —{" "}
				{t("hintsDuplicate")}{" "}
				<kbd className="bg-muted rounded px-1 py-0.5 font-mono">d</kbd> —{" "}
				{t("hintsTheme")}
			</Panel>
		</ReactFlow>
	);
}

export default function SitemapCanvas() {
	const tPanel = useTranslations("panel");
	const selectedPageId = useStore((s) => s.selectedPageId);
	const selectNode = useStore((s) => s.selectNode);

	return (
		<TooltipProvider delayDuration={300}>
			<div className="relative flex h-svh w-full min-w-0">
				{selectedPageId ? (
					<button
						type="button"
						className="bg-background/50 fixed inset-0 z-40 backdrop-blur-[1px] lg:hidden"
						aria-label={tPanel("closeOverlay")}
						onClick={() => selectNode(null)}
					/>
				) : null}
				<div className="relative z-0 min-h-0 min-w-0 flex-1">
					<ReactFlowProvider>
						<ProjectPersistenceBridge />
						<Flow />
					</ReactFlowProvider>
				</div>
				{selectedPageId ? <PageSectionsPanel /> : null}
			</div>
		</TooltipProvider>
	);
}
