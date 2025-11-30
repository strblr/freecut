import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components";
import { useStore } from "@/config";

export interface ViewMenuProps {
  onLayoutReset: () => void;
}

export function ViewMenu({ onLayoutReset }: ViewMenuProps) {
  const theme = useStore(store => store.theme);
  const showInfoView = useStore(store => store.showInfoView);

  const handleThemeChange = (theme: string) => {
    useStore.getState().setTheme(theme as "light" | "dark" | "system");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-1">View</DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="overflow-hidden">
        <DropdownMenuItem onClick={onLayoutReset}>
          Reset layout
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={showInfoView}
          onClick={useStore.getState().toggleInfoView}
        >
          Show info view
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={theme}
              onValueChange={handleThemeChange}
            >
              <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">
                System
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
