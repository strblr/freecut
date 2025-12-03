import { useRef } from "react";
import { flushSync } from "react-dom";
import type { ImperativePanelGroupHandle } from "react-resizable-panels";
import {
  Card,
  Header,
  InfoView,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Sidebar
} from "@/components";
import { useEventCallback } from "@/hooks";
import { useStore } from "@/config";

export function Layout() {
  const showInfoView = useStore(store => store.showInfoView);
  const mainLayoutRef = useRef<ImperativePanelGroupHandle>(null);
  const topLayoutRef = useRef<ImperativePanelGroupHandle>(null);
  const bottomLayoutRef = useRef<ImperativePanelGroupHandle>(null);

  const handleLayoutReset = useEventCallback(() => {
    flushSync(() => useStore.getState().toggleShowInfoView(true));
    mainLayoutRef.current?.setLayout([65, 35]);
    topLayoutRef.current?.setLayout([24, 52, 24]);
    bottomLayoutRef.current?.setLayout([15, 85]);
  });

  return (
    <>
      <Header onLayoutReset={handleLayoutReset} />
      <Card className="overflow-hidden p-0">
        <ResizablePanelGroup
          ref={mainLayoutRef}
          direction="vertical"
          autoSaveId="layout-main"
        >
          <ResizablePanel>
            <ResizablePanelGroup
              ref={topLayoutRef}
              direction="horizontal"
              autoSaveId="layout-top"
            >
              <ResizablePanel
                id="top-left"
                order={1}
                defaultSize={24}
                minSize={18}
                maxSize={60}
              >
                <Sidebar />
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel
                id="top-center"
                order={2}
                className="min-w-xs"
              ></ResizablePanel>
              <ResizableHandle />
              <ResizablePanel
                id="top-right"
                order={3}
                defaultSize={24}
                minSize={18}
                maxSize={60}
              ></ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={35} minSize={20} maxSize={70}>
            <ResizablePanelGroup
              ref={bottomLayoutRef}
              direction="horizontal"
              autoSaveId="layout-bottom"
            >
              {showInfoView && (
                <>
                  <ResizablePanel
                    id="bottom-left"
                    order={1}
                    defaultSize={15}
                    minSize={10}
                    maxSize={40}
                  >
                    <InfoView />
                  </ResizablePanel>
                  <ResizableHandle />
                </>
              )}
              <ResizablePanel id="bottom-right" order={2}></ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Card>
    </>
  );
}
