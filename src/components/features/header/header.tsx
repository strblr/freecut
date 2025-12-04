import { FolderIcon, HandHeartIcon, InfoIcon } from "lucide-react";
import {
  Badge,
  Button,
  EditMenu,
  FileMenu,
  HelpMenu,
  i,
  Separator,
  ViewMenu
} from "@/components";
import { useStore } from "@/config";
import { useProject } from "@/hooks";

export interface HeaderProps {
  onLayoutReset: () => void;
}

export function Header({ onLayoutReset }: HeaderProps) {
  const { project } = useProject();

  return (
    <header className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <img src="/logo.svg" alt="logo" className="size-6" />
        <h1 className="text-lg font-bold">FreeCut</h1>
      </div>
      <div className="flex items-center gap-1">
        <FileMenu />
        <EditMenu />
        <ViewMenu onLayoutReset={onLayoutReset} />
        <HelpMenu />
      </div>
      <Separator orientation="vertical" className="h-4!" />
      <div className="flex items-center gap-2 text-muted-foreground">
        <FolderIcon className="size-4" />
        <span>{project.handle.name}</span>
        {project.computer && (
          <Badge variant="outline" className="ml-auto">
            Computer
          </Badge>
        )}
      </div>
      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Support FreeCut"
          data-info={i(
            "Support FreeCut",
            "Support the project to help us continue development."
          )}
        >
          <HandHeartIcon className="size-4 text-primary" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => useStore.getState().toggleShowInfoView()}
          aria-label="Toggle info view"
          data-info={i(
            "Toggle info view",
            "Toggle this info view on and off. Hide it if you need space, or show it if you want to learn more about a feature."
          )}
        >
          <InfoIcon className="size-4" />
        </Button>
      </div>
    </header>
  );
}
