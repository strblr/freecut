import { useState } from "react";
import { isNumber, take } from "lodash-es";
import {
  FileExplorerHeader,
  FileExplorerContent,
  ScrollArea
} from "@/components";
import type { CurrentProject } from "@/config";
import type { FilterDirectoryOptions } from "@/utils";

interface FileExplorerProps {
  currentProject: CurrentProject;
}

export function FileExplorer({ currentProject }: FileExplorerProps) {
  const [stack, setStack] = useState<FileSystemDirectoryHandle[]>([
    currentProject.handle
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
