import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { CanopyLandingPage } from "@/components/canopy-landing-page";
import { siteConfig, siteUrl } from "@/lib/site-config";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const isEn = locale === "en";
	return {
		alternates: {
			canonical: isEn ? `${siteUrl}/en` : siteUrl,
		},
	};
}

export default async function HomePage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "meta" });

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebApplication",
		name: siteConfig.name,
		description: t("description"),
		applicationCategory: "DesignApplication",
		operatingSystem: "Web",
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: locale === "en" ? "USD" : "PLN",
		},
		url: locale === "en" ? `${siteUrl}/en` : siteUrl,
		inLanguage: locale === "en" ? "en" : "pl",
	} as const;

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<CanopyLandingPage />
		</>
	);
}
