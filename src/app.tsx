import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/config";
import { Layout, ThemeSync } from "@/components";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeSync />
      <Layout />
    </QueryClientProvider>
  );
}
