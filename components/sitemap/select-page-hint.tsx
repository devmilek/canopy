"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { Panel } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { MousePointerClick, X } from "lucide-react";

export const SELECT_HINT_DISMISSED_KEY = "canopy.dismissSelectHint";

export function SelectPageHint() {
	const t = useTranslations("editor");
	const [hydrated, setHydrated] = useState(false);
	const [dismissed, setDismissed] = useState(false);

	useEffect(() => {
		try {
			setDismissed(localStorage.getItem(SELECT_HINT_DISMISSED_KEY) === "1");
		} catch {
			/* private mode */
		}
		setHydrated(true);
	}, []);

	const dismiss = useCallback(() => {
		try {
			localStorage.setItem(SELECT_HINT_DISMISSED_KEY, "1");
		} catch {
			/* ignore */
		}
		setDismissed(true);
	}, []);

	if (!hydrated || dismissed) return null;

	return (
		<Panel
			position="top-right"
			className="border-border bg-card/95 text-card-foreground !m-0 max-w-[min(320px,calc(100vw-1.25rem))] rounded-xl border p-3 shadow-sm backdrop-blur-sm !right-2 !top-2 sm:!right-3 sm:!top-3 max-lg:!top-[6.5rem] lg:!top-3 lg:max-w-[min(300px,calc(100vw-2rem))]"
		>
			<div className="flex gap-2">
				<MousePointerClick
					className="text-primary mt-0.5 size-4 shrink-0"
					aria-hidden
				/>
				<div className="min-w-0 flex-1">
					<p className="text-sm font-semibold leading-tight">
						{t("selectHintTitle")}
					</p>
					<p className="text-muted-foreground mt-1 text-xs leading-relaxed">
						{t("selectHintBody")}
					</p>
				</div>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="text-muted-foreground hover:text-foreground size-8 shrink-0"
					aria-label={t("selectHintDismiss")}
					title={t("selectHintDismiss")}
					onClick={dismiss}
				>
					<X className="size-4" />
				</Button>
			</div>
		</Panel>
	);
}
