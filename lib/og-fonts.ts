/**
 * Loads Google-hosted **TrueType** fonts for @vercel/og / Satori (woff2 → "Unsupported OpenType signature wOF2").
 * Same families as the app: Syne (display), Geist (sans).
 */
const TTF_USER_AGENT =
	"Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)";

export type OgFontConfig = {
	name: string;
	data: ArrayBuffer;
	weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
	style: "normal" | "italic";
};

function extractTrueTypeUrl(block: string): string | null {
	const m = block.match(/url\(([^)]+)\)\s+format\(['"]truetype['"]\)/);
	return m?.[1]?.trim() ?? null;
}

function parseFontFaces(css: string): { weight: number; url: string }[] {
	const out: { weight: number; url: string }[] = [];
	const re = /@font-face\s*\{([^}]+)\}/g;
	let m: RegExpExecArray | null = re.exec(css);
	while (m !== null) {
		const block = m[1];
		const url = extractTrueTypeUrl(block);
		if (!url) continue;

		const range = block.match(/font-weight:\s*(\d+)\s+(\d+)/);
		if (range) {
			const lo = Number(range[1]);
			const hi = Number(range[2]);
			const candidates = [400, 500, 600, 700, 800];
			for (const w of candidates) {
				if (w >= lo && w <= hi) out.push({ weight: w, url });
			}
		} else {
			const single = block.match(/font-weight:\s*(\d+)\s*;/);
			if (single) out.push({ weight: Number(single[1]), url });
		}
		m = re.exec(css);
	}
	return out;
}

async function loadFamily(
	family: string,
	weightQuery: string,
): Promise<OgFontConfig[]> {
	const href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weightQuery}&display=swap`;
	const res = await fetch(href, { headers: { "User-Agent": TTF_USER_AGENT } });
	if (!res.ok) throw new Error(`Font CSS ${family}: ${res.status}`);
	const css = await res.text();
	const faces = parseFontFaces(css);
	if (faces.length === 0) {
		throw new Error(`No TrueType faces parsed for ${family}`);
	}

	const urlToWeights = new Map<string, Set<number>>();
	for (const { weight, url } of faces) {
		const existing = urlToWeights.get(url) ?? new Set<number>();
		existing.add(weight);
		urlToWeights.set(url, existing);
	}

	const configs: OgFontConfig[] = [];
	for (const [url, weights] of urlToWeights) {
		const data = await fetch(url).then((r) => {
			if (!r.ok) throw new Error(`Font file ${family}: ${r.status}`);
			return r.arrayBuffer();
		});
		for (const weight of weights) {
			configs.push({
				name: family,
				data,
				weight: weight as OgFontConfig["weight"],
				style: "normal",
			});
		}
	}
	return configs;
}

export async function loadCanopyOgFonts(): Promise<OgFontConfig[]> {
	const [syne, geist] = await Promise.all([
		loadFamily("Syne", "700;800"),
		loadFamily("Geist", "500;600;700"),
	]);
	return [...syne, ...geist];
}
