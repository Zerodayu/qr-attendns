import { useEffect } from "react";

export function usePolling(callback: () => void, intervalMs: number) {
  useEffect(() => {
    if (intervalMs <= 0) {
      return;
    }
    const id = setInterval(callback, intervalMs);
    return () => clearInterval(id);
  }, [callback, intervalMs]);
}
