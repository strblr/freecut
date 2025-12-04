import { useContext } from "react";
import { ProjectContext } from "@/components";

export function useProject() {
  const payload = useContext(ProjectContext);
  if (!payload) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return payload;
}
