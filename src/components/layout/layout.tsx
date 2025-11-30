import { useRef } from "react";
import type { ImperativePanelGroupHandle } from "react-resizable-panels";
import {
  Card,
  Header,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components";
import { useEventCallback } from "@/hooks";

export function Layout() {
  const mainLayoutRef = useRef<ImperativePanelGroupHandle>(null);
  const topLayoutRef = useRef<ImperativePanelGroupHandle>(null);
  const bottomLayoutRef = useRef<ImperativePanelGroupHandle>(null);

  const handleLayoutReset = useEventCallback(() => {
    mainLayoutRef.current?.setLayout([65, 35]);
    topLayoutRef.current?.setLayout([18, 58, 24]);
    bottomLayoutRef.current?.setLayout([18, 82]);
  });

  return (
    <>
      <Header onLayoutReset={handleLayoutReset} />
      <ResizablePanelGroup
        ref={mainLayoutRef}
        className="gap-1"
        direction="vertical"
        autoSaveId="layout-main"
      >
        <ResizablePanel>
          <ResizablePanelGroup
            ref={topLayoutRef}
            className="gap-1"
            direction="horizontal"
            autoSaveId="layout-top"
          >
            <ResizablePanel
              order={1}
              defaultSize={18}
              minSize={18}
              maxSize={60}
            >
              <Card className="h-full"></Card>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel order={2} className="min-w-xs">
              <Card className="h-full"></Card>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel
              order={3}
              defaultSize={24}
              minSize={18}
              maxSize={60}
            >
              <Card className="h-full"></Card>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={35} minSize={20} maxSize={70}>
          <ResizablePanelGroup
            ref={bottomLayoutRef}
            className="gap-1"
            direction="horizontal"
            autoSaveId="layout-bottom"
          >
            <ResizablePanel
              order={1}
              defaultSize={18}
              minSize={12}
              maxSize={40}
            >
              <Card className="h-full"></Card>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel order={2}>
              <Card className="h-full"></Card>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
