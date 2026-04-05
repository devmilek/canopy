"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useRef } from "react";
import { Panel, useReactFlow } from "@xyflow/react";
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
	TooltipTrigger,
} from "@/components/ui/tooltip";
import useStore from "@/hooks/store";
import {
	Copy,
	Download,
	FileJson,
	FileText,
	LayoutGrid,
	Menu,
	RotateCcw,
	Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ToolbarSearch } from "./toolbar-search";

const iconBtn =
	"border-input bg-background/90 hover:bg-muted/80 size-8 shrink-0 rounded-lg border p-0 shadow-none";

export function SitemapToolbar() {
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
