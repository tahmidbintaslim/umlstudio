import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DIAGRAM_PAGES } from "@/lib/diagram-pages";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Free diagram makers: UML, ER, flowchart, AWS & more · UML Studio",
  description: "Free online makers for sequence, class, ER, flowchart, C4, AWS, Azure, GCP, Kubernetes and Graphviz diagrams, with AI that draws from text or a photo.",
  alternates: { canonical: "/diagrams" },
};

export default function DiagramsIndex() {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-4xl font-semibold tracking-tight">Every diagram you need, free</h1>
        <p className="mt-3 max-w-2xl text-lg text-fg/70">Pick a diagram type to start from a ready-made template. Edit the code, sketch on the whiteboard, or let AI draw it for you.</p>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DIAGRAM_PAGES.map((d) => (
            <li key={d.slug}>
              <Link href={`/diagrams/${d.slug}`} className="group flex h-full flex-col rounded-2xl border border-line p-5 hover:border-accent/50">
                <span className="flex items-center justify-between font-semibold">{d.title}<ArrowRight size={16} className="text-fg/30 group-hover:text-accent" /></span>
                <span className="mt-2 line-clamp-2 text-sm text-fg/60">{d.intro}</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </div>
  );
}
