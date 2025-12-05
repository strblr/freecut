import {
  CaptionsIcon,
  FileAudioIcon,
  FileIcon,
  FileImageIcon,
  FileTextIcon,
  FileVideoIcon,
  FolderIcon
} from "lucide-react";
import prettyBytes from "pretty-bytes";
import { partition, sortBy } from "lodash-es";
import { dayjs, toSearchPattern } from "@/utils";

export type FileExplorerItem = FileExplorerDirectory | FileExplorerFile;

export type FileExplorerDirectory = {
  kind: "directory";
  name: string;
  handle: FileSystemDirectoryHandle;
};

export type FileExplorerFile = {
  kind: "file";
  name: string;
  type: ReturnType<typeof getFileType>;
  file: File;
  handle: FileSystemFileHandle;
};

// readDirectory

export function readDirectory(directory: FileSystemDirectoryHandle) {
  return Array.fromAsync(
    directory.values(),
    async (handle): Promise<FileExplorerItem> => {
      if (handle.kind === "directory") {
        return { kind: "directory", name: handle.name, handle };
      } else {
        return {
          kind: "file",
          name: handle.name,
          type: getFileType(handle.name),
          file: await handle.getFile(),
          handle
        };
      }
    }
  );
}

// filterDirectory

export interface FileExplorerFilters {
  search: string;
  sort: "name" | "type" | "size" | "date";
  order: "asc" | "desc";
}

export function filterDirectory(
  items: FileExplorerItem[],
  { search, sort, order }: FileExplorerFilters
) {
  if (search?.trim()) {
    const pattern = toSearchPattern(search);
    items = items.filter(item => pattern.test(item.name));
  }
  let [directories, files] = partition(
    items,
    item => item.kind === "directory"
  );
  directories = sortBy(directories, dir => dir.name);
  files = sortBy(
    files,
    sort === "name"
      ? item => item.name
      : sort === "type"
        ? item => item.type
        : sort === "size"
          ? item => item.file.size
          : item => item.file.lastModified
  );
  if (order === "desc") {
    files = files.reverse();
  }
  return [...directories, ...files];
}

// Other

export function formatFileSize(item: FileExplorerFile) {
  return prettyBytes(item.file.size);
}

export function formatFileDate(item: FileExplorerFile) {
  return dayjs(item.file.lastModified).fromNow();
}

export function getFileIcon(item: FileExplorerItem) {
  if (item.kind === "directory") {
    return <FolderIcon className="size-8 text-primary" />;
  }
  switch (item.type) {
    case "image":
      return (
        <FileImageIcon className="size-8 text-rose-600 dark:text-rose-400" />
      );
    case "subtitle":
      return (
        <CaptionsIcon className="size-8 text-blue-600 dark:text-blue-400" />
      );
    case "video":
      return (
        <FileVideoIcon className="size-8 text-purple-600 dark:text-purple-400" />
      );
    case "audio":
      return (
        <FileAudioIcon className="size-8 text-fuchsia-600 dark:text-fuchsia-400" />
      );
    case "text":
      return (
        <FileTextIcon className="size-8 text-slate-600 dark:text-slate-400" />
      );
    default:
      return <FileIcon className="size-8 text-stone-600 dark:text-stone-400" />;
  }
}

function getFileType(filename: string) {
  const extension = filename.split(".").pop()?.toLowerCase() ?? "";
  if (imageExtensions.includes(extension)) {
    return "image";
  }
  if (subtitleExtensions.includes(extension)) {
    return "subtitle";
  }
  if (videoExtensions.includes(extension)) {
    return "video";
  }
  if (audioExtensions.includes(extension)) {
    return "audio";
  }
  if (textExtensions.includes(extension)) {
    return "text";
  }
  return "other";
}

const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"];
const subtitleExtensions = [
  "srt",
  "sbv",
  "sub",
  "vtt",
  "ass",
  "ssa",
  "smi",
  "ttml"
];
const audioExtensions = ["mp3", "wav", "ogg", "aac", "flac", "m4a"];
const videoExtensions = [
  "mp4",
  "webm",
  "ogg",
  "avi",
  "mov",
  "wmv",
  "flv",
  "mkv"
];
const textExtensions = [
  "txt",
  "md",
  "json",
  "xml",
  "html",
  "css",
  "js",
  "ts",
  "jsx",
  "tsx",
  "py",
  "java",
  "cpp",
  "c",
  "h",
  "hpp"
];
