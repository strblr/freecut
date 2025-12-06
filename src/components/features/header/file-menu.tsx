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
import { db, useStore } from "@/config";
import {
  clearRecentProjects,
  openProjectFromFileSystem,
  openProjectFromRecent
} from "@/utils";

export function FileMenu() {
  const recentProjects = useLiveQuery(() =>
    db.recentProjects.orderBy("updatedAt").reverse().toArray()
  );

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
        <DropdownMenuItem onClick={openProjectFromFileSystem}>
          Open from files
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
                  onClick={() => openProjectFromRecent(project)}
                >
                  {project.handle.name}
                  {project.fileSystem && (
                    <Badge variant="outline" className="ml-auto">
                      Filesystem
                    </Badge>
                  )}
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={clearRecentProjects}>
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
        <DropdownMenuItem onClick={useStore.getState().closeCurrentProject}>
          Close project
          <DropdownMenuShortcut>Ctrl+M F</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
