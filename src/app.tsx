import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/config";
import { Editor, ProjectProvider, ThemeSync, Welcome } from "@/components";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeSync />
      <ProjectProvider fallback={<Welcome />}>
        <Editor />
      </ProjectProvider>
    </QueryClientProvider>
  );
}
