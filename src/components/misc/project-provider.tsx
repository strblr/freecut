import { createContext, useMemo, type ReactNode } from "react";
import weakKey from "weak-key";
import { useStore, type CurrentProject } from "@/config";

export interface ProjectContextPayload {
  project: CurrentProject;
}

export const ProjectContext = createContext<ProjectContextPayload | null>(null);

export interface ProjectProviderProps {
  fallback: ReactNode;
  children: ReactNode;
}

export function ProjectProvider({ fallback, children }: ProjectProviderProps) {
  const project = useStore(store => store.currentProject);

  const payload = useMemo<ProjectContextPayload | null>(() => {
    if (!project) return null;
    return { project };
  }, [project]);

  return !payload ? (
    fallback
  ) : (
    <ProjectContext.Provider key={weakKey(payload.project)} value={payload}>
      {children}
    </ProjectContext.Provider>
  );
}
