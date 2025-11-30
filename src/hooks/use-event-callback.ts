import { useLayoutEffect, useRef } from "react";

export function useEventCallback<A extends any[], R extends any>(
  fn: (...args: A) => R
) {
  const ref = useRef(fn);
  useLayoutEffect(() => {
    ref.current = fn;
  }, [fn]);
  return useRef((...args: A) => ref.current(...args)).current;
}
