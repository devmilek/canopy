import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { ThemeProvider } from "@/components/theme-provider";
import { routing } from "@/i18n/routing";
import { siteConfig, siteUrl } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });
const syne = Syne({
	subsets: ["latin"],
	variable: "--font-display",
	weight: ["400", "500", "600", "700", "800"],
});

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "meta" });
	const isEn = locale === "en";
	const openGraphUrl = isEn ? `${siteUrl}/en` : siteUrl;

	return {
		metadataBase: new URL(siteUrl),
		title: {
			default: t("title"),
			template: `%s | ${siteConfig.name}`,
		},
		description: t("description"),
		keywords: t("keywords")
			.split(",")
			.map((k) => k.trim())
			.filter(Boolean),
		authors: [{ name: siteConfig.name }],
		creator: siteConfig.name,
		openGraph: {
			type: "website",
			locale: isEn ? "en_US" : "pl_PL",
			url: openGraphUrl,
			siteName: siteConfig.name,
			title: t("title"),
			description: t("description"),
			/* English-only art; explicit URL so crawlers resolve even if file metadata merge differs */
			images: [
				{
					url: "/opengraph-image",
					width: 1200,
					height: 630,
					alt: "Canopy — visual sitemap editor: structure, content sections, and SEO in one workspace",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: t("title"),
			description: t("description"),
			images: ["/opengraph-image"],
		},
		robots: {
			index: true,
			follow: true,
		},
		alternates: {
			languages: {
				pl: siteUrl,
				en: `${siteUrl}/en`,
			},
		},
	};
}

export default async function LocaleLayout({
	children,
	params,
}: Readonly<{
	children: ReactNode;
	params: Promise<{ locale: string }>;
}>) {
	const { locale } = await params;
	if (!routing.locales.includes(locale as "pl" | "en")) {
		notFound();
	}

	setRequestLocale(locale);
	const messages = await getMessages();

	return (
		<html
			lang={locale}
			suppressHydrationWarning
			className={cn(
				"font-sans antialiased",
				geist.variable,
				fontMono.variable,
				syne.variable,
			)}
		>
			<body>
				<NextIntlClientProvider messages={messages}>
					<ThemeProvider>{children}</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
