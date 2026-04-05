/** Konfiguracja marki i SEO — ustaw NEXT_PUBLIC_SITE_URL na produkcji (np. https://twoja-domena.pl) */
const rawUrl =
	typeof process.env.NEXT_PUBLIC_SITE_URL === "string"
		? process.env.NEXT_PUBLIC_SITE_URL
		: "http://localhost:3000";

export const siteUrl = rawUrl.replace(/\/$/, "");

export const siteConfig = {
	name: "Canopy",
	title:
		"Canopy — wizualna mapa strony, plan sekcji i SEO w jednym miejscu",
	shortTitle: "Canopy",
	description:
		"Canopy to darmowe narzędzie do projektowania wizualnych map stron (site map): struktura w React Flow, sekcje treści, meta title i description, slug, H1, słowa kluczowe, intencja strony. Wiele projektów, zapis w IndexedDB (Dexie), eksport JSON i Markdown.",
	keywords: [
		"mapa strony",
		"visual sitemap",
		"site map",
		"architektura informacji",
		"SEO",
		"meta description",
		"struktura strony www",
		"planowanie treści",
		"wireframe",
		"React Flow",
	],
} as const;
