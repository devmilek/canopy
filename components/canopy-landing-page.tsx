"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import {
	ArrowRight,
	Check,
	FolderTree,
	LayoutGrid,
	Search,
	Sparkles,
	Zap,
} from "lucide-react";

const featureIcons = [LayoutGrid, FolderTree, Search, Zap] as const;

export function CanopyLandingPage() {
	const t = useTranslations("landing");

	const faqItems = [
		{ q: t("faq1Q"), a: t("faq1A") },
		{ q: t("faq2Q"), a: t("faq2A") },
		{ q: t("faq3Q"), a: t("faq3A") },
		{ q: t("faq4Q"), a: t("faq4A") },
	];

	const features = [
		{ icon: featureIcons[0], titleKey: "feature1Title", bodyKey: "feature1Body" },
		{ icon: featureIcons[1], titleKey: "feature2Title", bodyKey: "feature2Body" },
		{ icon: featureIcons[2], titleKey: "feature3Title", bodyKey: "feature3Body" },
		{ icon: featureIcons[3], titleKey: "feature4Title", bodyKey: "feature4Body" },
	] as const;

	const howSteps = [
		{ titleKey: "howStep1Title", bodyKey: "howStep1Body" },
		{ titleKey: "howStep2Title", bodyKey: "howStep2Body" },
		{ titleKey: "howStep3Title", bodyKey: "howStep3Body" },
	] as const;

	return (
		<div className="text-foreground bg-background relative min-h-svh overflow-x-hidden">
			<div
				className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
				aria-hidden
			>
				<div className="bg-primary/18 absolute -top-40 right-[-12%] size-[min(92vw,560px)] rounded-full blur-3xl" />
				<div className="bg-primary/12 absolute top-[38%] -left-[18%] size-[min(85vw,480px)] rounded-full blur-3xl" />
				<div className="from-primary/8 absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t to-transparent" />
				<div
					className="absolute inset-0 opacity-[0.4] mix-blend-multiply dark:mix-blend-soft-light dark:opacity-20"
					style={{
						backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
					}}
				/>
				<div
					className="text-primary/12 absolute inset-0 opacity-[0.45] dark:opacity-[0.15]"
					style={{
						backgroundImage:
							"linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
						backgroundSize: "48px 48px",
					}}
				/>
			</div>

			<header className="border-border/40 bg-background/80 relative z-10 border-b border-dashed backdrop-blur-md">
				<div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:gap-4 sm:px-6">
					<Link
						href="/"
						className="flex min-w-0 items-center gap-2 transition-opacity hover:opacity-90 sm:gap-3"
					>
						<Image
							src="/logo.svg"
							alt=""
							width={40}
							height={40}
							priority
							className="size-9 shrink-0 sm:size-10"
						/>
						<span className="text-primary font-[family-name:var(--font-display)] truncate text-lg font-bold tracking-tight sm:text-2xl">
							{siteConfig.name}
						</span>
					</Link>
					<div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5 sm:gap-2">
						<LocaleSwitcher />
						<Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
							<Link href="/#features">{t("navFeatures")}</Link>
						</Button>
						<Button variant="ghost" size="sm" className="hidden md:inline-flex" asChild>
							<Link href="/#how">{t("navHow")}</Link>
						</Button>
						<Button size="sm" className="gap-1.5 shadow-sm" asChild>
							<Link href="/app">
								<span className="max-[380px]:sr-only">{t("navOpenEditor")}</span>
								<span className="hidden max-[380px]:inline">App</span>
								<ArrowRight className="size-3.5" />
							</Link>
						</Button>
					</div>
				</div>
			</header>

			<main>
				<section className="relative z-10 mx-auto max-w-6xl px-4 pt-12 pb-20 sm:px-6 sm:pt-16 lg:pt-24">
					<div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
						<div className="max-w-xl space-y-8">
							<div className="flex flex-wrap items-center gap-2">
								<Badge
									variant="outline"
									className="border-primary/45 text-primary border-dashed font-medium"
								>
									<Sparkles className="size-3" />
									{t("badgePrimary")}
								</Badge>
								<Badge variant="secondary" className="font-normal">
									{t("badgeOffline")}
								</Badge>
							</div>
							<h1
								className="font-[family-name:var(--font-display)] text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-[3.25rem]"
								style={{
									textShadow:
										"0 0 100px color-mix(in oklch, var(--primary) 16%, transparent)",
								}}
							>
								{t("heroTitle")}{" "}
								<span className="text-primary">{t("heroTitleAccent")}</span>
							</h1>
							<p className="text-muted-foreground text-lg leading-relaxed text-pretty">
								{t("heroDescription")}
							</p>
							<div className="flex flex-wrap items-center gap-3">
								<Button size="lg" className="h-11 gap-2 px-6 text-base shadow-md" asChild>
									<Link href="/app">
										{t("heroCtaPrimary")}
										<ArrowRight className="size-4" />
									</Link>
								</Button>
								<Button variant="outline" size="lg" className="h-11" asChild>
									<Link href="/#how">{t("heroCtaSecondary")}</Link>
								</Button>
							</div>
							<p className="text-muted-foreground text-xs">
								{t("heroFootnote")}{" "}
								<kbd className="bg-muted rounded px-1 py-0.5 font-mono">d</kbd>{" "}
								{t("heroFootnoteTheme")}
							</p>
						</div>

						<div
							className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none"
							style={{ perspective: "1200px" }}
						>
							<div className="border-primary/35 bg-card/90 relative rotate-1 rounded-2xl border-2 p-6 shadow-[12px_18px_0_0_color-mix(in_oklch,var(--foreground)_8%,transparent)] backdrop-blur-sm transition-transform duration-500 hover:rotate-0 dark:shadow-[12px_18px_0_0_color-mix(in_oklch,var(--foreground)_18%,transparent)]">
								<div className="mb-4 flex items-center justify-between gap-2">
									<span className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
										{t("previewLabel")}
									</span>
									<span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-[10px] font-semibold">
										{t("previewLive")}
									</span>
								</div>
								<div className="relative space-y-3 pl-2">
									<div
										className="animate-in fade-in slide-in-from-bottom-3 fill-mode-both flex flex-col gap-2 duration-500"
										style={{ animationDelay: "0ms" }}
									>
										<div className="border-primary/45 bg-background w-4/5 rounded-lg border-2 px-3 py-2.5 text-sm font-semibold shadow-sm">
											{t("previewHome")}
										</div>
										<div className="from-muted-foreground/30 ml-3 h-6 w-px bg-gradient-to-b to-transparent" />
									</div>
									<div
										className="animate-in fade-in slide-in-from-bottom-3 fill-mode-both flex flex-wrap gap-2 pl-4 duration-500"
										style={{ animationDelay: "120ms" }}
									>
										<div className="bg-background rounded-lg border px-3 py-2 text-xs font-medium shadow-sm">
											{t("previewNode1")}
										</div>
										<div className="bg-background rounded-lg border px-3 py-2 text-xs font-medium shadow-sm">
											{t("previewNode2")}
										</div>
										<div className="border-primary/60 bg-background rounded-lg border-2 px-3 py-2 text-xs font-semibold shadow-sm">
											{t("previewNode3")}
										</div>
									</div>
									<div
										className="animate-in fade-in slide-in-from-bottom-3 fill-mode-both text-muted-foreground pt-2 pl-4 text-[11px] duration-500"
										style={{ animationDelay: "240ms" }}
									>
										{t("previewFootnote")}
									</div>
								</div>
							</div>
							<div
								className="border-border/50 bg-background/80 absolute -right-4 -bottom-6 max-w-[200px] rotate-[-4deg] rounded-xl border p-3 text-xs shadow-lg backdrop-blur-md sm:-right-8"
								style={{ animationDelay: "400ms" }}
							>
								<p className="font-medium">{t("previewStickerTitle")}</p>
								<p className="text-muted-foreground mt-1 leading-snug">
									{t("previewStickerBody")}
								</p>
							</div>
						</div>
					</div>
				</section>

				<section
					id="problem"
					className="border-border/30 relative z-10 border-y bg-gradient-to-b from-muted/30 to-transparent py-20 dark:from-muted/10"
				>
					<div className="mx-auto max-w-6xl px-4 sm:px-6">
						<p className="text-primary mb-2 text-xs font-semibold tracking-widest uppercase">
							{t("problemEyebrow")}
						</p>
						<h2 className="font-[family-name:var(--font-display)] max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
							{t("problemTitle")}
						</h2>
						<p className="text-muted-foreground mt-4 max-w-2xl text-lg leading-relaxed">
							{t("problemBody")}
						</p>
						<ul className="mt-8 grid gap-3 sm:grid-cols-3">
							{["problemPoint1", "problemPoint2", "problemPoint3"].map((key) => (
								<li
									key={key}
									className="border-border/60 bg-card/80 flex gap-2 rounded-xl border p-4 text-sm leading-snug shadow-sm"
								>
									<Check className="text-primary mt-0.5 size-4 shrink-0" aria-hidden />
									<span>{t(key as "problemPoint1")}</span>
								</li>
							))}
						</ul>
					</div>
				</section>

				<section id="how" className="relative z-10 scroll-mt-24 py-20">
					<div className="mx-auto max-w-6xl px-4 sm:px-6">
						<div className="mb-12 max-w-2xl">
							<h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
								{t("howTitle")}
							</h2>
							<p className="text-muted-foreground mt-3 text-lg">{t("howSubtitle")}</p>
						</div>
						<ol className="grid gap-6 md:grid-cols-3">
							{howSteps.map((step, i) => (
								<li
									key={step.titleKey}
									className="border-border/70 bg-card/90 relative rounded-2xl border p-6 shadow-sm"
								>
									<span className="text-primary/80 font-[family-name:var(--font-display)] absolute -top-3 left-4 bg-background px-2 text-2xl font-extrabold tabular-nums">
										{i + 1}
									</span>
									<h3 className="font-[family-name:var(--font-display)] mt-4 text-lg font-semibold tracking-tight">
										{t(step.titleKey)}
									</h3>
									<p className="text-muted-foreground mt-2 text-sm leading-relaxed">
										{t(step.bodyKey)}
									</p>
								</li>
							))}
						</ol>
					</div>
				</section>

				<section
					id="features"
					className="border-border/30 bg-muted/40 relative z-10 scroll-mt-24 border-y py-20 dark:bg-muted/15"
				>
					<div className="mx-auto max-w-6xl px-4 sm:px-6">
						<div className="mb-12 max-w-2xl">
							<h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
								{t("featuresTitle")}
							</h2>
							<p className="text-muted-foreground mt-3 text-lg">{t("featuresSubtitle")}</p>
						</div>
						<div className="grid gap-5 sm:grid-cols-2">
							{features.map((f, i) => (
								<Card
									key={f.titleKey}
									className={cn(
										"border-border/60 bg-card/95 transition-shadow duration-300 hover:shadow-md",
										i === 0 && "border-t-2 border-t-primary",
									)}
								>
									<CardHeader className="pb-2">
										<div className="bg-primary/12 text-primary mb-2 flex size-10 items-center justify-center rounded-lg">
											<f.icon className="size-5" aria-hidden />
										</div>
										<CardTitle className="font-[family-name:var(--font-display)] text-lg">
											{t(f.titleKey)}
										</CardTitle>
										<CardDescription className="text-base leading-relaxed">
											{t(f.bodyKey)}
										</CardDescription>
									</CardHeader>
								</Card>
							))}
						</div>
					</div>
				</section>

				<section className="border-primary/20 from-primary/10 relative z-10 border-y bg-gradient-to-br to-transparent py-16">
					<div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:px-6">
						<h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-balance sm:text-3xl">
							{t("ctaBandTitle")}
						</h2>
						<p className="text-muted-foreground max-w-xl text-pretty sm:text-lg">
							{t("ctaBandBody")}
						</p>
						<Button size="lg" className="h-11 gap-2 px-8 shadow-md" asChild>
							<Link href="/app">
								{t("ctaBandButton")}
								<ArrowRight className="size-4" />
							</Link>
						</Button>
					</div>
				</section>

				<section
					id="faq"
					className="relative z-10 mx-auto max-w-3xl scroll-mt-24 px-4 py-20 sm:px-6"
				>
					<h2 className="font-[family-name:var(--font-display)] mb-2 text-center text-3xl font-bold tracking-tight">
						{t("faqTitle")}
					</h2>
					<p className="text-muted-foreground mb-8 text-center text-sm">{t("faqSubtitle")}</p>
					<Accordion type="single" collapsible className="w-full">
						{faqItems.map((item, i) => (
							<AccordionItem key={item.q} value={`item-${i}`}>
								<AccordionTrigger className="text-left font-medium">{item.q}</AccordionTrigger>
								<AccordionContent className="text-muted-foreground leading-relaxed">
									{item.a}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</section>
			</main>

			<footer className="border-border/40 bg-background/90 relative z-10 border-t border-dashed py-10 backdrop-blur-sm">
				<div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
					<div className="flex items-center gap-3">
						<Image src="/logo.svg" alt="" width={32} height={32} />
						<div>
							<p className="font-[family-name:var(--font-display)] font-bold">
								{siteConfig.name}
							</p>
							<p className="text-muted-foreground text-xs">{t("footerTagline")}</p>
						</div>
					</div>
					<div className="flex flex-wrap items-center justify-center gap-4 text-sm">
						<Link
							href="/app"
							className="text-primary font-medium underline-offset-4 hover:underline"
						>
							{t("footerEditor")}
						</Link>
						<Separator orientation="vertical" className="hidden h-4 sm:block" />
						<Link
							href="/sitemap.xml"
							className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
						>
							{t("footerSitemap")}
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
