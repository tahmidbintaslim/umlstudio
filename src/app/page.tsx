import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, Camera, Check, CloudCog, Code2, Download, FolderOpen, GraduationCap, Link2, Minus,
  PenTool, Sparkles, Terminal, Users, Wand2, Workflow,
} from "lucide-react";
import { LegacyHashRedirect } from "@/components/legacy-hash-redirect";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

const REPO = "https://github.com/tahmidbintaslim/umlstudio";

const WAYS = [
  { icon: Code2, title: "Write code", body: "PlantUML, Mermaid, Graphviz, D2 or BPMN with live preview and 27 templates. Diagrams live in text, so they diff, review and version like code." },
  { icon: PenTool, title: "Sketch freely", body: "A hand-drawn style whiteboard for brainstorming and system design. Turn any Mermaid diagram into shapes you can drag around." },
  { icon: Sparkles, title: "Describe it", body: "“ER diagram for a food-delivery app with restaurants, orders and riders.” Get a clean, editable diagram in seconds." },
  { icon: Camera, title: "Snap a photo", body: "Whiteboard after a lecture, a hand sketch, or a screenshot of an old diagram. AI redraws it as a crisp diagram you can edit." },
];

const FEATURES = [
  { icon: Workflow, title: "25+ diagram types", body: "Sequence, class, activity, use case, state, component, ER, flowchart, mind map, Gantt, Git graph, timeline…" },
  { icon: CloudCog, title: "Cloud architecture", body: "Official AWS, Azure, GCP and Kubernetes icons, plus C4 models for system design." },
  { icon: Wand2, title: "Fix with AI", body: "Syntax error? One click and AI repairs the code with minimal changes." },
  { icon: Download, title: "Export anywhere", body: "SVG, PNG, ASCII art and source files for reports, slides, READMEs and Notion." },
  { icon: Link2, title: "Share by link", body: "The whole diagram lives in the URL. No account needed to view." },
  { icon: FolderOpen, title: "Cloud library", body: "Sign in to save every diagram and pick up on any device." },

  { icon: Terminal, title: "Open source, self-hostable", body: "MIT licensed. Run it with your own PlantUML server for private diagrams." },
];

// Honest category comparison (whiteboards: Excalidraw, Miro, FigJam; drag-and-drop: draw.io, Lucidchart, Visio;
// code: Mermaid Live, PlantText, Eraser). Per-product features change often, so no brand-by-brand checkmarks.
const COMPARE: [string, string, string, string, string][] = [
  ["Freehand whiteboard sketching", "yes", "some", "no", "yes"],
  ["Diagrams as code (diff, review, version)", "no", "no", "yes", "yes"],
  ["PlantUML and Mermaid in one place", "no", "import only", "one only", "yes"],
  ["Code ⇄ editable canvas", "no", "no", "rare", "yes"],
  ["AWS / Azure / GCP / C4 icons", "some", "yes", "some", "yes"],
  ["AI: text → diagram", "often paid", "often paid", "often paid", "free"],
  ["AI: photo or sketch → diagram", "rare", "rare", "rare", "free"],
  ["Free and open source", "some", "some", "some", "yes"],
];

const AUDIENCE = [
  { icon: GraduationCap, title: "Students", body: "UML for coursework, ER diagrams for databases class, and a photo of the lecture whiteboard turned into clean notes." },
  { icon: Code2, title: "Developers", body: "Architecture, sequence flows and schemas next to your code. Paste the Mermaid straight into GitHub READMEs." },
  { icon: Users, title: "Teams & tech writers", body: "Share links in PRs and docs. Everyone sees the same diagram, nobody needs a seat license." },
];

export default function Landing() {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <LegacyHashRedirect />

      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" aria-hidden />
          <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 text-center sm:pt-28">
            <a href={REPO} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-bg px-3 py-1 text-xs text-fg/70 hover:text-fg">
              <span className="rounded-full bg-accent/15 px-2 py-0.5 font-medium text-accent">New</span>
              AI turns photos & text into diagrams
            </a>
            <h1 className="mx-auto max-w-4xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
              Technical diagrams at the{" "}
              <span className="text-accent">speed of thought</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-fg/70">
              Write PlantUML or Mermaid, describe what you need in plain English, or snap a photo of a whiteboard.
              UML Studio turns it into a clean, editable diagram. Free for students and developers.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/app" className="flex h-11 items-center gap-2 rounded-lg bg-accent px-6 font-medium text-white shadow-lg shadow-accent/25 hover:bg-accent/90">
                Start drawing, it&apos;s free <ArrowRight size={16} />
              </Link>
              <Link href="/app?ai=1" className="flex h-11 items-center gap-2 rounded-lg border border-line bg-bg px-6 font-medium hover:bg-muted">
                <Sparkles size={16} className="text-accent" /> Try the AI
              </Link>
            </div>
            <p className="mt-3 text-sm text-fg/50">No sign-up needed to start. Sign in to use AI and save diagrams.</p>

            <div className="mx-auto mt-14 max-w-5xl overflow-hidden rounded-2xl border border-line shadow-2xl shadow-black/10">
              <Image src="/screenshot-dark.png" alt="UML Studio editor with PlantUML code next to a rendered sequence diagram" width={2880} height={1640} priority className="hidden dark:block" />
              <Image src="/screenshot-light.png" alt="UML Studio editor with PlantUML code next to a rendered sequence diagram" width={2880} height={1640} priority className="dark:hidden" />
            </div>
          </div>
        </section>

        {/* Three ways in */}
        <section className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="text-center text-3xl font-semibold tracking-tight">Four ways to a diagram</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-fg/60">Start however you think. Everything ends up as editable code.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WAYS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-line p-6">
                <span className="grid size-10 place-items-center rounded-xl bg-accent/10 text-accent"><Icon size={20} /></span>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg/70">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-y border-line bg-muted/40">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <h2 className="text-3xl font-semibold tracking-tight">Everything you need, nothing you don&apos;t</h2>
            <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map(({ icon: Icon, title, body }) => (
                <div key={title}>
                  <Icon size={20} className="text-accent" />
                  <h3 className="mt-3 font-semibold">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-fg/70">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Audience */}
        <section className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="text-3xl font-semibold tracking-tight">Built for people who draw a lot of boxes and arrows</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {AUDIENCE.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-line p-6">
                <Icon size={20} className="text-accent" />
                <h3 className="mt-3 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg/70">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Compare */}
        <section id="compare" className="border-y border-line bg-muted/40">
          <div className="mx-auto max-w-5xl px-4 py-20">
            <h2 className="text-center text-3xl font-semibold tracking-tight">One tool instead of five tabs</h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-fg/60">
              Whiteboards are great for sketching, drag-and-drop tools for polished charts, code editors for versioned docs.
              UML Studio does all three, with AI, in one free and open-source place.
            </p>
            <div className="mt-10 overflow-x-auto rounded-2xl border border-line bg-bg">
              <table className="w-full min-w-[680px] text-sm">
                <thead>
                  <tr className="border-b border-line text-left">
                    <th className="p-4 font-medium text-fg/60" scope="col"><span className="sr-only">Feature</span></th>
                    <th className="p-4 font-medium text-fg/60" scope="col">Whiteboards</th>
                    <th className="p-4 font-medium text-fg/60" scope="col">Drag-and-drop tools</th>
                    <th className="p-4 font-medium text-fg/60" scope="col">Diagram-as-code</th>
                    <th className="p-4 font-semibold text-accent" scope="col">UML Studio</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map(([row, ...cells]) => (
                    <tr key={row} className="border-b border-line last:border-0">
                      <th scope="row" className="p-4 text-left font-normal">{row}</th>
                      {cells.map((c, i) => (
                        <td key={i} className="p-4">
                          {c === "yes" ? <Check size={18} className={i === 3 ? "text-accent" : "text-fg/50"} aria-label="Yes" />
                            : c === "no" ? <Minus size={18} className="text-fg/30" aria-label="No" />
                            : <span className="text-fg/60">{c}</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 py-24 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Your next diagram is one sentence away</h2>
          <p className="mx-auto mt-3 max-w-xl text-fg/60">Free and open source, built in public. If it saves you time, a GitHub star helps other students and developers find it.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/app" className="flex h-11 items-center gap-2 rounded-lg bg-accent px-6 font-medium text-white hover:bg-accent/90">
              Open the editor <ArrowRight size={16} />
            </Link>
            <a href={REPO} className="flex h-11 items-center gap-2 rounded-lg border border-line px-6 font-medium hover:bg-muted">Star on GitHub</a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
