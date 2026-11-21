import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { GalleryGrid } from "@/components/gallery-grid";

export const metadata: Metadata = {
  title: "Community diagram gallery · UML Studio",
  description: "Diagrams shared by the UML Studio community: UML, architecture, ER, flowcharts and more. Open any one as a template.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-4xl font-semibold tracking-tight">Community gallery</h1>
        <p className="mt-3 max-w-2xl text-lg text-fg/70">Diagrams shared by other students and developers. Click one to open a copy in the editor.</p>
        <GalleryGrid />
      </main>
      <SiteFooter />
    </div>
  );
}
