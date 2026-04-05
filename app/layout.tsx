import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import { siteUrl } from "@/lib/site-config";

/** Ensures absolute URLs for app-level assets (e.g. `/opengraph-image`). */
export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return children;
}
