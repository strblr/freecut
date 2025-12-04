import { pick } from "lodash-es";
import { db, useStore, type RecentProject } from "@/config";

export async function openProjectFromComputer() {
  const handle = await window.showDirectoryPicker({
    mode: "readwrite"
  });
  const project = { handle, computer: true };
  await db.transaction("rw", db.recentProjects, async () => {
    const existing = await db.recentProjects
      .where({ name: handle.name })
      .and(project => project.computer === true)
      .first();
    const updatedAt = Date.now();
    if (existing) {
      await db.recentProjects.update(existing.id, { ...project, updatedAt });
    } else {
      await db.recentProjects.add({
        name: handle.name,
        ...project,
        updatedAt
      });
    }
    const all = await db.recentProjects
      .orderBy("updatedAt")
      .reverse()
      .toArray();
    if (all.length > 10) {
      await db.recentProjects.bulkDelete(
        all.slice(10).map(project => project.id)
      );
    }
  });
  useStore.getState().setCurrentProject(project);
}

export async function openProjectFromRecent(project: RecentProject) {
  const permission = await project.handle.requestPermission({
    mode: "readwrite"
  });
  if (permission === "granted") {
    await db.recentProjects.update(project.id, { updatedAt: Date.now() });
    useStore
      .getState()
      .setCurrentProject(pick(project, ["handle", "computer"]));
  }
}

export async function clearRecentProjects() {
  await db.recentProjects.clear();
}
