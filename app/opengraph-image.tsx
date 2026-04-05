import { ImageResponse } from "next/og";

import { loadCanopyOgFonts } from "@/lib/og-fonts";

/** Open Graph art is English-only for all locales (shared social preview). */
export const alt =
	"Canopy — visual sitemap editor: structure, content sections, and SEO in one workspace";

export const size = {
	width: 1200,
	height: 630,
};

export const contentType = "image/png";

/* Light theme — aligned with `globals.css` :root (warm neutrals + logo orange) */
const bg = "#f9f7f4";
const fg = "#2c2824";
const muted = "#6f6a63";
const border = "#e8e4de";
const card = "#ffffff";
const primary = "#FF3902";
const primarySoft = "rgba(255, 57, 2, 0.12)";
const gridLine = "rgba(44, 40, 36, 0.06)";

const fontSyne = "Syne";
const fontGeist = "Geist";

export default async function OpenGraphImage() {
	let fonts: Awaited<ReturnType<typeof loadCanopyOgFonts>> = [];
	try {
		fonts = await loadCanopyOgFonts();
	} catch {
		/* build / offline: fall back to stack (layout still valid) */
	}

	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					padding: "64px 72px",
					background: `linear-gradient(165deg, ${bg} 0%, #f3f0eb 48%, #efeae3 100%)`,
					fontFamily: fontGeist,
					color: fg,
					position: "relative",
				}}
			>
				<div
					style={{
						position: "absolute",
						inset: 0,
						backgroundImage: `
							linear-gradient(to right, ${gridLine} 1px, transparent 1px),
							linear-gradient(to bottom, ${gridLine} 1px, transparent 1px)
						`,
						backgroundSize: "48px 48px",
					}}
				/>
				<div
					style={{
						position: "absolute",
						top: "-18%",
						right: "-6%",
						width: "460px",
						height: "460px",
						borderRadius: "50%",
						background: primarySoft,
					}}
				/>
				<div
					style={{
						position: "absolute",
						bottom: "-22%",
						left: "-8%",
						width: "400px",
						height: "400px",
						borderRadius: "50%",
						background: "rgba(255, 57, 2, 0.06)",
					}}
				/>

				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: 18,
						zIndex: 1,
					}}
				>
					<div
						style={{
							width: 52,
							height: 52,
							borderRadius: 14,
							background: `linear-gradient(135deg, ${primary}, #e63502)`,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							boxShadow: `0 10px 32px rgba(255, 57, 2, 0.28)`,
						}}
					>
						<svg
							width="28"
							height="28"
							viewBox="0 0 40 40"
							fill="none"
							role="img"
							aria-label="Canopy"
						>
							<title>Canopy</title>
							<path
								d="M20 0C9.50659 0 1 8.50659 1 19V20.1719L4 23.1719V19C4 10.1634 11.1634 3 20 3C28.8366 3 36 10.1634 36 19V23.1719L39 20.1719V19C39 8.50659 30.4934 0 20 0ZM20 10C15.0294 10 11 14.0294 11 19V31.0498C11 31.5743 10.5743 32 10.0498 32C9.7981 31.9999 9.55691 31.8997 9.37891 31.7217L0 22.3428V26.585L7.25781 33.8428C7.99842 34.5834 9.00245 34.9999 10.0498 35C12.2312 35 14 33.2312 14 31.0498V19C14 15.6863 16.6863 13 20 13C23.3137 13 26 15.6863 26 19V31.0498C26 33.2312 27.7688 35 29.9502 35C30.9976 34.9999 32.0016 34.5834 32.7422 33.8428L34.7066 31.8785L37.7066 28.8785L40 26.585V22.3428L37.8789 24.4639L35.5854 26.7574L32.5854 29.7574L30.6211 31.7217C30.4431 31.8997 30.2019 31.9999 29.9502 32C29.4257 32 29 31.5743 29 31.0498V19C29 14.0294 24.9706 10 20 10ZM20 15C17.7909 15 16 16.7909 16 19V31.0498C16 34.3358 13.3358 37 10.0498 37C8.47201 36.9999 6.95846 36.3735 5.84277 35.2578L0 29.4141V33.6562L3.72168 37.3789C5.39997 39.0572 7.67636 39.9999 10.0498 40C14.9926 40 19 35.9926 19 31.0498V19C19 18.4477 19.4477 18 20 18C20.5523 18 21 18.4477 21 19V31.0498C21 35.9926 25.0074 40 29.9502 40C32.3236 39.9999 34.6 39.0572 36.2783 37.3789L40 33.6562V29.4141L34.1572 35.2578C33.0415 36.3735 31.528 36.9999 29.9502 37C26.6642 37 24 34.3358 24 31.0498V19C24 16.7909 22.2091 15 20 15ZM20 5C12.268 5 6 11.268 6 19V25.1719L9 28.1719V19C9 12.9249 13.9249 8 20 8C26.0751 8 31 12.9249 31 19V28.1719L34 25.1719V19C34 11.268 27.732 5 20 5Z"
								fill="white"
							/>
						</svg>
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: 4,
						}}
					>
						<span
							style={{
								fontFamily: fontSyne,
								fontSize: 30,
								fontWeight: 700,
								color: primary,
								letterSpacing: "-0.03em",
								lineHeight: 1,
							}}
						>
							Canopy
						</span>
						<span
							style={{
								fontSize: 11,
								fontWeight: 600,
								color: muted,
								letterSpacing: "0.28em",
								textTransform: "uppercase",
							}}
						>
							Visual sitemaps
						</span>
					</div>
				</div>

				<div
					style={{
						zIndex: 1,
						maxWidth: 900,
						display: "flex",
						flexDirection: "column",
						gap: 22,
					}}
				>
					<div
						style={{
							fontFamily: fontSyne,
							fontSize: 68,
							fontWeight: 800,
							lineHeight: 1.05,
							letterSpacing: "-0.04em",
							color: fg,
							margin: 0,
							display: "flex",
							flexWrap: "wrap",
							gap: "0 0.28em",
						}}
					>
						<span>Plan structure.</span>
						<span style={{ color: primary }}>Ship clarity.</span>
					</div>
					<p
						style={{
							fontSize: 24,
							lineHeight: 1.5,
							color: muted,
							margin: 0,
							maxWidth: 720,
							fontWeight: 500,
							display: "block",
						}}
					>
						Diagram your site tree, draft sections, and capture SEO fields —
						locally in the browser, export JSON or Markdown when you are ready.
					</p>
				</div>

				<div
					style={{
						display: "flex",
						alignItems: "flex-end",
						justifyContent: "space-between",
						zIndex: 1,
					}}
				>
					<div style={{ display: "flex", gap: 10, alignItems: "center" }}>
						{["Home", "Product", "Blog", "Contact"].map((label, i) => (
							<div
								key={label}
								style={{
									padding: "9px 16px",
									borderRadius: 10,
									fontSize: 14,
									fontWeight: 600,
									color: i === 3 ? "#ffffff" : fg,
									background: i === 3 ? primary : card,
									border: `1px solid ${i === 3 ? primary : border}`,
									boxShadow:
										i === 3
											? `0 8px 24px rgba(255, 57, 2, 0.22)`
											: "0 1px 2px rgba(44, 40, 36, 0.06)",
								}}
							>
								{label}
							</div>
						))}
					</div>
					<div
						style={{
							fontSize: 14,
							fontWeight: 500,
							color: muted,
							letterSpacing: "0.04em",
						}}
					>
						React Flow · Dexie · Next.js
					</div>
				</div>
			</div>
		),
		{
			...size,
			fonts: fonts.length > 0 ? fonts : undefined,
		},
	);
}
