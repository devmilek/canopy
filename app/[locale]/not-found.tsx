"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Home, LayoutGrid, MapPinOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

function FloatingNode({
	className,
	label,
	delay,
}: {
	className?: string;
	label: string;
	delay: string;
}) {
	return (
		<div
			className={cn(
				"border-border/60 bg-card/90 absolute rounded-lg border px-3 py-2 text-xs font-medium shadow-md backdrop-blur-sm",
				"animate-in fade-in zoom-in-95 fill-mode-both duration-700",
				className,
			)}
			style={{ animationDelay: delay }}
			aria-hidden
		>
			{label}
		</div>
	);
}

export default function NotFoundPage() {
	const t = useTranslations("notFound");

	return (
		<div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 py-20">
			<div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
				<div className="bg-primary/16 absolute -top-32 right-[-10%] size-[min(90vw,480px)] rounded-full blur-3xl" />
				<div className="bg-primary/10 absolute bottom-[-20%] -left-[15%] size-[min(85vw,420px)] rounded-full blur-3xl" />
				<div
					className="text-primary/10 absolute inset-0 opacity-50 dark:opacity-25"
					style={{
						backgroundImage:
							"linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
						backgroundSize: "40px 40px",
					}}
				/>
			</div>

			<FloatingNode
				className="top-[14%] left-[8%] rotate-[-6deg] max-sm:hidden"
				label="…"
				delay="0ms"
			/>
			<FloatingNode
				className="top-[22%] right-[10%] rotate-[4deg] max-sm:hidden"
				label="404"
				delay="100ms"
			/>
			<FloatingNode
				className="bottom-[18%] left-[12%] rotate-[3deg] max-sm:hidden"
				label="?"
				delay="200ms"
			/>
			<FloatingNode
				className="right-[8%] bottom-[24%] rotate-[-5deg] max-sm:hidden"
				label="∅"
				delay="300ms"
			/>

			<div className="relative z-10 w-full max-w-lg text-center">
				<Link
					href="/"
					className="mb-10 inline-flex items-center gap-3 opacity-90 transition-opacity hover:opacity-100"
				>
					<Image src="/logo.svg" alt="" width={44} height={44} className="size-11" />
					<span className="text-primary font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
						{siteConfig.name}
					</span>
				</Link>

				<div className="border-border/80 from-card/95 to-card/80 relative rounded-3xl border bg-gradient-to-b p-1 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.25)] backdrop-blur-md dark:shadow-[0_24px_80px_-20px_rgba(0,0,0,0.5)]">
					<div className="rounded-[1.35rem] px-8 py-12 sm:px-10 sm:py-14">
						<div className="text-primary mb-4 flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase">
							<MapPinOff className="size-3.5" aria-hidden />
							{t("eyebrow")}
						</div>

						<p
							className="text-primary/90 font-[family-name:var(--font-display)] mb-2 text-[clamp(4.5rem,18vw,7.5rem)] leading-none font-black tracking-tighter tabular-nums"
							aria-hidden
						>
							{t("code")}
						</p>

						<h1 className="font-[family-name:var(--font-display)] text-foreground text-2xl font-bold tracking-tight text-balance sm:text-3xl">
							{t("title")}
						</h1>
						<p className="text-muted-foreground mt-4 text-pretty text-base leading-relaxed sm:text-lg">
							{t("description")}
						</p>

						<div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
							<Button size="lg" className="gap-2 shadow-md" asChild>
								<Link href="/">
									<Home className="size-4" />
									{t("home")}
								</Link>
							</Button>
							<Button size="lg" variant="outline" className="gap-2" asChild>
								<Link href="/app">
									<LayoutGrid className="size-4" />
									{t("editor")}
								</Link>
							</Button>
						</div>
					</div>
				</div>

				<p className="text-muted-foreground mt-8 text-xs">
					HTTP {t("code")} · {siteConfig.name}
				</p>
			</div>
		</div>
	);
}
