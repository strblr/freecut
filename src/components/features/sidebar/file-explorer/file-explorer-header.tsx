import { Fragment } from "react";
import {
  ArrowDownUpIcon,
  ArrowLeftIcon,
  FolderPlusIcon,
  HomeIcon,
  SearchIcon
} from "lucide-react";
import { last } from "lodash-es";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  info
} from "@/components";
import { queryClient } from "@/config";

interface FileExplorerHeaderProps {
  stack: FileSystemDirectoryHandle[];
  onNavigate: (index: number) => void;
}

export function FileExplorerHeader({
  stack,
  onNavigate
}: FileExplorerHeaderProps) {
  const handleNavigateBack = () => {
    onNavigate(Math.max(stack.length - 2, 0));
  };

  const handleAddFolder = async () => {
    const directory = last(stack);
    if (!directory) return;
    await directory.getDirectoryHandle("New folder", { create: true });
    queryClient.invalidateQueries({
      queryKey: ["directory-items", stack.map(dir => dir.name)]
    });
  };

  const crumbs =
    stack.length <= 3
      ? stack.map((directory, index) => ({
          type: "item" as const,
          directory,
          index
        }))
      : [
          { type: "item" as const, directory: stack[0], index: 0 },
          { type: "ellipsis" as const },
          {
            type: "item" as const,
            directory: stack[stack.length - 2],
            index: stack.length - 2
          },
          {
            type: "item" as const,
            directory: stack[stack.length - 1],
            index: stack.length - 1
          }
        ];

  return (
    <div className="flex items-center gap-2 border-t border-b bg-secondary px-2 py-1">
      <Button
        size="icon-xs"
        variant="ghost"
        disabled={stack.length <= 1}
        onClick={handleNavigateBack}
        {...info("Navigate back", "Navigate back to the parent directory.")}
      >
        <ArrowLeftIcon className="size-4" />
      </Button>
      <Breadcrumb className="min-w-0 overflow-hidden">
        <BreadcrumbList className="h-5 flex-nowrap">
          {crumbs.map((item, itemIndex) => (
            <Fragment key={itemIndex}>
              {itemIndex !== 0 && <BreadcrumbSeparator>/</BreadcrumbSeparator>}
              <BreadcrumbItem>
                {item.type === "ellipsis" ? (
                  <BreadcrumbEllipsis />
                ) : item.index === 0 ? (
                  <BreadcrumbLink
                    asChild
                    onClick={() => onNavigate(0)}
                    {...info(
                      "Navigate to root directory",
                      "Navigate to the root directory."
                    )}
                  >
                    <button>
                      <HomeIcon className="size-4" />
                    </button>
                  </BreadcrumbLink>
                ) : item.index === stack.length - 1 ? (
                  <BreadcrumbPage className="text-xs whitespace-nowrap">
                    {item.directory.name}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    asChild
                    className="text-xs whitespace-nowrap"
                    onClick={() => onNavigate(item.index)}
                  >
                    <button>{item.directory.name}</button>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <Button
        size="icon-xs"
        variant="ghost"
        className="ml-auto"
        onClick={handleAddFolder}
        {...info("Add folder", "Add a new folder to the current directory.")}
      >
        <FolderPlusIcon className="size-4" />
      </Button>
      <Button
        size="icon-xs"
        variant="ghost"
        {...info(
          "Sort files",
          "Sort the file list by name, size, type, or date."
        )}
      >
        <ArrowDownUpIcon className="size-4" />
      </Button>
      <Button
        size="icon-xs"
        variant="ghost"
        {...info(
          "Search files",
          "Search the file list by keywords or patterns."
        )}
      >
        <SearchIcon className="size-4" />
      </Button>
    </div>
  );
}
