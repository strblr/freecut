import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/config";
import { Editor, ProjectProvider, ThemeSync, Landing } from "@/components";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeSync />
      <ProjectProvider fallback={<Landing />}>
        <Editor />
      </ProjectProvider>
    </QueryClientProvider>
  );
}
