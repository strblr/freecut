import { useState } from "react";
import { useSetState } from "@mantine/hooks";
import { isNumber, take } from "lodash-es";
import {
  FileExplorerHeader,
  FileExplorerContent,
  ScrollArea
} from "@/components";
import { useProject } from "@/hooks";
import type { FileExplorerFilters } from "@/utils";

export function FileExplorer() {
  const { project } = useProject();
  const [stack, setStack] = useState<FileSystemDirectoryHandle[]>([
    project.handle
  ]);

  const [filters, setFilters] = useSetState<FileExplorerFilters>({
    search: "",
    sort: "name",
    order: "asc"
  });

  const handleNavigate = async (
    directory: FileSystemDirectoryHandle | number
  ) => {
    if (isNumber(directory)) {
      setStack(take(stack, directory + 1));
    } else {
      setStack([...stack, directory]);
    }
  };

  return (
    <>
      <FileExplorerHeader
        stack={stack}
        filters={filters}
        onNavigate={handleNavigate}
        onFiltersChange={setFilters}
      />
      <ScrollArea className="min-h-0 flex-1" viewportClassName="p-2">
        <FileExplorerContent
          filters={filters}
          stack={stack}
          onNavigate={handleNavigate}
        />
      </ScrollArea>
    </>
  );
}
