"use client";

import { useEffect, useState } from "react";
import { detectLang } from "@/lib/lang";
import { renderUrl } from "@/lib/plantuml";
import { renderKroki } from "@/lib/kroki";

// Lazy preview of any code diagram, always shown through <img> (no inline SVG = no script injection).
export function DiagramThumb({ source, alt }: { source: string; alt: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let live = true, blob: string | undefined;
    const lang = detectLang(source);
    (async () => {
      if (lang === "plantuml") return setUrl(renderUrl(source, "svg"));
      const svg = lang === "mermaid" ? await (await import("@/lib/mermaid")).renderMermaid(source) : await renderKroki(lang, source);
      blob = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
      if (live) setUrl(blob);
    })().catch(() => {});
    return () => { live = false; if (blob) URL.revokeObjectURL(blob); };
  }, [source]);
  return url
    // eslint-disable-next-line @next/next/no-img-element
    ? <img src={url} alt={alt} loading="lazy" className="h-full w-full object-contain" />
    : <div className="h-full w-full animate-pulse bg-muted" />;
}
