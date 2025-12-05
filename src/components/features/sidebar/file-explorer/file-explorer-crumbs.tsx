import { Fragment } from "react";
import { HomeIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  i
} from "@/components";

interface FileExplorerCrumbsProps {
  stack: FileSystemDirectoryHandle[];
  onNavigate: (index: number) => void;
}

export function FileExplorerCrumbs({
  stack,
  onNavigate
}: FileExplorerCrumbsProps) {
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
                  aria-label="Navigate to root directory"
                  data-info={i(
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
  );
}
