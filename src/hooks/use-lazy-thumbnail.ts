import { useEffect, useRef, useState } from "react";

export function useLazyThumbnail(file: File, size = 32) {
  const ref = useRef<any>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    let visible = false;
    let active = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || visible || !active) return;
        visible = true;
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = async () => {
          try {
            const canvas = new OffscreenCanvas(size, size);
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const scale = Math.min(size / img.width, size / img.height);
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;

            const x = (size - scaledWidth) / 2;
            const y = (size - scaledHeight) / 2;

            ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
            const blob = await canvas.convertToBlob({
              type: "image/jpeg",
              quality: 0.8
            });
            if (!active) return;
            const thumbnail = URL.createObjectURL(blob);
            setThumbnail(thumbnail);
          } finally {
            URL.revokeObjectURL(url);
          }
        };

        img.onerror = () => {
          URL.revokeObjectURL(url);
        };

        img.src = url;
      },
      { threshold: 0.1 }
    );

    observer.observe(ref.current);
    return () => {
      active = false;
      observer.disconnect();
    };
  }, [size]);

  useEffect(
    () => () => {
      thumbnail && URL.revokeObjectURL(thumbnail);
    },
    [thumbnail]
  );

  return [ref, thumbnail] as const;
}
