import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
	matcher: [
		/* Exclude API, Next internals, and static files (paths containing a dot). */
		"/((?!api|_next|_vercel|.*\\..*).*)",
	],
};
