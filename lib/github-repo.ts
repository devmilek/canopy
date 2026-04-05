/** Public source repo — used for landing navbar star count. */
export const CANOPY_GITHUB_REPO = "devmilek/canopy" as const;
export const CANOPY_GITHUB_URL = `https://github.com/${CANOPY_GITHUB_REPO}` as const;

export async function getGithubRepoStars(): Promise<number | null> {
	try {
		const res = await fetch(
			`https://api.github.com/repos/${CANOPY_GITHUB_REPO}`,
			{
				headers: {
					Accept: "application/vnd.github+json",
					"User-Agent": "CanopySite/1.0",
				},
				next: { revalidate: 3600 },
			},
		);
		if (!res.ok) return null;
		const data = (await res.json()) as { stargazers_count?: number };
		return typeof data.stargazers_count === "number"
			? data.stargazers_count
			: null;
	} catch {
		return null;
	}
}
