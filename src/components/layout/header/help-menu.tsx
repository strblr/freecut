import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components";

export function HelpMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-1">Help</DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuItem>Contribute</DropdownMenuItem>
        <DropdownMenuItem>Report a bug</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>About</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
