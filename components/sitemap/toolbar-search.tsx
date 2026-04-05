"use client";

import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import useStore from "@/hooks/store";
import { Search } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

export function ToolbarSearch() {
	const t = useTranslations("editor");
	const nodes = useStore((s) => s.nodes);
	const selectNode = useStore((s) => s.selectNode);
	const { fitView } = useReactFlow();
	const [q, setQ] = useState("");
	const [open, setOpen] = useState(false);

	const matches = useMemo(() => {
		const text = q.trim().toLowerCase();
		if (!text) return [];
		return nodes
			.filter((n) => n.data.label.toLowerCase().includes(text))
			.slice(0, 8);
	}, [nodes, q]);

	const pick = useCallback(
		(id: string) => {
			selectNode(id);
			setOpen(false);
			setQ("");
			requestAnimationFrame(() => {
				fitView({
					nodes: [{ id }],
					padding: 0.4,
					maxZoom: 1.25,
					duration: 280,
				});
			});
		},
		[fitView, selectNode],
	);

	return (
		<div className="relative hidden max-w-[min(200px,28vw)] min-w-[120px] flex-1 md:block sm:max-w-[200px] sm:min-w-[140px]">
			<InputGroup>
				<InputGroupAddon>
					<Search />
				</InputGroupAddon>
				<InputGroupInput
					id="sitemap-search"
					type="search"
					autoComplete="off"
					value={q}
					placeholder={t("searchPlaceholder")}
					onChange={(e) => setQ(e.target.value)}
					onFocus={() => setOpen(true)}
					onBlur={() => {
						window.setTimeout(() => setOpen(false), 180);
					}}
				/>
			</InputGroup>
			{open && q.trim() && matches.length > 0 ? (
				<ul className="border-border bg-card text-card-foreground absolute top-full left-0 z-50 mt-1 max-h-48 w-full min-w-[200px] overflow-auto rounded-lg border py-1 shadow-md">
					{matches.map((n) => (
						<li key={n.id}>
							<button
								type="button"
								className="hover:bg-muted focus:bg-muted w-full px-2 py-1.5 text-left text-xs"
								onMouseDown={(e) => e.preventDefault()}
								onClick={() => pick(n.id)}
							>
								{n.data.label}
							</button>
						</li>
					))}
				</ul>
			) : null}
		</div>
	);
}
