import type { MetadataRoute } from "next";
import { DIAGRAM_PAGES } from "@/lib/diagram-pages";

const BASE = "https://umlstudio.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/app`, priority: 0.9 },
    { url: `${BASE}/board`, priority: 0.8 },
    { url: `${BASE}/diagrams`, priority: 0.8 },
    { url: `${BASE}/gallery`, priority: 0.6 },
    ...DIAGRAM_PAGES.map((d) => ({ url: `${BASE}/diagrams/${d.slug}`, priority: 0.7 })),
  ];
}
