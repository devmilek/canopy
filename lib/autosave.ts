export const AUTOSAVE_KEY = "visualsitemaps-autosave-v1";

export function readAutosave(): string | null {
	if (typeof window === "undefined") return null;
	try {
		return localStorage.getItem(AUTOSAVE_KEY);
	} catch {
		return null;
	}
}

export function writeAutosave(json: string): void {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(AUTOSAVE_KEY, json);
	} catch {
		// quota / private mode
	}
}

export function clearAutosave(): void {
	if (typeof window === "undefined") return;
	try {
		localStorage.removeItem(AUTOSAVE_KEY);
	} catch {
		// ignore
	}
}
