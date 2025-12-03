import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  File,
  Folder,
  FileImage,
  FileVideo,
  FileAudio,
  FileText,
  AlertCircle,
  FolderOpenIcon
} from "lucide-react";
import { capitalize, isEmpty, last } from "lodash-es";
import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  info,
  Skeleton
} from "@/components";
import {
  cn,
  formatFileDate,
  formatFileSize,
  readDirectoryItems,
  type FileSystemItem
} from "@/utils";

interface FileExplorerContentProps {
  stack: FileSystemDirectoryHandle[];
  onNavigate: (dir: FileSystemDirectoryHandle) => void;
}

export function FileExplorerContent({
  stack,
  onNavigate
}: FileExplorerContentProps) {
  const directory = last(stack);
  const path = useMemo(() => stack.map(dir => dir.name), [stack]);
  const {
    data: items = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["directory-items", path],
    queryFn: () => readDirectoryItems(directory!),
    enabled: !!directory
  });

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
      {items.map(item => (
        <FileItem key={item.handle.name} item={item} onNavigate={onNavigate} />
      ))}
    </div>
  );
}

// FileItem

interface FileItemProps {
  item: FileSystemItem;
  onNavigate: (dir: FileSystemDirectoryHandle) => void;
}

function FileItem({ item, onNavigate }: FileItemProps) {
  const icon = useMemo(() => getFileIcon(item), [item]);
  const handleClick = () => {
    if (item.handle.kind === "directory") {
      onNavigate(item.handle);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex w-18 flex-col items-center gap-2 rounded p-1 transition-colors hover:bg-accent hover:text-accent-foreground",
        { "cursor-pointer": item.handle.kind === "directory" }
      )}
      ref={info(
        item.handle.name,
        item.handle.kind === "directory"
          ? "Click to navigate to this directory"
          : `${capitalize(item.type)} file\n\nSize: ${formatFileSize(item.file?.size)}\n\nLast modified: ${formatFileDate(item.file?.lastModified)}`
      )}
    >
      {icon}
      <span className="line-clamp-3 text-center text-xs leading-tight wrap-anywhere">
        {item.handle.name}
      </span>
    </button>
  );
}

function getFileIcon(item: FileSystemItem) {
  if (item.handle.kind === "directory") {
    return <Folder className="size-8 text-primary" />;
  }
  switch (item.type) {
    case "image":
      return <FileImage className="size-8 text-rose-600 dark:text-rose-400" />;
    case "video":
      return (
        <FileVideo className="size-8 text-purple-600 dark:text-purple-400" />
      );
    case "audio":
      return (
        <FileAudio className="size-8 text-fuchsia-600 dark:text-fuchsia-400" />
      );
    case "text":
      return <FileText className="size-8 text-slate-600 dark:text-slate-400" />;
    default:
      return <File className="size-8 text-stone-600 dark:text-stone-400" />;
  }
}
