import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function raf<A extends any[]>(cb: (...args: A) => any) {
  let frame: number | null = null;
  return (...args: A) => {
    if (frame !== null) {
      cancelAnimationFrame(frame);
    }
    frame = requestAnimationFrame(() => {
      cb(...args);
      frame = null;
    });
  };
}

export function toSearchPattern(str: string) {
  const pattern = str
    .trim()
    .replace(/[|\\{}()[\]^$+?.]/g, "\\$&")
    .replace(/-/g, "\\x2d")
    .replace(/\*/g, ".*");
  return new RegExp(`^${pattern}$`, "i");
}
