import Dexie, { type EntityTable } from "dexie";

export type ProjectMeta = {
	id: string;
	name: string;
	updatedAt: number;
};

export type ProjectRow = ProjectMeta & {
	graphJson: string;
};

/** Ostatnio otwarty projekt (synchronizacja między kartami w tej samej origin) */
export const ACTIVE_PROJECT_LS_KEY = "visualsitemaps-active-project-id";

class ProjectsDexie extends Dexie {
	projects!: EntityTable<ProjectRow, "id">;

	constructor() {
		super("visualsitemaps_projects");
		this.version(1).stores({
			projects: "id, updatedAt, name",
		});
	}
}

export const projectsDb = new ProjectsDexie();

export async function listProjectsMeta(): Promise<ProjectMeta[]> {
	const rows = await projectsDb.projects.orderBy("updatedAt").reverse().toArray();
	return rows.map(({ id, name, updatedAt }) => ({ id, name, updatedAt }));
}

export async function getProjectRow(
	id: string,
): Promise<ProjectRow | undefined> {
	return projectsDb.projects.get(id);
}

export async function putProject(row: ProjectRow): Promise<void> {
	await projectsDb.projects.put(row);
}

export async function deleteProjectRow(id: string): Promise<void> {
	await projectsDb.projects.delete(id);
}

export async function countProjects(): Promise<number> {
	return projectsDb.projects.count();
}
