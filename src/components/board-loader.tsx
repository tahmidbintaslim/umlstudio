"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Excalidraw touches window at import time, so it only loads in the browser.
const Whiteboard = dynamic(() => import("./whiteboard"), {
  ssr: false,
  loading: () => <div className="grid h-dvh place-items-center"><Loader2 className="animate-spin text-fg/40" /></div>,
});

export function BoardLoader() {
  return <Whiteboard />;
}
