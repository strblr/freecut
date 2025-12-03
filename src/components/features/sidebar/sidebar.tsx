import { useEffect, useState } from "react";
import {
  ArrowLeftRightIcon,
  FilesIcon,
  FileSymlinkIcon,
  SettingsIcon,
  SparklesIcon
} from "lucide-react";
import { isNumber, take } from "lodash-es";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  FileExplorer,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components";
import { useStore } from "@/config";

export function Sidebar() {
  const { currentProject } = useStore();
  const [stack, setStack] = useState<FileSystemDirectoryHandle[]>([]);

  useEffect(
    () => setStack(currentProject ? [currentProject.handle] : []),
    [currentProject]
  );

  const handleNavigate = async (dir: FileSystemDirectoryHandle | number) => {
    if (isNumber(dir)) {
      setStack(take(stack, dir + 1));
    } else {
      setStack([...stack, dir]);
    }
  };

  if (!currentProject) {
    return (
      <Empty className="h-full">
        <EmptyHeader>
          <EmptyTitle>No project selected</EmptyTitle>
          <EmptyDescription>Open or create a project</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <Tabs defaultValue="files" className="h-full gap-0">
      <TabsList className="h-auto bg-transparent p-2">
        <TabsTrigger value="files" aria-label="Project files">
          <FilesIcon className="size-6" strokeWidth={1.5} />
        </TabsTrigger>
        <TabsTrigger value="shared" aria-label="Shared files">
          <FileSymlinkIcon className="size-6" strokeWidth={1.5} />
        </TabsTrigger>
        <TabsTrigger value="effects" aria-label="Effects">
          <SparklesIcon className="size-6" strokeWidth={1.5} />
        </TabsTrigger>
        <TabsTrigger value="transitions" aria-label="Transitions">
          <ArrowLeftRightIcon className="size-6" strokeWidth={1.5} />
        </TabsTrigger>
        <TabsTrigger value="settings" aria-label="Settings">
          <SettingsIcon className="size-6" strokeWidth={1.5} />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="files" className="flex min-h-0 flex-col">
        <FileExplorer stack={stack} onNavigate={handleNavigate} />
      </TabsContent>
      <TabsContent value="shared"></TabsContent>
      <TabsContent value="effects"></TabsContent>
      <TabsContent value="transitions"></TabsContent>
      <TabsContent value="settings"></TabsContent>
    </Tabs>
  );
}
