import { lazy, Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/config";
import { ProjectProvider, ThemeSync, Landing, Spinner } from "@/components";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeSync />
      <ProjectProvider fallback={<Landing />}>
        <Suspense
          fallback={
            <div className="flex h-screen items-center justify-center">
              <Spinner className="size-10 text-primary" />
            </div>
          }
        >
          <Editor />
        </Suspense>
      </ProjectProvider>
    </QueryClientProvider>
  );
}

const Editor = lazy(() =>
  import("@/components/features/editor").then(m => ({ default: m.Editor }))
);
