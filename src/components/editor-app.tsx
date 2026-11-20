"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CodeMirror from "@uiw/react-codemirror";
import { Group, Panel, Separator } from "react-resizable-panels";
import { useTheme } from "next-themes";
import { useAuth, Show, SignInButton, UserButton } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  Check, ChevronDown, Cloud, Download, FolderOpen, Link2, Loader2, Maximize, Moon,
  PenTool, Sparkles, Sun, Trash2, TriangleAlert, Wand2, ZoomIn, ZoomOut,
} from "lucide-react";
import { plantuml } from "@/lib/plantuml-lang";
import { EXAMPLES } from "@/lib/examples";
import { decodeUml, encodeUml, renderUrl, type Format } from "@/lib/plantuml";
import { detectKind, detectLang } from "@/lib/lang";
import { renderMermaid, svgToPng } from "@/lib/mermaid";
import { GithubStar } from "./github-star";
import { LogoMark } from "./logo";
import { AiPanel, askAi } from "./ai-panel";

const DRAFT_KEY = "umlstudio:draft";
const isCloud = (src: string) => src.includes("!include <");
const isDot = (src: string) => src.startsWith("@startdot");
const TEMPLATE_GROUPS: [string, (src: string) => boolean][] = [
  ["UML (PlantUML)", (src) => detectLang(src) === "plantuml" && !isCloud(src) && !isDot(src)],
  ["Cloud & architecture", isCloud],
  ["Graphviz", isDot],
  ["Mermaid", (src) => detectLang(src) === "mermaid"],
];
type Saved = { id: string; title: string; source: string; updated_at: string };

export function EditorApp() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [source, setSource] = useState<string | null>(null);
  const [title, setTitle] = useState("Untitled");
  const [cloudId, setCloudId] = useState<string | null>(null);
  const [format, setFormat] = useState<Format>("svg");
  // svg: Mermaid output kept for export; message: renderer error passed to "Fix with AI".
  const [preview, setPreview] = useState<{ url?: string; text?: string; svg?: string; error: boolean; message?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [saving, setSaving] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [fixing, setFixing] = useState(false);
  const lang = detectLang(source ?? "");
  const vertical = useMediaQuery("(max-width: 768px)");
  const viewport = useRef<HTMLDivElement>(null);
  const fitted = useRef(false);

  // Load: share link (#encoded) > local draft > first example. Browser-only sources, so this runs on mount.
  useEffect(() => {
    if (new URLSearchParams(location.search).has("ai")) setAiOpen(true); // deep link from the landing page
    const hash = location.hash.slice(1);
    if (hash) {
      try { setSource(decodeUml(hash)); return; } catch { toast.error("Share link is invalid"); }
    }
    try {
      const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      if (d?.source) { setSource(d.source); setTitle(d.title || "Untitled"); setCloudId(d.cloudId ?? null); return; }
    } catch {}
    setSource(EXAMPLES[0].source);
    setTitle("User Authentication");
  }, []);

  // Autosave draft locally.
  useEffect(() => {
    if (source === null) return;
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ source, title, cloudId })); } catch {}
  }, [source, title, cloudId]);

  // Debounced render. Fetch (not <img src>) so we can detect errors and reuse the blob for download.
  useEffect(() => {
    if (source === null) return;
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        if (lang === "mermaid") {
          try {
            const svg = await renderMermaid(source);
            if (ctrl.signal.aborted) return;
            const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
            setPreview((p) => { if (p?.url) URL.revokeObjectURL(p.url); return { url, svg, error: false }; });
          } catch (e) {
            // Keep the last good render visible while the user is mid-edit.
            if (!ctrl.signal.aborted) setPreview((p) => ({ ...p, error: true, message: (e as Error).message }));
          }
          return;
        }
        const res = await fetch(renderUrl(source, format), { signal: ctrl.signal });
        const error = !res.ok;
        if (format === "txt") setPreview({ text: await res.text(), error });
        else {
          const url = URL.createObjectURL(await res.blob());
          setPreview((p) => { if (p?.url) URL.revokeObjectURL(p.url); return { url, error }; });
        }
      } catch (e) {
        if ((e as Error).name !== "AbortError") setPreview({ error: true, text: "Could not reach the PlantUML server." });
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, 350);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [source, format, lang]);

  const fit = useCallback(() => {
    const el = viewport.current;
    if (!el || !natural.w) return;
    setZoom(Math.min(1, (el.clientWidth - 48) / natural.w, (el.clientHeight - 88) / natural.h));
  }, [natural]);

  const download = async (kind: Format | "source") => {
    if (source === null) return;
    const name = (title || "diagram").replace(/[^\w-]+/g, "_");
    const ext = kind === "source" ? (lang === "mermaid" ? "mmd" : "puml") : kind;
    const blob = kind === "source" ? new Blob([source], { type: "text/plain" })
      : lang === "mermaid"
        ? (preview?.svg ? (kind === "png" ? await svgToPng(preview.svg) : new Blob([preview.svg], { type: "image/svg+xml" })) : null)
        : await fetch(renderUrl(source, kind)).then((r) => r.blob()).catch(() => null);
    if (!blob) return toast.error("Download failed");
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob), download: `${name}.${ext}`,
    });
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const share = async () => {
    if (source === null) return;
    const url = `${location.origin}/app#${encodeUml(source)}`;
    history.replaceState(null, "", url);
    await navigator.clipboard.writeText(url);
    toast.success("Share link copied");
  };

  const save = useCallback(async () => {
    if (source === null) return;
    if (!isSignedIn) return toast("Sign in to save diagrams to the cloud", { description: "Your draft is kept locally meanwhile." });
    setSaving(true);
    try {
      const res = await fetch(cloudId ? `/api/diagrams/${cloudId}` : "/api/diagrams", {
        method: cloudId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, source }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Save failed");
      setCloudId(data.id);
      toast.success("Saved");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  }, [source, title, cloudId, isSignedIn]);

  // Cmd/Ctrl+S saves.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); save(); }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [save]);

  const loadDiagram = (src: string, name: string, id: string | null) => {
    setSource(src); setTitle(name); setCloudId(id);
    history.replaceState(null, "", "/app");
  };

  // Replace the source with AI output, offering one-click undo since this bypasses editor history.
  const applyAi = (code: string) => {
    const prev = source;
    setSource(code);
    fitted.current = false;
    toast.success("Diagram updated by AI", { action: { label: "Undo", onClick: () => setSource(prev) } });
  };

  // Hand Mermaid to /board, which converts it to editable shapes. PlantUML is first translated by AI.
  const [toBoard, setToBoard] = useState(false);
  const openInWhiteboard = async () => {
    let code = source ?? "";
    if (lang === "plantuml") {
      if (!isSignedIn) return setAiOpen(true);
      setToBoard(true);
      try {
        code = await askAi({ mode: "edit", lang: "mermaid", source: code,
          prompt: "Convert this PlantUML diagram to the equivalent Mermaid diagram. Prefer flowchart, sequenceDiagram or classDiagram so it can become editable shapes. Return only Mermaid." });
      } catch (e) { setToBoard(false); return void toast.error((e as Error).message); }
    }
    try { sessionStorage.setItem("umlstudio:to-board", code); } catch {}
    router.push("/board?from=code");
  };

  const fixWithAi = async () => {
    if (!isSignedIn) return setAiOpen(true);
    setFixing(true);
    try { applyAi(await askAi({ mode: "fix", lang, source: source ?? "", error: preview?.message })); }
    catch (e) { toast.error((e as Error).message); }
    finally { setFixing(false); }
  };

  const dark = resolvedTheme === "dark";

  return (
    <div className="flex h-dvh flex-col bg-bg text-fg">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-line px-3 sm:px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight" aria-label="UML Studio home">
          <LogoMark />
          <span className="hidden sm:inline">UML Studio</span>
        </Link>
        <span className="mx-1 hidden h-5 w-px bg-line sm:block" />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Diagram title"
          className="hidden w-48 min-w-0 rounded-md sm:block bg-transparent px-2 py-1 text-sm outline-none hover:bg-muted focus:bg-muted focus:ring-2 focus:ring-accent/40 "
        />
        <Menu label="Templates">
          {TEMPLATE_GROUPS.map(([label, match]) => (
            <div key={label}>
              <p className="px-3 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wide text-fg/40">{label}</p>
              {EXAMPLES.filter((ex) => match(ex.source)).map((ex) => (
                <MenuItem key={ex.name} onClick={() => loadDiagram(ex.source, ex.name, null)}>{ex.name}</MenuItem>
              ))}
            </div>
          ))}
        </Menu>
        <button onClick={() => setAiOpen(true)}
          className="flex h-8 items-center gap-1.5 rounded-md border border-accent/30 bg-accent/10 px-3 text-sm font-medium text-accent hover:bg-accent/20">
          <Sparkles size={14} /> <span className="hidden sm:inline">AI</span>
        </button>
        <Link href="/board" className="hidden h-8 items-center gap-1.5 rounded-md px-2 text-sm text-fg/80 hover:bg-muted hover:text-fg md:flex">
          <PenTool size={14} /> Whiteboard
        </Link>

        <div className="ml-auto flex items-center gap-1">
          <IconBtn label="Copy share link" onClick={share}><Link2 size={16} /></IconBtn>
          <Menu label={<Download size={16} />} ariaLabel="Download" align="right">
            <MenuItem onClick={() => download("svg")}>SVG image</MenuItem>
            <MenuItem onClick={() => download("png")}>PNG image</MenuItem>
            {lang === "plantuml" && <MenuItem onClick={() => download("txt")}>ASCII art</MenuItem>}
            <MenuItem onClick={() => download("source")}>{lang === "mermaid" ? "Mermaid source (.mmd)" : "PlantUML source (.puml)"}</MenuItem>
          </Menu>
          <Show when="signed-in">
            <IconBtn label="My diagrams" onClick={() => setLibraryOpen(true)}><FolderOpen size={16} /></IconBtn>
          </Show>
          <button
            onClick={save}
            className="flex h-8 items-center gap-1.5 rounded-md bg-accent px-3 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-60"
            disabled={saving}
            title="Save (Ctrl/⌘+S)"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Cloud size={14} />}
            <span className="hidden sm:inline">Save</span>
          </button>
          <GithubStar />
          <IconBtn label="Toggle theme" onClick={() => setTheme(dark ? "light" : "dark")}>
            <Sun size={16} className="hidden dark:block" /><Moon size={16} className="dark:hidden" />
          </IconBtn>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="h-8 whitespace-nowrap rounded-md border border-line px-3 text-sm hover:bg-muted">Sign in</button>
            </SignInButton>
          </Show>
          <Show when="signed-in"><UserButton /></Show>
        </div>
      </header>

      {/* Workspace */}
      <Group orientation={vertical ? "vertical" : "horizontal"} className="min-h-0 flex-1">
        <Panel defaultSize="45" minSize="20" className="min-h-0">
          {source !== null && (
            <CodeMirror
              value={source}
              onChange={setSource}
              extensions={lang === "plantuml" ? [plantuml] : []}
              theme={dark ? "dark" : "light"}
              height="100%"
              className="h-full text-[13px]"
              basicSetup={{ highlightActiveLine: true, foldGutter: false }}
              aria-label="Diagram source"
            />
          )}
        </Panel>
        <Separator className="relative w-px bg-line outline-none transition-colors hover:bg-accent data-[separator=active]:bg-accent aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full" />
        <Panel minSize="20" className="relative min-h-0">
          {/* Preview toolbar */}
          <div className="absolute inset-x-0 top-0 z-10 flex items-center gap-2 p-3">
            <span className="rounded-md border border-line bg-bg/80 px-2 py-1 text-xs font-medium text-fg/70 backdrop-blur">{lang === "mermaid" ? "Mermaid" : "PlantUML"}</span>
            {lang === "plantuml" && <div role="tablist" aria-label="Preview format" className="flex rounded-lg border border-line bg-bg/80 p-0.5 text-xs backdrop-blur">
              {(["svg", "png", "txt"] as Format[]).map((f) => (
                <button
                  key={f} role="tab" aria-selected={format === f} onClick={() => setFormat(f)}
                  className={`rounded-md px-2.5 py-1 uppercase ${format === f ? "bg-muted font-medium" : "text-fg/60 hover:text-fg"}`}
                >
                  {f === "txt" ? "ascii" : f}
                </button>
              ))}
            </div>}
            {loading && <Loader2 size={14} className="animate-spin text-fg/50" aria-label="Rendering" />}
            {preview?.error && !loading && (
              <span className="flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-1 text-xs text-amber-600 dark:text-amber-400">
                <TriangleAlert size={12} /> Syntax error
              </span>
            )}
            {preview?.error && !loading && (
              <button onClick={fixWithAi} disabled={fixing}
                className="flex items-center gap-1 rounded-md bg-accent px-2 py-1 text-xs font-medium text-white hover:bg-accent/90 disabled:opacity-60">
                {fixing ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />} Fix with AI
              </button>
            )}
            {!preview?.error && (
              <button onClick={openInWhiteboard} disabled={toBoard} title={lang === "plantuml" ? "AI converts it to an editable whiteboard drawing" : "Convert to an editable whiteboard drawing"}
                className="hidden items-center gap-1 rounded-md border border-line bg-bg/80 px-2 py-1 text-xs text-fg/70 backdrop-blur hover:text-fg sm:flex">
                {toBoard ? <Loader2 size={12} className="animate-spin" /> : <PenTool size={12} />} Edit on whiteboard
              </button>
            )}
            {(format !== "txt" || lang === "mermaid") && (
              <div className="ml-auto flex items-center rounded-lg border border-line bg-bg/80 backdrop-blur">
                <IconBtn label="Zoom out" onClick={() => setZoom((z) => Math.max(0.1, z / 1.2))}><ZoomOut size={14} /></IconBtn>
                <button onClick={() => setZoom(1)} className="w-12 text-xs tabular-nums text-fg/70 hover:text-fg" title="Reset zoom">
                  {Math.round(zoom * 100)}%
                </button>
                <IconBtn label="Zoom in" onClick={() => setZoom((z) => Math.min(8, z * 1.2))}><ZoomIn size={14} /></IconBtn>
                <IconBtn label="Fit to screen" onClick={fit}><Maximize size={14} /></IconBtn>
              </div>
            )}
          </div>
          <div
            ref={viewport}
            className="dot-grid h-full overflow-auto"
            onWheel={(e) => {
              if (!(e.ctrlKey || e.metaKey) || (format === "txt" && lang === "plantuml")) return;
              setZoom((z) => Math.min(8, Math.max(0.1, z * (e.deltaY < 0 ? 1.1 : 0.9))));
            }}
          >
            {/* w-max + mx-auto: centers small diagrams, but wide ones stay scrollable (justify-center would clip the left edge) */}
            <div className="mx-auto w-max min-w-full p-6 pt-16 text-center">
              {format === "txt" && lang === "plantuml" ? (
                <pre className="inline-block text-left rounded-xl border border-line bg-bg p-4 font-mono text-xs leading-tight">{preview?.text}</pre>
              ) : preview?.url ? (
                // Rendered as <img> so any markup inside the SVG can't run script.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview.url}
                  alt={`${title} diagram`}
                  onLoad={(e) => {
                    const w = e.currentTarget.naturalWidth, h = e.currentTarget.naturalHeight;
                    setNatural({ w, h });
                    // First render: shrink to fit so the whole diagram is visible.
                    if (!fitted.current && viewport.current) {
                      fitted.current = true;
                      setZoom(Math.min(1, (viewport.current.clientWidth - 48) / w, (viewport.current.clientHeight - 88) / h));
                    }
                  }}
                  style={natural.w ? { width: natural.w * zoom, maxWidth: "none" } : undefined}
                  className="mx-auto inline-block rounded-xl bg-white shadow-sm ring-1 ring-line"
                  draggable={false}
                />
              ) : (
                <Loader2 className="mx-auto mt-24 animate-spin text-fg/40" />
              )}
            </div>
          </div>
        </Panel>
      </Group>

      {aiOpen && (
        <AiPanel signedIn={!!isSignedIn} lang={lang} source={source ?? ""} onClose={() => setAiOpen(false)} onResult={applyAi} />
      )}

      {libraryOpen && (
        <Library
          onClose={() => setLibraryOpen(false)}
          onOpen={(d) => {
            if (detectKind(d.source) === "excalidraw") return router.push(`/board?id=${d.id}`);
            loadDiagram(d.source, d.title, d.id); setLibraryOpen(false);
          }}
          activeId={cloudId}
          onDeleted={(id) => id === cloudId && setCloudId(null)}
        />
      )}
    </div>
  );
}

function Library({ onClose, onOpen, activeId, onDeleted }: {
  onClose: () => void; onOpen: (d: Saved) => void; activeId: string | null; onDeleted: (id: string) => void;
}) {
  const [items, setItems] = useState<Saved[] | null>(null);

  useEffect(() => {
    fetch("/api/diagrams")
      .then(async (r) => (r.ok ? r.json() : Promise.reject((await r.json().catch(() => ({}))).error)))
      .then(setItems)
      .catch((e) => { toast.error(e || "Could not load diagrams"); setItems([]); });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [onClose]);

  const remove = async (d: Saved) => {
    if (!confirm(`Delete "${d.title}"?`)) return;
    const res = await fetch(`/api/diagrams/${d.id}`, { method: "DELETE" });
    if (!res.ok) return toast.error("Delete failed");
    setItems((xs) => xs?.filter((x) => x.id !== d.id) ?? null);
    onDeleted(d.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <aside
        role="dialog" aria-modal="true" aria-label="My diagrams"
        className="flex h-full w-full max-w-sm flex-col border-l border-line bg-bg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-14 items-center justify-between border-b border-line px-4">
          <h2 className="font-semibold">My diagrams</h2>
          <button onClick={onClose} className="text-sm text-fg/60 hover:text-fg">Close</button>
        </div>
        <ul className="flex-1 overflow-y-auto p-2">
          {items === null && <li className="p-4 text-sm text-fg/60"><Loader2 className="animate-spin" size={16} /></li>}
          {items?.length === 0 && <li className="p-4 text-sm text-fg/60">No saved diagrams yet. Press Save to add one.</li>}
          {items?.map((d) => (
            <li key={d.id} className="group flex items-center gap-2 rounded-lg hover:bg-muted">
              <button onClick={() => onOpen(d)} className="flex min-w-0 flex-1 flex-col items-start px-3 py-2 text-left">
                <span className="flex w-full items-center gap-1.5 truncate text-sm font-medium">
                  {d.id === activeId && <Check size={12} className="text-accent" />}{d.title}
                </span>
                <span className="text-xs text-fg/50">{new Date(d.updated_at).toLocaleString()}</span>
              </button>
              <button onClick={() => remove(d)} aria-label={`Delete ${d.title}`} className="mr-2 rounded p-1.5 text-fg/40 opacity-0 hover:text-red-500 focus:opacity-100 group-hover:opacity-100">
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-label={label} title={label} className="grid size-8 place-items-center rounded-md text-fg/70 hover:bg-muted hover:text-fg">
      {children}
    </button>
  );
}

// Minimal dropdown on native <details>: keyboard-accessible, closes on item click / outside click.
function Menu({ label, ariaLabel, align = "left", children }: {
  label: React.ReactNode; ariaLabel?: string; align?: "left" | "right"; children: React.ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) ref.current.open = false; };
    addEventListener("click", close);
    return () => removeEventListener("click", close);
  }, []);
  return (
    <details ref={ref} className="relative" onClick={(e) => { if ((e.target as HTMLElement).closest("[data-item]") && ref.current) ref.current.open = false; }}>
      <summary aria-label={ariaLabel} className="flex h-8 cursor-pointer list-none items-center gap-1 rounded-md px-2 text-sm text-fg/80 hover:bg-muted hover:text-fg [&::-webkit-details-marker]:hidden">
        {label}{typeof label === "string" && <ChevronDown size={14} />}
      </summary>
      <div className={`absolute z-50 mt-1 max-h-80 w-52 overflow-y-auto rounded-lg border border-line bg-bg p-1 shadow-lg ${align === "right" ? "right-0" : "left-0"}`}>
        {children}
      </div>
    </details>
  );
}

function MenuItem({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button data-item onClick={onClick} className="block w-full rounded-md px-3 py-1.5 text-left text-sm hover:bg-muted">
      {children}
    </button>
  );
}

function useMediaQuery(q: string) {
  return useSyncExternalStore(
    (on) => { const m = matchMedia(q); m.addEventListener("change", on); return () => m.removeEventListener("change", on); },
    () => matchMedia(q).matches,
    () => false,
  );
}
