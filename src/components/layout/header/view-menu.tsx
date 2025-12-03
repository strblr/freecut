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
  DropdownMenuTrigger,
  info
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
        <DropdownMenuItem
          onClick={onLayoutReset}
          {...info(
            "Reset layout",
            "Reset the panels sizes and visibility to their initial state."
          )}
        >
          Reset layout
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem>Show sidebar</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showInfoView}
          onCheckedChange={useStore.getState().toggleShowInfoView}
          {...info(
            "Show info view",
            <>
              Toggle this info view on and off. Hide it if you need space, or
              show it if you want to learn more about a feature.
            </>
          )}
        >
          Show info view
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger
            {...info(
              "Theme",
              <>
                Switch the color scheme of the application between light, dark,
                and system. The system theme will follow the user's system
                preference.
              </>
            )}
          >
            Theme
          </DropdownMenuSubTrigger>
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
