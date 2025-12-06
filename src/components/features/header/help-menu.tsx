import { useDeferredValue, useMemo, useState } from "react";
import { useInputState } from "@mantine/hooks";
import { SearchIcon } from "lucide-react";
import { entries, groupBy, isEmpty } from "lodash-es";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Input,
  ScrollArea
} from "@/components";

export function HelpMenu() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [search, setSearch] = useInputState("");
  const deferredSearch = useDeferredValue(search);

  const shortcuts = useMemo(() => {
    if (!deferredSearch.trim()) {
      return keyboardShortcuts;
    }
    const term = deferredSearch.trim().toLowerCase();
    return keyboardShortcuts.filter(
      shortcut =>
        shortcut.action.toLowerCase().includes(term) ||
        shortcut.key.toLowerCase().includes(term) ||
        shortcut.category.toLowerCase().includes(term)
    );
  }, [deferredSearch]);

  const groupedShortcuts = useMemo(() => {
    return groupBy(shortcuts, item => item.category);
  }, [shortcuts]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="px-1">Help</DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => setShortcutsOpen(true)}>
            Keyboard shortcuts
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a
              href="https://github.com/strblr/freecut"
              target="_blank"
              rel="noopener noreferrer"
            >
              Support
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href="https://github.com/strblr/freecut"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contribute
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href="https://github.com/strblr/freecut/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              Report a bug
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setAboutOpen(true)}>
            About
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>About FreeCut</DialogTitle>
            <DialogDescription>
              <strong>FreeCut</strong> is a powerful yet intuitive video editing
              application that makes editing, trimming, and enhancing your
              videos simple and accessible.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Key Features:</h4>
              <ul className="list-inside list-disc space-y-1">
                <li>Edit and trim videos with precision</li>
                <li>Apply enhancements, transitions, and effects</li>
                <li>Work with local files directly from your computer</li>
                <li>Save and manage projects locally</li>
                <li>Free and open source</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Privacy:</h4>
              <p>
                Your files remain on your local filesystem for privacy. Project
                metadata and settings are stored either in your browser's local
                database or on your filesystem. No data is sent to external
                servers, not even for analytics.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={shortcutsOpen} onOpenChange={setShortcutsOpen}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
            <DialogDescription>
              Use these keyboard shortcuts to work more efficiently in FreeCut.
            </DialogDescription>
          </DialogHeader>
          <Input
            size="sm"
            className="w-full"
            value={search}
            onChange={setSearch}
            placeholder="Search shortcuts..."
          />
          <ScrollArea viewportClassName="max-h-96 pr-4">
            <div className="space-y-4">
              {entries(groupedShortcuts).map(([category, shortcuts]) => (
                <div key={category} className="space-y-2">
                  <h4 className="font-semibold text-foreground">{category}</h4>
                  <div className="space-y-1">
                    {shortcuts.map(shortcut => (
                      <div
                        key={shortcut.action}
                        className="flex justify-between"
                      >
                        <span>{shortcut.action}</span>
                        <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                          {shortcut.key}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {isEmpty(shortcuts) && search && (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia>
                      <SearchIcon />
                    </EmptyMedia>
                    <EmptyTitle>No shortcuts found</EmptyTitle>
                  </EmptyHeader>
                </Empty>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}

const keyboardShortcuts = [
  { category: "Playback", action: "Play/Pause", key: "Space" },
  { category: "Playback", action: "Stop", key: "Esc" },
  { category: "Playback", action: "Skip forward", key: "→" },
  { category: "Playback", action: "Skip backward", key: "←" },
  { category: "Editing", action: "Undo", key: "Ctrl+Z" },
  { category: "Editing", action: "Redo", key: "Ctrl+Y" },
  { category: "Editing", action: "Cut", key: "Ctrl+X" },
  { category: "Editing", action: "Copy", key: "Ctrl+C" },
  { category: "Editing", action: "Paste", key: "Ctrl+V" },
  { category: "Editing", action: "Delete", key: "Del" },
  { category: "Selection", action: "Select all", key: "Ctrl+A" },
  { category: "Selection", action: "Select none", key: "Ctrl+D" },
  { category: "Selection", action: "Next clip", key: "Tab" },
  { category: "Selection", action: "Previous clip", key: "Shift+Tab" },
  { category: "Tools", action: "Trim", key: "T" },
  { category: "Tools", action: "Split", key: "S" },
  { category: "Tools", action: "Zoom in", key: "Ctrl++" },
  { category: "Tools", action: "Zoom out", key: "Ctrl+-" },
  { category: "Tools", action: "Save", key: "Ctrl+S" }
];
