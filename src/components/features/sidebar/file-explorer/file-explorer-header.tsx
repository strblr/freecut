import { useEffect, useState, type KeyboardEvent } from "react";
import { useDebouncedCallback, useInputState } from "@mantine/hooks";
import {
  ArrowDownUpIcon,
  ArrowLeftIcon,
  FolderPlusIcon,
  SearchIcon,
  XIcon
} from "lucide-react";
import { last } from "lodash-es";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FileExplorerCrumbs,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  i,
  DialogDescription
} from "@/components";
import { queryClient } from "@/config";
import type { FileExplorerFilters } from "@/utils";

interface FileExplorerHeaderProps {
  stack: FileSystemDirectoryHandle[];
  filters: FileExplorerFilters;
  onNavigate: (index: number) => void;
  onFiltersChange: (filters: Partial<FileExplorerFilters>) => void;
}

export function FileExplorerHeader({
  stack,
  filters,
  onNavigate,
  onFiltersChange
}: FileExplorerHeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [folderName, setFolderName] = useInputState("");

  const handleNavigateBack = () => {
    onNavigate(Math.max(stack.length - 2, 0));
  };

  const handleFolderNameKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && folderName.trim()) {
      handleCreateFolder();
      setShowCreate(false);
    } else if (e.key === "Escape") {
      setFolderName("");
    }
  };

  const handleCreateFolder = async () => {
    const name = folderName.trim();
    if (!name) return;
    const directory = last(stack);
    if (!directory) return;
    await directory.getDirectoryHandle(name, { create: true });
    queryClient.invalidateQueries({
      queryKey: ["read-directory", stack.map(dir => dir.name)]
    });
    setFolderName("");
  };

  const handleSortChange = (sort: string) => {
    onFiltersChange({
      sort: sort as FileExplorerFilters["sort"],
      order: sort === "name" ? "asc" : "desc"
    });
  };

  const handleOrderChange = (order: string) => {
    onFiltersChange({ order: order as FileExplorerFilters["order"] });
  };

  const handleSearchChange = useDebouncedCallback(
    (search: string) => onFiltersChange({ search }),
    100
  );

  useEffect(() => {
    if (!showSearch) {
      onFiltersChange({ search: "" });
    }
  }, [showSearch]);

  return (
    <div className="border-t border-b bg-secondary px-2 py-1">
      <div className="flex items-center gap-1">
        <Button
          size="icon-xs"
          variant="ghost"
          disabled={stack.length <= 1}
          onClick={handleNavigateBack}
          aria-label="Navigate back"
          data-info={i(
            "Navigate back",
            "Navigate back to the parent directory."
          )}
        >
          <ArrowLeftIcon className="size-4" />
        </Button>
        <FileExplorerCrumbs stack={stack} onNavigate={onNavigate} />
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button
              size="icon-xs"
              variant="ghost"
              className="ml-auto"
              aria-label="Add folder"
              data-info={i(
                "Add folder",
                "Add a new folder to the current directory."
              )}
            >
              <FolderPlusIcon className="size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xs">
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
              <DialogDescription>Enter folder name</DialogDescription>
            </DialogHeader>
            <Input
              size="sm"
              autoFocus
              placeholder="Folder name..."
              value={folderName}
              onChange={setFolderName}
              onKeyDown={handleFolderNameKeyDown}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setFolderName("")}
                >
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  size="sm"
                  disabled={!folderName.trim()}
                  onClick={handleCreateFolder}
                >
                  Create
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon-xs"
              variant="ghost"
              aria-label="Sort files"
              data-info={i(
                "Sort files",
                "Sort the file list by name, size, type, or date."
              )}
            >
              <ArrowDownUpIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={filters.sort}
              onValueChange={handleSortChange}
            >
              <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="type">Type</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="size">Size</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={filters.order}
              onValueChange={handleOrderChange}
            >
              <DropdownMenuRadioItem value="asc">
                Ascending
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="desc">
                Descending
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          size="icon-xs"
          variant="ghost"
          onClick={() => setShowSearch(!showSearch)}
          aria-label={showSearch ? "Close search" : "Search files"}
          data-info={i(
            showSearch ? "Close search" : "Search files",
            showSearch
              ? "Close the search input."
              : "Search the file list by keywords or patterns."
          )}
        >
          {showSearch ? (
            <XIcon className="size-4" />
          ) : (
            <SearchIcon className="size-4" />
          )}
        </Button>
      </div>
      {showSearch && (
        <Input
          autoFocus
          size="xs"
          variant="ghost"
          className="mt-1"
          placeholder="Search in directory..."
          defaultValue={filters.search}
          onChange={e => handleSearchChange(e.target.value)}
          onKeyDown={e => e.key === "Escape" && setShowSearch(false)}
        />
      )}
    </div>
  );
}
