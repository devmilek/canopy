import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import { siteUrl } from "@/lib/site-config";

/** Base URL for absolute metadata (canonical, Open Graph, etc.). */
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
