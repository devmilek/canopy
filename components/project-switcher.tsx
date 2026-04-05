"use client";

import { useLocale, useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import useStore from "@/hooks/store";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Copy, FolderPlus, Pencil, Settings2, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { enUS, pl } from "date-fns/locale";

export default function ProjectSwitcher() {
	const t = useTranslations("projects");
	const locale = useLocale();
	const dateLocale = locale === "en" ? enUS : pl;
	const projectsReady = useStore((s) => s.projectsReady);
	const currentProjectId = useStore((s) => s.currentProjectId);
	const projectsMeta = useStore((s) => s.projectsMeta);
	const openProject = useStore((s) => s.openProject);
	const createProject = useStore((s) => s.createProject);
	const deleteProject = useStore((s) => s.deleteProject);
	const renameProject = useStore((s) => s.renameProject);
	const duplicateWorkspaceProject = useStore(
		(s) => s.duplicateWorkspaceProject,
	);

	const { fitView } = useReactFlow();
	const bumpView = useCallback(() => {
		requestAnimationFrame(() => {
			fitView({ padding: 0.2, duration: 300 });
		});
	}, [fitView]);

	const [newOpen, setNewOpen] = useState(false);
	const [newName, setNewName] = useState("");
	const [renameOpen, setRenameOpen] = useState(false);
	const [renameName, setRenameName] = useState("");
	const [deleteOpen, setDeleteOpen] = useState(false);

	const current = projectsMeta.find((p) => p.id === currentProjectId);

	const submitNew = async () => {
		await createProject(newName || undefined);
		setNewName("");
		setNewOpen(false);
		bumpView();
	};

	const submitRename = async () => {
		if (!currentProjectId) return;
		await renameProject(currentProjectId, renameName);
		setRenameOpen(false);
	};

	const openRename = () => {
		setRenameName(current?.name ?? "");
		setRenameOpen(true);
	};

	const confirmDelete = async () => {
		if (!currentProjectId) return;
		await deleteProject(currentProjectId);
		setDeleteOpen(false);
	};

	if (!projectsReady) {
		return (
			<div className="border-input bg-muted/50 text-muted-foreground flex h-8 max-md:h-9 min-w-[min(160px,42vw)] items-center rounded-lg border px-2 text-xs sm:min-w-[160px]">
				{t("loading")}
			</div>
		);
	}

	return (
		<div className="flex min-w-0 items-center gap-1 max-md:gap-1.5">
			<Select
				value={currentProjectId ?? ""}
				onValueChange={(id) => {
					void openProject(id).then(() => bumpView());
				}}
			>
				<SelectTrigger className="min-w-[min(100px,28vw)] max-w-[min(160px,46vw)] sm:min-w-[140px] sm:max-w-[200px]">
					<SelectValue placeholder={t("placeholder")} />
				</SelectTrigger>
				<SelectContent position="popper" align="start">
					{projectsMeta.map((p) => (
						<SelectItem
							key={p.id}
							value={p.id}
							textValue={p.name}
							title={t("updatedAgo", {
								time: formatDistanceToNow(p.updatedAt, {
									addSuffix: true,
									locale: dateLocale,
								}),
							})}
						>
							{p.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Button
				variant="outline"
				size="icon"
				className="shrink-0"
				title={t("newProject")}
				onClick={() => setNewOpen(true)}
			>
				<FolderPlus />
			</Button>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="outline"
						size="icon"
						className="shrink-0"
						title={t("projectMenuTitle")}
						aria-label={t("projectMenuAria")}
					>
						<Settings2 />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-48">
					<DropdownMenuItem onClick={openRename}>
						<Pencil />
						{t("rename")}
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							if (currentProjectId) {
								void duplicateWorkspaceProject(currentProjectId).then(() =>
									bumpView(),
								);
							}
						}}
					>
						<Copy />
						{t("duplicate")}
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						variant="destructive"
						onClick={() => setDeleteOpen(true)}
					>
						<Trash2 />
						{t("delete")}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog open={newOpen} onOpenChange={setNewOpen}>
				<DialogContent showCloseButton className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>{t("dialogNewTitle")}</DialogTitle>
						<DialogDescription>{t("dialogNewDescription")}</DialogDescription>
					</DialogHeader>
					<Input
						placeholder={t("nameOptional")}
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") void submitNew();
						}}
					/>
					<DialogFooter>
						<Button variant="outline" onClick={() => setNewOpen(false)}>
							{t("cancel")}
						</Button>
						<Button onClick={() => void submitNew()}>{t("create")}</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={renameOpen} onOpenChange={setRenameOpen}>
				<DialogContent showCloseButton className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>{t("dialogRenameTitle")}</DialogTitle>
					</DialogHeader>
					<Input
						value={renameName}
						onChange={(e) => setRenameName(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") void submitRename();
						}}
					/>
					<DialogFooter>
						<Button variant="outline" onClick={() => setRenameOpen(false)}>
							{t("cancel")}
						</Button>
						<Button onClick={() => void submitRename()}>{t("save")}</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
						<AlertDialogDescription>
							{t("deleteDescription")}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
						<Button variant="destructive" onClick={() => void confirmDelete()}>
							{t("confirmDelete")}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
