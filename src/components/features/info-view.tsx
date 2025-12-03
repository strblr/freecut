import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { XIcon } from "lucide-react";
import { throttle } from "lodash-es";
import { Button } from "@/components";
import { useStore } from "@/config";
import { raf } from "@/utils";

interface InfoData {
  title: string;
  description: string;
}

const infoMap = new WeakMap<object, InfoData>();

export function info<E extends Element>(title: string, description: string) {
  return (node: E | null) => {
    node && infoMap.set(node, { title, description });
  };
}

export function InfoView() {
  const [data, setData] = useState<InfoData | null>(null);

  const handleClose = () => {
    useStore.getState().toggleShowInfoView(false);
  };

  useEffect(() => {
    const listener = throttle(
      raf((event: PointerEvent) => {
        for (
          let node = event.target as Element | null;
          node;
          node = node.parentElement
        ) {
          const data = infoMap.get(node);
          if (data) {
            setData(data);
            return;
          }
        }
        setData(null);
      }),
      200
    );
    document.addEventListener("pointermove", listener);
    return () => {
      document.removeEventListener("pointermove", listener);
    };
  }, []);

  return (
    <div
      className="h-full"
      ref={info(
        "Info view",
        "The info view is a feature that displays a short description of the feature that is currently being hovered over. It is a useful tool to find your way around the app."
      )}
    >
      <h1 className="flex min-h-7 items-center justify-between bg-muted px-2 py-1 font-bold">
        <span>{data?.title}</span>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleClose}
          aria-label="Close info view"
        >
          <XIcon className="size-3" />
        </Button>
      </h1>
      <div className="px-2 py-1 text-xs text-muted-foreground">
        <Markdown>{data?.description}</Markdown>
      </div>
    </div>
  );
}
