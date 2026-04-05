import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
	matcher: [
		/*
		 * Exclude file-like paths (.*\\..*) and Next metadata routes without an extension —
		 * otherwise next-intl would run on /opengraph-image and break ImageResponse (400).
		 */
		"/((?!api|_next|_vercel|opengraph-image|twitter-image|.*\\..*).*)",
	],
};
