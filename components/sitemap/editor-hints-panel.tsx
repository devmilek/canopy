"use client";

import { useTranslations } from "next-intl";
import { Panel } from "@xyflow/react";

/** Desktop-only strip: keyboard shortcuts (Del, ⌘K, …). */
export function EditorHintsPanel() {
	const t = useTranslations("editor");

	return (
		<Panel
			position="bottom-center"
			className="text-muted-foreground mb-3 hidden max-w-[min(720px,94vw)] text-center text-[10px] leading-snug sm:mb-4 sm:text-[11px] md:block"
		>
			{t("hints")}{" "}
			<kbd className="bg-muted rounded px-1 py-0.5 font-mono">Del</kbd> —{" "}
			{t("hintsDelete")}{" "}
			<kbd className="bg-muted rounded px-1 py-0.5 font-mono">⌘K</kbd> —{" "}
			{t("hintsSearch")}{" "}
			<kbd className="bg-muted rounded px-1 py-0.5 font-mono">⌘D</kbd> —{" "}
			{t("hintsDuplicate")}{" "}
			<kbd className="bg-muted rounded px-1 py-0.5 font-mono">d</kbd> —{" "}
			{t("hintsTheme")}
		</Panel>
	);
}
