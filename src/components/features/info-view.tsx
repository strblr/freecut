import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import hash from "@emotion/hash";
import { XIcon } from "lucide-react";
import { throttle } from "lodash-es";
import { Button } from "@/components";
import { useStore } from "@/config";
import { raf } from "@/utils";

interface InfoData {
  title: string;
  description: string;
}

const infoMap = new Map<string, InfoData>();

export function i(title: string, description: string) {
  const key = hash(`${title}-${description}`);
  if (!infoMap.has(key)) {
    infoMap.set(key, { title, description });
  }
  return key;
}

export function InfoView() {
  const [data, setData] = useState<InfoData | null>(null);

  const handleClose = () => {
    useStore.getState().toggleShowInfoView(false);
  };

  useEffect(() => {
    const listener = throttle(
      raf((event: PointerEvent) => {
        const element = (event.target as Element).closest("[data-info]");
        const key = element?.getAttribute("data-info");
        const data = key && infoMap.get(key);
        setData(data || null);
      }),
      200
    );
    document.addEventListener("pointermove", listener);
    return () => {
      listener.cancel();
      document.removeEventListener("pointermove", listener);
    };
  }, []);

  return (
    <div
      className="h-full"
      data-info={i(
        "Info view",
        "The info view is a feature that displays a short description of the feature that is currently being hovered over. It is a useful tool to find your way around the app."
      )}
    >
      <h1 className="flex h-7 items-center justify-between bg-muted px-2 py-1 font-bold">
        <span className="truncate">{data?.title}</span>
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
