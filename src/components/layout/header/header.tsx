import { FolderIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  FileMenu,
  Separator,
  ViewMenu
} from "@/components";
import { useStore } from "@/config";

export interface HeaderProps {
  onLayoutReset: () => void;
}

export function Header({ onLayoutReset }: HeaderProps) {
  const currentProject = useStore(store => store.currentProject);

  return (
    <header className="flex items-center gap-5">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="logo" className="size-6" />
        <h1 className="text-lg font-bold">FreeCut</h1>
      </div>
      <div className="flex items-center gap-2">
        <FileMenu />
        <DropdownMenu>
          <DropdownMenuTrigger className="px-1">Edit</DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>
              Undo
              <DropdownMenuShortcut>Ctrl+Z</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Redo
              <DropdownMenuShortcut>Ctrl+Y</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ViewMenu onLayoutReset={onLayoutReset} />
        <DropdownMenu>
          <DropdownMenuTrigger className="px-1">Help</DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuItem>Contribute</DropdownMenuItem>
            <DropdownMenuItem>Report a bug</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>About</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {currentProject && (
        <>
          <Separator orientation="vertical" className="h-4!" />
          <div className="flex items-center gap-2 text-muted-foreground">
            <FolderIcon className="size-4" />
            <span>{currentProject.name}</span>
          </div>
        </>
      )}
    </header>
  );
}
