import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "./logo";
import { GithubStar } from "./github-star";
import { NavAuth } from "./nav-auth";

const REPO = "https://github.com/tahmidbintaslim/umlstudio";

// Shared header/footer for marketing pages (landing, diagram-type pages).
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-bg/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <Link href="/" aria-label="UML Studio home"><Logo /></Link>
        <div className="hidden items-center gap-5 text-sm text-fg/70 md:flex">
          <Link href="/diagrams" className="hover:text-fg">Diagram types</Link>
          <Link href="/board" className="hover:text-fg">Whiteboard</Link>
          <Link href="/#compare" className="hover:text-fg">Compare</Link>
          <a href={REPO} className="hover:text-fg">GitHub</a>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <GithubStar />
          <NavAuth />
          <Link href="/app" className="flex h-9 items-center gap-1.5 rounded-md bg-accent px-4 text-sm font-medium text-white hover:bg-accent/90">
            Open editor <ArrowRight size={14} />
          </Link>
        </div>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-fg/60 sm:flex-row">
        <Logo />
        <div className="flex flex-wrap justify-center gap-5">
          <Link href="/app" className="hover:text-fg">Editor</Link>
          <Link href="/board" className="hover:text-fg">Whiteboard</Link>
          <Link href="/diagrams" className="hover:text-fg">Diagram types</Link>
          <a href={REPO} className="hover:text-fg">GitHub</a>
          <a href={`${REPO}/issues/new/choose`} className="hover:text-fg">Feedback</a>
        </div>
        <p>MIT licensed · © 2026 Tahmid Bin Taslim Rafi</p>
      </div>
    </footer>
  );
}
