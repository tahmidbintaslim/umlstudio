"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Sends one page view per route change to our own /api/track (free, first-party analytics).
export function Track() {
  const path = usePathname();
  useEffect(() => {
    const body = JSON.stringify({ path, ref: document.referrer });
    if (!navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" })))
      fetch("/api/track", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(() => {});
  }, [path]);
  return null;
}
