import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { DIAGRAM_PAGES } from "@/lib/diagram-pages";
import { EXAMPLES } from "@/lib/examples";
import { encodeUml, renderUrl } from "@/lib/plantuml";
import { detectLang } from "@/lib/lang";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const generateStaticParams = () => DIAGRAM_PAGES.map((d) => ({ slug: d.slug }));

const find = (slug: string) => {
  const page = DIAGRAM_PAGES.find((d) => d.slug === slug);
  const example = page && EXAMPLES.find((e) => e.name === page.template);
  return page && example ? { page, example } : null;
};

export async function generateMetadata({ params }: PageProps<"/diagrams/[slug]">): Promise<Metadata> {
  const hit = find((await params).slug);
  if (!hit) return {};
  const title = `Free ${hit.page.title} Online · UML Studio`;
  return { title, description: hit.page.intro, alternates: { canonical: `/diagrams/${hit.page.slug}` }, openGraph: { title, description: hit.page.intro } };
}

export default async function DiagramPage({ params }: PageProps<"/diagrams/[slug]">) {
  const hit = find((await params).slug);
  if (!hit) notFound();
  const { page, example } = hit;
  const isPlantUml = detectLang(example.source) === "plantuml";
  const editorUrl = `/app#${encodeUml(example.source)}`;
  const others = DIAGRAM_PAGES.filter((d) => d.slug !== page.slug).slice(0, 8);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-16">
        <nav aria-label="Breadcrumb" className="text-sm text-fg/50">
          <Link href="/diagrams" className="hover:text-fg">Diagram types</Link> / <span>{page.title}</span>
        </nav>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Free {page.title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-fg/70">{page.intro}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href={editorUrl} className="flex h-11 items-center justify-center gap-2 rounded-lg bg-accent px-6 font-medium text-white hover:bg-accent/90">
            Open this template <ArrowRight size={16} />
          </Link>
          <Link href="/app?ai=1" className="flex h-11 items-center justify-center gap-2 rounded-lg border border-line px-6 font-medium hover:bg-muted">
            <Sparkles size={16} className="text-accent" /> Describe it to AI instead
          </Link>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <section aria-label="Template source">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-fg/50">{isPlantUml ? "PlantUML" : "Mermaid"} source</h2>
            <pre className="max-h-[480px] overflow-auto rounded-2xl border border-line bg-muted/40 p-4 font-mono text-xs leading-relaxed">{example.source}</pre>
          </section>
          {isPlantUml && (
            <section aria-label="Rendered diagram">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-fg/50">Result</h2>
              <div className="overflow-auto rounded-2xl border border-line bg-white p-4">
                {/* eslint-disable-next-line @next/next/no-img-element -- external renderer, SVG of unknown size */}
                <img src={renderUrl(example.source, "svg")} alt={`Example ${page.title.toLowerCase()} rendered from the template`} loading="lazy" className="mx-auto max-w-full" />
              </div>
            </section>
          )}
        </div>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold tracking-tight">Great for</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {page.uses.map((u) => (
              <li key={u} className="flex items-center gap-2 text-fg/80"><Check size={16} className="text-accent" />{u}</li>
            ))}
          </ul>
          <p className="mt-6 max-w-2xl text-fg/70">
            Export to SVG or PNG, share with a link, save to your free account, or open it on the whiteboard and rearrange it by hand.
            UML Studio is free and open source.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold tracking-tight">More diagram makers</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {others.map((d) => (
              <Link key={d.slug} href={`/diagrams/${d.slug}`} className="rounded-full border border-line px-3 py-1.5 text-sm hover:border-accent/50">{d.title}</Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
