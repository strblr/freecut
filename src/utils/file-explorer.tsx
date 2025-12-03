import {
  FileAudioIcon,
  FileIcon,
  FileImageIcon,
  FileTextIcon,
  FileVideoIcon,
  FolderIcon
} from "lucide-react";
import prettyBytes from "pretty-bytes";
import { capitalize, sortBy } from "lodash-es";
import { dayjs } from "@/utils";

export interface FileSystemItem {
  handle: FileSystemDirectoryHandle | FileSystemFileHandle;
  type?: ReturnType<typeof getFileType>;
  file?: File;
}

export async function readDirectoryItems(directory: FileSystemDirectoryHandle) {
  const items = await Array.fromAsync(
    directory.values(),
    async (handle): Promise<FileSystemItem> => {
      if (handle.kind === "directory") {
        return { handle };
      } else {
        return {
          handle,
          type: getFileType(handle.name),
          file: await handle.getFile()
        };
      }
    }
  );
  return sortBy(
    items,
    item => item.handle.kind,
    item => item.handle.name
  );
}

export function formatFileSize(item: FileSystemItem) {
  return prettyBytes(item.file?.size ?? 0);
}

export function formatFileDate(item: FileSystemItem) {
  return dayjs(item.file?.lastModified ?? 0).fromNow();
}

export function getFileInfo(item: FileSystemItem): string {
  if (item.handle.kind === "directory") {
    return "Click to navigate to this directory";
  }
  return `${capitalize(item.type)} file\n\nSize: ${formatFileSize(item)}\n\nLast modified: ${formatFileDate(item)}`;
}

export function getFileIcon(item: FileSystemItem) {
  if (item.handle.kind === "directory") {
    return <FolderIcon className="size-8 text-primary" />;
  }
  switch (item.type) {
    case "image":
      return (
        <FileImageIcon className="size-8 text-rose-600 dark:text-rose-400" />
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
