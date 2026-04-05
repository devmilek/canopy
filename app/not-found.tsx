import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

import "./globals.css";

/**
 * Fallback when a 404 is rendered outside `[locale]` (rare). Root layout has no
 * `<html>` — this file supplies a full document. Prefer localized
 * `app/[locale]/not-found.tsx` for normal browsing.
 */
export default function RootNotFound() {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="bg-background text-foreground min-h-svh font-sans antialiased">
				<div className="flex min-h-svh flex-col items-center justify-center gap-8 px-6 py-16">
					<Link href="/" className="flex items-center gap-3">
						<Image src="/logo.svg" alt="" width={40} height={40} />
						<span className="text-primary text-xl font-bold">{siteConfig.name}</span>
					</Link>
					<div className="max-w-md text-center">
						<p className="text-primary text-6xl font-black tabular-nums">404</p>
						<h1 className="mt-2 text-2xl font-semibold tracking-tight">
							Page not found
						</h1>
						<p className="text-muted-foreground mt-3 text-sm leading-relaxed">
							This URL is not valid. Try the home page or the editor.
						</p>
					</div>
					<div className="flex flex-wrap justify-center gap-3">
						<Button asChild>
							<Link href="/">Home</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link href="/app">Editor</Link>
						</Button>
					</div>
				</div>
			</body>
		</html>
	);
}
