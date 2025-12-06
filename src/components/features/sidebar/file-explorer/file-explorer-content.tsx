import {
  useMemo,
  type HTMLAttributes,
  type Ref,
  type ReactNode,
  useDeferredValue
} from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, FolderOpenIcon } from "lucide-react";
import { isEmpty, last } from "lodash-es";
import {
  Button,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  i,
  Skeleton
} from "@/components";
import { useLazyThumbnail } from "@/hooks";
import {
  cn,
  filterDirectory,
  getFileIcon,
  readDirectory,
  type FileExplorerDirectory,
  type FileExplorerFile,
  type FileExplorerItem,
  type FileExplorerFilters
} from "@/utils";

interface FileExplorerContentProps {
  stack: FileSystemDirectoryHandle[];
  filters: FileExplorerFilters;
  onNavigate: (dir: FileSystemDirectoryHandle) => void;
}

export function FileExplorerContent({
  stack,
  filters,
  onNavigate
}: FileExplorerContentProps) {
  const directory = last(stack);
  const path = useMemo(() => stack.map(dir => dir.name), [stack]);
  const {
    data = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["read-directory", path],
    queryFn: () => readDirectory(directory!),
    enabled: !!directory
  });

  const items = useDeferredValue(
    useMemo(() => filterDirectory(data, filters), [data, filters])
  );

  if (isLoading) {
    return (
      <div className="flex w-18 flex-col items-center gap-2 rounded p-1">
        <Skeleton className="size-8 rounded" />
        <Skeleton className="h-3 w-12 rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertCircle className="text-destructive" />
          </EmptyMedia>
          <EmptyTitle>Error loading directory</EmptyTitle>
          <EmptyDescription>
            There was a problem loading the files in this directory.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" size="xs" onClick={() => refetch()}>
            Retry
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  if (isEmpty(items)) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderOpenIcon />
          </EmptyMedia>
          <EmptyTitle>Empty directory</EmptyTitle>
          <EmptyDescription>
            This directory contains no files or folders.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="flex flex-wrap items-start gap-1">
      {items.map(item =>
        item.kind === "directory" ? (
          <DirectoryItem key={item.name} item={item} onNavigate={onNavigate} />
        ) : item.type === "image" ? (
          <ImageFileItem key={item.name} item={item} />
        ) : (
          <FileItem key={item.name} item={item} />
        )
      )}
    </div>
  );
}

// FileItem

interface FileItemProps extends HTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>;
  item: FileExplorerItem;
  icon?: ReactNode;
  menu?: ReactNode;
}

function FileItem({
  ref,
  item,
  icon,
  menu,
  className,
  ...props
}: FileItemProps) {
  const defaultIcon = useMemo(() => getFileIcon(item), [item]);

  const handleRename = () => {
    console.log("Rename item:", item.name);
  };

  const handleDelete = () => {
    console.log("Delete item:", item.name);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button
          ref={ref}
          data-info={i("File", "Click to select this file.")}
          {...props}
          className={cn(
            "flex w-18 flex-col items-center gap-2 rounded p-1 transition-colors hover:bg-accent hover:text-accent-foreground",
            className
          )}
        >
          {icon ?? defaultIcon}
          <span className="line-clamp-3 text-center text-xs leading-tight wrap-anywhere">
            {item.name}
          </span>
        </button>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {menu}
        <ContextMenuItem onClick={handleRename}>Rename</ContextMenuItem>
        <ContextMenuItem onClick={handleDelete} variant="destructive">
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

// DirectoryItem

interface DirectoryItemProps {
  item: FileExplorerDirectory;
  onNavigate: (dir: FileSystemDirectoryHandle) => void;
}

function DirectoryItem({ item, onNavigate }: DirectoryItemProps) {
  const handleOpen = () => {
    onNavigate(item.handle);
  };
  return (
    <FileItem
      item={item}
      onClick={handleOpen}
      className="cursor-pointer"
      data-info={i("Directory", "Click to navigate to this directory.")}
      menu={<ContextMenuItem onClick={handleOpen}>Open</ContextMenuItem>}
    />
  );
}

// ImageFileItem

interface ImageFileItemProps {
  item: FileExplorerFile;
}

function ImageFileItem({ item }: ImageFileItemProps) {
  const [ref, thumbnail] = useLazyThumbnail(item.file);
  const handlePlaceOnTimeline = () => {};

  return (
    <FileItem
      ref={ref}
      item={item}
      icon={
        !thumbnail ? undefined : (
          <img
            src={thumbnail}
            alt={item.name}
            className="size-8 rounded object-cover"
          />
        )
      }
      menu={
        <ContextMenuItem onClick={handlePlaceOnTimeline}>
          Place on timeline
        </ContextMenuItem>
      }
    />
  );
}
