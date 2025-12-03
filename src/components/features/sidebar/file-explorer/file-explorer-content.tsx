import {
  useMemo,
  useState,
  useEffect,
  useRef,
  type HTMLAttributes,
  type Ref,
  type ReactNode
} from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, FolderOpenIcon } from "lucide-react";
import { isEmpty, last } from "lodash-es";
import mergeRefs from "merge-refs";
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
  getFileIcon,
  getFileInfo,
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
      {items.map(item =>
        item.type === "image" ? (
          <ImageFileItem key={item.handle.name} item={item} />
        ) : (
          <FileItem
            key={item.handle.name}
            item={item}
            onNavigate={onNavigate}
          />
        )
      )}
    </div>
  );
}

// FileItemBase

interface FileItemBaseProps extends HTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>;
  icon: ReactNode;
  name: ReactNode;
}

function FileItemBase({
  ref,
  icon,
  name,
  className,
  ...props
}: FileItemBaseProps) {
  return (
    <button
      ref={ref}
      {...props}
      className={cn(
        "flex w-18 flex-col items-center gap-2 rounded p-1 transition-colors hover:bg-accent hover:text-accent-foreground",
        className
      )}
    >
      {icon}
      <span className="line-clamp-3 text-center text-xs leading-tight wrap-anywhere">
        {name}
      </span>
    </button>
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
    <FileItemBase
      icon={icon}
      name={item.handle.name}
      onClick={handleClick}
      ref={info(item.handle.name, getFileInfo(item))}
      className={cn({ "cursor-pointer": item.handle.kind === "directory" })}
    />
  );
}

// ImageFileItem

interface ImageFileItemProps {
  item: FileSystemItem;
}

function ImageFileItem({ item }: ImageFileItemProps) {
  const icon = useMemo(() => getFileIcon(item), [item]);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const elementRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;
    let visible = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || visible) return;
        visible = true;

        const img = new Image();
        const url = URL.createObjectURL(item.file!);

        img.onload = async () => {
          const canvas = new OffscreenCanvas(32, 32);
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            URL.revokeObjectURL(url);
            return;
          }

          const scale = Math.min(32 / img.width, 32 / img.height);
          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;

          const x = (32 - scaledWidth) / 2;
          const y = (32 - scaledHeight) / 2;

          ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
          URL.revokeObjectURL(url);

          const blob = await canvas.convertToBlob({
            type: "image/jpeg",
            quality: 0.8
          });
          const thumbnail = URL.createObjectURL(blob);
          setThumbnail(thumbnail);
        };

        img.src = url;
      },
      { threshold: 0.1 }
    );

    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(
    () => () => {
      thumbnail && URL.revokeObjectURL(thumbnail);
    },
    [thumbnail]
  );

  return (
    <FileItemBase
      ref={mergeRefs(elementRef, info(item.handle.name, getFileInfo(item)))}
      name={item.handle.name}
      icon={
        !thumbnail ? (
          icon
        ) : (
          <img
            src={thumbnail}
            alt={item.handle.name}
            className="size-8 rounded object-cover"
          />
        )
      }
    />
  );
}
