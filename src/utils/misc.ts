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
