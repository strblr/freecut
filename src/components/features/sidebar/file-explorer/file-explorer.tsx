import {
  FileExplorerHeader,
  FileExplorerContent,
  ScrollArea
} from "@/components";

interface FileExplorerProps {
  stack: FileSystemDirectoryHandle[];
  onNavigate: (directory: FileSystemDirectoryHandle | number) => void;
}

export function FileExplorer({ stack, onNavigate }: FileExplorerProps) {
  return (
    <>
      <FileExplorerHeader stack={stack} onNavigate={onNavigate} />
      <ScrollArea className="min-h-0 flex-1" viewportClassName="p-2">
        <FileExplorerContent stack={stack} onNavigate={onNavigate} />
      </ScrollArea>
    </>
  );
}
