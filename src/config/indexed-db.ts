import { Dexie, type EntityTable } from "dexie";

export interface RecentProject {
  id: number;
  name: string;
  handle: FileSystemDirectoryHandle;
  computer: boolean;
  updatedAt: number;
}

export const db = new Dexie("freecut-db") as Dexie & {
  recentProjects: EntityTable<RecentProject, "id">;
};

db.version(1).stores({
  recentProjects: "++id, name, updatedAt"
});
