import { FolderIcon, InfoIcon, PanelLeftCloseIcon } from "lucide-react";
import {
  Badge,
  Button,
  EditMenu,
  FileMenu,
  HelpMenu,
  info,
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
    <header className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="logo" className="size-6" />
        <h1 className="text-lg font-bold">FreeCut</h1>
      </div>
      <div className="flex items-center gap-1">
        <FileMenu />
        <EditMenu />
        <ViewMenu onLayoutReset={onLayoutReset} />
        <HelpMenu />
      </div>
      {currentProject && (
        <>
          <Separator orientation="vertical" className="h-4!" />
          <div className="flex items-center gap-2 text-muted-foreground">
            <FolderIcon className="size-4" />
            <span>{currentProject.handle.name}</span>
            {currentProject.computer && (
              <Badge variant="outline" className="ml-auto">
                Computer
              </Badge>
            )}
          </div>
        </>
      )}
      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon-sm">
          <PanelLeftCloseIcon className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => useStore.getState().toggleShowInfoView()}
          {...info(
            "Toggle info view",
            <>
              Toggle this info view on and off. Hide it if you need space, or
              show it if you want to learn more about a feature.
            </>
          )}
        >
          <InfoIcon className="size-4" />
        </Button>
      </div>
    </header>
  );
}
