"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function LocaleSwitcher() {
	const locale = useLocale();
	const pathname = usePathname();
	const t = useTranslations("landing");

	return (
		<div
			className="border-border bg-background/80 flex items-center rounded-lg border p-0.5 text-xs"
			role="navigation"
			aria-label={t("localeSwitch")}
		>
			<Link
				href={pathname}
				locale="pl"
				className={cn(
					"rounded-md px-2 py-1 transition-colors",
					locale === "pl"
						? "bg-muted text-foreground font-semibold"
						: "text-muted-foreground hover:text-foreground",
				)}
			>
				{t("localePl")}
			</Link>
			<Link
				href={pathname}
				locale="en"
				className={cn(
					"rounded-md px-2 py-1 transition-colors",
					locale === "en"
						? "bg-muted text-foreground font-semibold"
						: "text-muted-foreground hover:text-foreground",
				)}
			>
				{t("localeEn")}
			</Link>
		</div>
	);
}
