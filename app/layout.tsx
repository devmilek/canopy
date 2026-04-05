import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import { siteUrl } from "@/lib/site-config";
import { Databuddy } from "@databuddy/sdk/react";
import { Analytics } from "@vercel/analytics/next";

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
			<Analytics />
			<Databuddy
				clientId={process.env.NEXT_PUBLIC_DATABUDDY_CLIENT_ID}
				trackAttributes={true}
				trackInteractions={true}
				trackErrors={true}
				trackWebVitals={true}
				trackPerformance={true}
				disabled={process.env.NODE_ENV === "development"}
			/>
			{children}
		</>
	);
}
