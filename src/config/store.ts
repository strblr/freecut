import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Store {
  theme: "light" | "dark" | "system";
  currentProject: FileSystemDirectoryHandle | null;
  showInfoView: boolean;
  computedTheme: () => "light" | "dark";
  setTheme: (theme: Store["theme"]) => void;
  setCurrentProject: (project: FileSystemDirectoryHandle) => void;
  closeCurrentProject: () => void;
  toggleInfoView: () => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      theme: "system",
      currentProject: null,
      showInfoView: true,
      computedTheme: () => {
        const { theme } = get();
        if (theme === "system") {
          const dark = window.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches;
          return dark ? "dark" : "light";
        }
        return theme;
      },
      setTheme: theme => {
        set({ theme });
      },
      setCurrentProject: project => {
        set({ currentProject: project });
      },
      closeCurrentProject: () => {
        set({ currentProject: null });
      },
      toggleInfoView: () => {
        set({ showInfoView: !get().showInfoView });
      }
    }),
    {
      name: "freecut-store",
      version: 1,
      partialize: ({ currentProject, ...rest }) => rest
    }
  )
);
