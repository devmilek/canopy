"use client";

import { useCallback } from "react";
import {
	Background,
	Controls,
	MiniMap,
	ReactFlow,
	useReactFlow,
	type OnSelectionChangeFunc,
} from "@xyflow/react";
import useStore, { type SitemapFlowNode } from "@/hooks/store";
import { cn } from "@/lib/utils";
import { EditorHintsPanel } from "./editor-hints-panel";
import { FlowKeyboardShortcuts } from "./flow-keyboard-shortcuts";
import { sitemapDefaultEdgeOptions, sitemapNodeTypes } from "./flow-config";
import { SelectPageHint } from "./select-page-hint";
import { SitemapToolbar } from "./toolbar";

export function SitemapFlow() {
	const nodes = useStore((s) => s.nodes);
	const edges = useStore((s) => s.edges);
	const onNodesChange = useStore((s) => s.onNodesChange);
	const onEdgesChange = useStore((s) => s.onEdgesChange);
	const onConnect = useStore((s) => s.onConnect);
	const setSelectedPageId = useStore((s) => s.setSelectedPageId);
	const selectedPageId = useStore((s) => s.selectedPageId);
	const { fitView } = useReactFlow();

	const onSelectionChange = useCallback<
		OnSelectionChangeFunc<SitemapFlowNode>
	>(({ nodes: selectedNodes }) => {
		if (selectedNodes.length !== 1) {
			setSelectedPageId(null);
			return;
		}
		const only = selectedNodes[0];
		setSelectedPageId(only ? only.id : null);
	}, [setSelectedPageId]);

	return (
		<ReactFlow
			nodes={nodes}
			edges={edges}
			onNodesChange={onNodesChange}
			onEdgesChange={onEdgesChange}
			onConnect={onConnect}
			onSelectionChange={onSelectionChange}
			nodeTypes={sitemapNodeTypes}
			defaultEdgeOptions={sitemapDefaultEdgeOptions}
			fitView
			minZoom={0.15}
			maxZoom={1.5}
			proOptions={{ hideAttribution: true }}
			onInit={() => {
				requestAnimationFrame(() => fitView({ padding: 0.2, duration: 0 }));
			}}
		>
			<FlowKeyboardShortcuts />
			<Background
				gap={20}
				size={1}
				className="bg-gradient-to-br from-muted/50 via-background to-primary/[0.04]"
			/>
			<Controls
				className="bg-card! border-border! overflow-hidden rounded-lg! border! shadow-sm!"
				showInteractive={false}
			/>
			<MiniMap
				className={cn(
					"border-border! rounded-lg! border! bg-card/90!",
					"hidden md:block",
				)}
				maskColor="var(--background)"
				nodeClassName={cn("rounded! border! border-primary/30! bg-primary/20!")}
			/>
			<SitemapToolbar />
			{!selectedPageId ? <SelectPageHint /> : null}
			<EditorHintsPanel />
		</ReactFlow>
	);
}
