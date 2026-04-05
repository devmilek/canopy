"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import useStore, { defaultPageSeo } from "@/hooks/store";
import { Button } from "@/components/ui/button";
import {
	ChevronDown,
	ChevronUp,
	LayoutList,
	Link2,
	Plus,
	Search,
	Trash2,
	X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type PanelTab = "sections" | "seo";

const fieldClass =
	"border-input bg-background text-foreground placeholder:text-muted-foreground w-full rounded-md border px-2 py-1.5 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring";

const panelShellClass =
	"border-border bg-card/95 flex min-h-0 flex-col overflow-hidden rounded-xl border shadow-sm backdrop-blur-sm " +
	/* desktop: side column, inset like top toolbar */
	"lg:relative lg:mr-3 lg:mt-3 lg:mb-3 lg:h-[calc(100svh-1.5rem)] lg:w-[min(100%,420px)] lg:max-w-[420px] lg:shrink-0 " +
	/* mobile: floating bottom sheet */
	"max-lg:fixed max-lg:top-auto max-lg:right-2 max-lg:bottom-[max(0.5rem,env(safe-area-inset-bottom))] max-lg:left-2 max-lg:z-50 max-lg:max-h-[min(88dvh,640px)] max-lg:h-auto max-lg:min-h-[36dvh] max-lg:w-auto max-lg:rounded-2xl max-lg:pb-[max(0.75rem,env(safe-area-inset-bottom))] max-lg:shadow-2xl";

export default function PageSectionsPanel() {
	const t = useTranslations("panel");
	const [tab, setTab] = useState<PanelTab>("sections");
	const nodes = useStore((s) => s.nodes);
	const selectedPageId = useStore((s) => s.selectedPageId);
	const selectNode = useStore((s) => s.selectNode);
	const addSection = useStore((s) => s.addSection);
	const updateSection = useStore((s) => s.updateSection);
	const removeSection = useStore((s) => s.removeSection);
	const moveSection = useStore((s) => s.moveSection);
	const updateNodeSeo = useStore((s) => s.updateNodeSeo);
	const syncPathSegmentFromSeoSlug = useStore((s) => s.syncPathSegmentFromSeoSlug);

	const page = useMemo(
		() => nodes.find((n) => n.id === selectedPageId),
		[nodes, selectedPageId],
	);

	const sections = page?.data.sections ?? [];

	const fullSeo = useMemo(() => {
		if (!page) return defaultPageSeo();
		return { ...defaultPageSeo(), ...(page.data.seo ?? {}) };
	}, [page]);

	const titleLen = fullSeo.title.length;
	const metaLen = fullSeo.metaDescription.length;

	if (!page) {
		return (
			<aside
				className={cn(panelShellClass, "max-lg:max-h-[50dvh] max-lg:min-h-0")}
				role="complementary"
				aria-label={t("title")}
			>
				<div className="border-border flex flex-col gap-2 border-b px-3 py-3 max-lg:pt-2">
					<div
						className="bg-muted/70 mx-auto hidden h-1 w-11 shrink-0 rounded-full max-lg:block"
						aria-hidden
					/>
					<div className="flex items-center gap-2">
						<LayoutList className="text-muted-foreground size-4 shrink-0" />
						<div className="min-w-0 flex-1">
							<h2 className="text-foreground text-sm font-semibold tracking-tight">
								{t("title")}
							</h2>
							<p className="text-muted-foreground truncate text-[11px]">{t("subtitlePick")}</p>
						</div>
					</div>
				</div>
				<div className="text-muted-foreground flex flex-1 items-center justify-center p-4 text-center text-xs leading-relaxed">
					{t("emptyCanvas")}
				</div>
			</aside>
		);
	}

	return (
		<aside
			className={cn(panelShellClass, "min-h-0 flex-1 lg:flex-none")}
			role="complementary"
			aria-label={t("title")}
		>
			<div className="border-border flex shrink-0 flex-col gap-2 border-b px-3 py-3 max-lg:pt-2">
				<div
					className="bg-muted/70 mx-auto hidden h-1 w-11 shrink-0 rounded-full max-lg:block"
					aria-hidden
				/>
				<div className="flex items-center gap-2">
					<LayoutList className="text-muted-foreground size-4 shrink-0" />
					<div className="min-w-0 flex-1">
						<h2 className="text-foreground text-sm font-semibold tracking-tight">{t("title")}</h2>
						<p className="text-muted-foreground truncate text-[11px]">{page.data.label}</p>
					</div>
					{selectedPageId ? (
						<Button
							variant="ghost"
							size="icon-xs"
							className="shrink-0"
							title={t("clearSelection")}
							aria-label={t("clearSelection")}
							onClick={() => selectNode(null)}
						>
							<X className="size-3.5" />
						</Button>
					) : null}
				</div>
			</div>

			<div className="border-border flex shrink-0 border-b p-1.5">
				<button
					type="button"
					onClick={() => setTab("sections")}
					className={cn(
						"flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors",
						tab === "sections"
							? "bg-muted text-foreground"
							: "text-muted-foreground hover:text-foreground",
					)}
				>
					<LayoutList className="size-3.5" />
					{t("tabSections")}
				</button>
				<button
					type="button"
					onClick={() => setTab("seo")}
					className={cn(
						"flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors",
						tab === "seo"
							? "bg-muted text-foreground"
							: "text-muted-foreground hover:text-foreground",
					)}
				>
					<Search className="size-3.5" />
					{t("tabSeo")}
				</button>
			</div>

			{tab === "sections" ? (
				<>
					<div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain p-3">
						{sections.length === 0 ? (
							<p className="text-muted-foreground text-xs">{t("noSections")}</p>
						) : (
							sections.map((sec, index) => (
								<div
									key={sec.id}
									className="border-border bg-background/80 space-y-2 rounded-lg border p-2.5"
								>
									<div className="flex items-start gap-1">
										<input
											className={cn(fieldClass, "min-w-0 flex-1 font-medium")}
											placeholder={t("sectionNamePlaceholder")}
											value={sec.title}
											onChange={(e) =>
												updateSection(page.id, sec.id, {
													title: e.target.value,
												})
											}
										/>
										<div className="flex shrink-0 flex-col gap-0.5">
											<Button
												variant="ghost"
												size="icon-xs"
												disabled={index === 0}
												title={t("moveUp")}
												onClick={() => moveSection(page.id, sec.id, "up")}
											>
												<ChevronUp className="size-3.5" />
											</Button>
											<Button
												variant="ghost"
												size="icon-xs"
												disabled={index >= sections.length - 1}
												title={t("moveDown")}
												onClick={() => moveSection(page.id, sec.id, "down")}
											>
												<ChevronDown className="size-3.5" />
											</Button>
										</div>
										<Button
											variant="ghost"
											size="icon-xs"
											className="text-muted-foreground hover:text-destructive shrink-0"
											title={t("removeSection")}
											onClick={() => removeSection(page.id, sec.id)}
										>
											<Trash2 className="size-3.5" />
										</Button>
									</div>
									<textarea
										className={cn(
											fieldClass,
											"min-h-[72px] resize-y leading-relaxed",
										)}
										placeholder={t("sectionContentPlaceholder")}
										rows={4}
										value={sec.content}
										onChange={(e) =>
											updateSection(page.id, sec.id, {
												content: e.target.value,
											})
										}
									/>
								</div>
							))
						)}
					</div>
					<div className="border-border shrink-0 border-t p-3">
						<Button
							variant="outline"
							size="sm"
							className="w-full"
							onClick={() => addSection(page.id)}
						>
							<Plus className="size-3.5" />
							{t("addSection")}
						</Button>
					</div>
				</>
			) : (
				<div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain p-3">
					<p className="text-muted-foreground text-[11px] leading-relaxed">{t("seoIntro")}</p>

					<div className="space-y-1">
						<label className="text-foreground text-[11px] font-medium">
							{t("titleLabel")}{" "}
							<span className="text-muted-foreground font-normal">
								{t("titleCount", { count: titleLen })}
							</span>
						</label>
						<input
							className={fieldClass}
							placeholder={t("titlePlaceholder")}
							value={fullSeo.title}
							onChange={(e) =>
								updateNodeSeo(page.id, { title: e.target.value })
							}
						/>
					</div>

					<div className="space-y-1">
						<label className="text-foreground text-[11px] font-medium">
							{t("metaLabel")}{" "}
							<span className="text-muted-foreground font-normal">
								{t("metaCount", { count: metaLen })}
							</span>
						</label>
						<textarea
							className={cn(fieldClass, "min-h-[68px] resize-y leading-relaxed")}
							placeholder={t("metaPlaceholder")}
							rows={3}
							value={fullSeo.metaDescription}
							onChange={(e) =>
								updateNodeSeo(page.id, {
									metaDescription: e.target.value,
								})
							}
						/>
					</div>

					<div className="space-y-1">
						<div className="flex items-center justify-between gap-2">
							<label className="text-foreground text-[11px] font-medium">{t("slugLabel")}</label>
							{page.id !== "root" ? (
								<Button
									variant="ghost"
									size="xs"
									className="h-6 gap-1 px-1.5 text-[10px]"
									type="button"
									title={t("syncSegmentTooltip")}
									onClick={() => syncPathSegmentFromSeoSlug(page.id)}
								>
									<Link2 className="size-3" />
									{t("syncSegment")}
								</Button>
							) : null}
						</div>
						<input
							className={cn(fieldClass, "font-mono")}
							placeholder={t("slugPlaceholder")}
							value={fullSeo.slug}
							onChange={(e) =>
								updateNodeSeo(page.id, { slug: e.target.value })
							}
						/>
						<p className="text-muted-foreground text-[10px] leading-snug">{t("slugHint")}</p>
					</div>

					<div className="space-y-1">
						<label className="text-foreground text-[11px] font-medium">{t("h1Label")}</label>
						<input
							className={fieldClass}
							placeholder={t("h1Placeholder")}
							value={fullSeo.h1}
							onChange={(e) =>
								updateNodeSeo(page.id, { h1: e.target.value })
							}
						/>
					</div>

					<div className="space-y-1">
						<label className="text-foreground text-[11px] font-medium">{t("keywordLabel")}</label>
						<input
							className={fieldClass}
							placeholder={t("keywordPlaceholder")}
							value={fullSeo.keyword}
							onChange={(e) =>
								updateNodeSeo(page.id, { keyword: e.target.value })
							}
						/>
					</div>

					<div className="space-y-1">
						<label className="text-foreground text-[11px] font-medium">{t("intentLabel")}</label>
						<textarea
							className={cn(fieldClass, "min-h-[72px] resize-y leading-relaxed")}
							placeholder={t("intentPlaceholder")}
							rows={3}
							value={fullSeo.pageIntent}
							onChange={(e) =>
								updateNodeSeo(page.id, { pageIntent: e.target.value })
							}
						/>
					</div>
				</div>
			)}
		</aside>
	);
}
