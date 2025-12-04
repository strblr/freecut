import { useState } from "react";
import { isNumber, take } from "lodash-es";
import {
  FileExplorerHeader,
  FileExplorerContent,
  ScrollArea
} from "@/components";
import { useProject } from "@/hooks";
import type { FilterDirectoryOptions } from "@/utils";

export function FileExplorer() {
  const { project } = useProject();
  const [stack, setStack] = useState<FileSystemDirectoryHandle[]>([
    project.handle
  ]);

  const [filters, setFilters] = useState<FilterDirectoryOptions>({
    search: "",
    sort: "name",
    descending: false
  });

  const handleNavigate = async (dir: FileSystemDirectoryHandle | number) => {
    if (isNumber(dir)) {
      setStack(take(stack, dir + 1));
    } else {
      setStack([...stack, dir]);
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
