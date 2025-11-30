import { useLiveQuery } from "dexie-react-hooks";
import { isEmpty } from "lodash-es";
import {
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components";
import { db, useStore, type RecentProject } from "@/config";

export function FileMenu() {
  const hasCurrentProject = useStore(store => !!store.currentProject);

  const recentProjects = useLiveQuery(() =>
    db.recentProjects.orderBy("updatedAt").reverse().toArray()
  );

  const handleOpenFromComputer = async () => {
    const handle = await window.showDirectoryPicker({
      mode: "readwrite"
    });
    await db.transaction("rw", db.recentProjects, async () => {
      const existing = await db.recentProjects
        .where({ name: handle.name })
        .and(project => project.computer === true)
        .first();
      const updatedAt = Date.now();
      if (existing) {
        await db.recentProjects.update(existing.id, { handle, updatedAt });
      } else {
        await db.recentProjects.add({
          name: handle.name,
          computer: true,
          handle,
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
    useStore.getState().setCurrentProject(handle);
  };

  const handleOpenFromRecent = async (project: RecentProject) => {
    const permission = await project.handle.requestPermission({
      mode: "readwrite"
    });
    if (permission === "granted") {
      await db.recentProjects.update(project.id, { updatedAt: Date.now() });
      useStore.getState().setCurrentProject(project.handle);
    }
  };

  const handleClearRecent = async () => {
    await db.recentProjects.clear();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-1">File</DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="overflow-hidden">
        <DropdownMenuItem>New</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Open
          <DropdownMenuShortcut>Ctrl+O</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleOpenFromComputer}>
          Open from computer
          <DropdownMenuShortcut>Ctrl+M Ctrl+O</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Open recent</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {!recentProjects || isEmpty(recentProjects) ? (
              <DropdownMenuItem disabled>No recent projects</DropdownMenuItem>
            ) : (
              recentProjects.map(project => (
                <DropdownMenuItem
                  key={project.id}
                  onClick={() => handleOpenFromRecent(project)}
                >
                  {project.handle.name}
                  {project.computer && (
                    <Badge variant="outline" className="ml-auto">
                      Computer
                    </Badge>
                  )}
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleClearRecent}>
              Clear recent
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Save
          <DropdownMenuShortcut>Ctrl+S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={!hasCurrentProject}
          onClick={useStore.getState().closeCurrentProject}
        >
          Close project
          <DropdownMenuShortcut>Ctrl+M F</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
