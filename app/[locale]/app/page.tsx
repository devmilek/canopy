import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import SitemapCanvas from "@/components/sitemap-canvas";
import { siteUrl } from "@/lib/site-config";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "meta" });
	const isEn = locale === "en";
	return {
		title: t("editorTitle"),
		alternates: {
			canonical: isEn ? `${siteUrl}/en/app` : `${siteUrl}/app`,
		},
	};
}

export default function EditorPage() {
	return <SitemapCanvas />;
}
