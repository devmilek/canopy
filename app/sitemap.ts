import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
	const now = new Date();
	return [
		{
			url: siteUrl,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${siteUrl}/en`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.95,
		},
		{
			url: `${siteUrl}/app`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${siteUrl}/en/app`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.85,
		},
	];
}
