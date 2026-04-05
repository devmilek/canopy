import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import { siteUrl } from "@/lib/site-config";
import { Databuddy } from "@databuddy/sdk/react";

/** Base URL for absolute metadata (canonical, Open Graph, etc.). */
export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<>
			<Databuddy
				clientId={process.env.NEXT_PUBLIC_DATABUDDY_CLIENT_ID}
				trackAttributes={true}
				trackInteractions={true}
			/>
			{children}
		</>
	);
}
