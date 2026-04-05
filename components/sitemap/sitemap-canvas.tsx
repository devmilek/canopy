"use client";

import { useTranslations } from "next-intl";
import PageSectionsPanel from "@/components/page-sections-panel";
import ProjectPersistenceBridge from "@/components/project-persistence-bridge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactFlowProvider } from "@xyflow/react";
import useStore from "@/hooks/store";
import { SitemapFlow } from "./sitemap-flow";

export default function SitemapCanvas() {
	const tPanel = useTranslations("panel");
	const selectedPageId = useStore((s) => s.selectedPageId);
	const selectNode = useStore((s) => s.selectNode);

	return (
		<TooltipProvider delayDuration={300}>
			<div className="relative flex h-svh w-full min-w-0">
				{selectedPageId ? (
					<button
						type="button"
						className="bg-background/50 fixed inset-0 z-40 backdrop-blur-[1px] lg:hidden"
						aria-label={tPanel("closeOverlay")}
						onClick={() => selectNode(null)}
					/>
				) : null}
				<div className="relative z-0 min-h-0 min-w-0 flex-1">
					<ReactFlowProvider>
						<ProjectPersistenceBridge />
						<SitemapFlow />
					</ReactFlowProvider>
				</div>
				{selectedPageId ? <PageSectionsPanel /> : null}
			</div>
		</TooltipProvider>
	);
}
