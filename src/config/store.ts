import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Store {
  theme: "light" | "dark" | "system";
  currentProject: CurrentProject | null;
  showInfoView: boolean;
  computedTheme: () => "light" | "dark";
  setTheme: (theme: Store["theme"]) => void;
  setCurrentProject: (project: CurrentProject) => void;
  closeCurrentProject: () => void;
  toggleShowInfoView: (show?: boolean) => void;
}

export interface CurrentProject {
  handle: FileSystemDirectoryHandle;
  computer: boolean;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      theme: "dark",
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
      toggleShowInfoView: (show?: boolean) => {
        set({ showInfoView: show ?? !get().showInfoView });
      }
    }),
    {
      name: "freecut-store",
      version: 1,
      partialize: ({ currentProject, ...rest }) => rest
    }
  )
);
