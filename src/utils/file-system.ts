import prettyBytes from "pretty-bytes";
import { sortBy } from "lodash-es";
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

export function formatFileSize(bytes?: number) {
  return bytes === undefined ? null : prettyBytes(bytes);
}

export function formatFileDate(timestamp?: number) {
  return timestamp === undefined ? null : dayjs(timestamp).fromNow();
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
