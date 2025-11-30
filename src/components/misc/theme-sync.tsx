import { useLayoutEffect } from "react";
import { useStore } from "@/config";

export function ThemeSync() {
  const theme = useStore(state => state.computedTheme());

  useLayoutEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return null;
}
