"use client";

import { useEffect, useState } from "react";
import { encodeUml } from "@/lib/plantuml";
import { DiagramThumb } from "./diagram-thumb";

type Item = { id: string; title: string; source: string };

export function GalleryGrid() {
  const [items, setItems] = useState<Item[] | null>(null);
  useEffect(() => { fetch("/api/gallery").then((r) => r.json()).then(setItems).catch(() => setItems([])); }, []);

  if (items === null) return <p className="mt-10 text-fg/60">Loading…</p>;
  if (!items.length) return <p className="mt-10 text-fg/60">Nothing here yet. Save a diagram, then press Publish in “My diagrams” to share it.</p>;
  return (
    <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((d) => (
        <li key={d.id}>
          {/* Opens a copy in the editor; the share-link format carries the whole source. */}
          <a href={`/app#${encodeUml(d.source)}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line hover:border-accent/50">
            <div className="h-48 bg-white p-3"><DiagramThumb source={d.source} alt={d.title} /></div>
            <span className="border-t border-line px-4 py-3 text-sm font-medium group-hover:text-accent">{d.title}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
