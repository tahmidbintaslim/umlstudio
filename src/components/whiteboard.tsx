"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";
import { toast } from "sonner";
import { Cloud, Code2, Loader2, Sparkles } from "lucide-react";
import {
  Excalidraw, MainMenu, WelcomeScreen, convertToExcalidrawElements, restore, serializeAsJSON,
} from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import "@excalidraw/excalidraw/index.css";
import { detectKind } from "@/lib/lang";
import { LogoMark } from "./logo";
import { AiPanel } from "./ai-panel";

const BOARD_KEY = "umlstudio:board";

// Mermaid → native Excalidraw shapes (flowchart, sequence, class); other types arrive as one image.
async function mermaidToElements(code: string) {
  const { parseMermaidToExcalidraw } = await import("@excalidraw/mermaid-to-excalidraw");
  const { elements, files } = await parseMermaidToExcalidraw(code, { themeVariables: { fontSize: "16px" } });
  return { elements: convertToExcalidrawElements(elements), files };
}

export default function Whiteboard() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [api, setApi] = useState<ExcalidrawImperativeAPI | null>(null);
  const [title, setTitle] = useState("Untitled board");
  const [cloudId, setCloudId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const loaded = useRef(false);

  // Drop generated shapes next to existing content and select them so they can be moved as a group.
  const insertMermaid = useCallback(async (code: string) => {
    if (!api) return;
    try {
      const { elements, files } = await mermaidToElements(code);
      const existing = api.getSceneElements();
      const right = existing.reduce((m, e) => Math.max(m, e.x + e.width), 0);
      const dx = existing.length ? right + 80 : 0;
      const placed = elements.map((e) => ({ ...e, x: e.x + dx }));
      if (files) api.addFiles(Object.values(files));
      api.updateScene({
        elements: [...existing, ...placed],
        appState: { selectedElementIds: Object.fromEntries(placed.map((e) => [e.id, true])) },
      });
      api.scrollToContent(placed, { fitToContent: true, animate: true });
    } catch (e) {
      toast.error(`Could not convert that diagram: ${(e as Error).message}`);
    }
  }, [api]);

  // Initial content: cloud board (?id=) > hand-off from the code editor (?from=code) > local draft.
  useEffect(() => {
    if (!api || loaded.current) return;
    loaded.current = true;
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    if (id) {
      fetch(`/api/diagrams/${encodeURIComponent(id)}`)
        .then(async (r) => (r.ok ? r.json() : Promise.reject((await r.json().catch(() => ({}))).error)))
        .then((d) => {
          if (detectKind(d.source) !== "excalidraw") return router.replace("/app");
          const scene = restore(JSON.parse(d.source), null, null);
          api.updateScene({ elements: scene.elements, appState: scene.appState });
          if (scene.files) api.addFiles(Object.values(scene.files));
          api.scrollToContent(undefined, { fitToContent: true });
          setTitle(d.title); setCloudId(d.id);
        })
        .catch((e) => toast.error(e || "Could not open that board"));
      return;
    }
    if (params.get("from") === "code") {
      let code = "";
      try { code = sessionStorage.getItem("umlstudio:to-board") ?? ""; sessionStorage.removeItem("umlstudio:to-board"); } catch {}
      history.replaceState(null, "", "/board");
      if (code) void insertMermaid(code);
    }
  }, [api, insertMermaid, router]);

  const save = useCallback(async () => {
    if (!api) return;
    if (!isSignedIn) return toast("Sign in to save boards to the cloud", { description: "Your board is kept in this browser meanwhile." });
    setSaving(true);
    try {
      const source = serializeAsJSON(api.getSceneElements(), api.getAppState(), api.getFiles(), "database");
      const res = await fetch(cloudId ? `/api/diagrams/${cloudId}` : "/api/diagrams", {
        method: cloudId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, source }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(res.status === 400 ? "Board is too large to save (images count toward the limit)" : data.error || "Save failed");
      setCloudId(data.id);
      history.replaceState(null, "", `/board?id=${data.id}`);
      toast.success("Board saved");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  }, [api, cloudId, isSignedIn, title]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); save(); }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [save]);

  const fromCode = async () => {
    const code = prompt("Paste Mermaid code (flowchart, sequence or class diagrams become editable shapes):");
    if (code?.trim()) await insertMermaid(code);
  };

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-line bg-bg px-3 text-fg sm:px-4">
        <Link href="/" aria-label="UML Studio home" className="flex items-center gap-2 font-semibold tracking-tight">
          <LogoMark /><span className="hidden sm:inline">UML Studio</span>
        </Link>
        <span className="mx-1 hidden h-5 w-px bg-line sm:block" />
        <input value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Board title"
          className="hidden w-48 min-w-0 rounded-md bg-transparent px-2 py-1 text-sm outline-none hover:bg-muted focus:bg-muted focus:ring-2 focus:ring-accent/40 sm:block" />
        <button onClick={() => setAiOpen(true)}
          className="flex h-8 items-center gap-1.5 rounded-md border border-accent/30 bg-accent/10 px-3 text-sm font-medium text-accent hover:bg-accent/20">
          <Sparkles size={14} /> <span className="hidden sm:inline">AI draw</span>
        </button>
        <button onClick={fromCode} className="hidden h-8 items-center gap-1.5 rounded-md px-2 text-sm text-fg/80 hover:bg-muted hover:text-fg sm:flex">
          <Code2 size={14} /> From code
        </button>
        <div className="ml-auto flex items-center gap-1">
          <Link href="/app" className="hidden h-8 items-center rounded-md px-2 text-sm text-fg/80 hover:bg-muted hover:text-fg md:flex">Code editor</Link>
          <button onClick={save} disabled={saving} title="Save (Ctrl/⌘+S)"
            className="flex h-8 items-center gap-1.5 rounded-md bg-accent px-3 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-60">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Cloud size={14} />}
            <span className="hidden sm:inline">Save</span>
          </button>
          {isSignedIn ? <UserButton /> : (
            <SignInButton mode="modal">
              <button className="h-8 whitespace-nowrap rounded-md border border-line px-3 text-sm hover:bg-muted">Sign in</button>
            </SignInButton>
          )}
        </div>
      </header>

      <div className="relative min-h-0 flex-1">
        <Excalidraw
          excalidrawAPI={setApi}
          theme={resolvedTheme === "dark" ? "dark" : "light"}
          // Local draft persistence; cloud save is explicit.
          initialData={() => {
            try {
              const raw = localStorage.getItem(BOARD_KEY);
              return raw && !new URLSearchParams(location.search).get("id") ? restore(JSON.parse(raw), null, null) : null;
            } catch { return null; }
          }}
          onChange={(elements, appState, files) => {
            try { localStorage.setItem(BOARD_KEY, serializeAsJSON(elements, appState, files, "local")); } catch {}
          }}
        >
          <MainMenu>
            <MainMenu.DefaultItems.LoadScene />
            <MainMenu.DefaultItems.SaveToActiveFile />
            <MainMenu.DefaultItems.Export />
            <MainMenu.DefaultItems.SaveAsImage />
            <MainMenu.DefaultItems.ClearCanvas />
            <MainMenu.Separator />
            <MainMenu.DefaultItems.ToggleTheme />
            <MainMenu.DefaultItems.ChangeCanvasBackground />
            <MainMenu.DefaultItems.Help />
          </MainMenu>
          <WelcomeScreen>
            <WelcomeScreen.Hints.ToolbarHint />
            <WelcomeScreen.Hints.MenuHint />
            <WelcomeScreen.Center>
              <WelcomeScreen.Center.Heading>Sketch freely, or let AI draw for you</WelcomeScreen.Center.Heading>
              <WelcomeScreen.Center.Menu>
                <WelcomeScreen.Center.MenuItem onSelect={() => setAiOpen(true)}>Describe a diagram or upload a photo…</WelcomeScreen.Center.MenuItem>
                <WelcomeScreen.Center.MenuItem onSelect={fromCode}>Convert Mermaid code…</WelcomeScreen.Center.MenuItem>
                <WelcomeScreen.Center.MenuItemLoadScene />
              </WelcomeScreen.Center.Menu>
            </WelcomeScreen.Center>
          </WelcomeScreen>
        </Excalidraw>
      </div>

      {aiOpen && (
        <AiPanel whiteboard signedIn={!!isSignedIn} lang="mermaid" source="" onClose={() => setAiOpen(false)}
          onResult={(code) => { void insertMermaid(code); toast.success("Drawn on the whiteboard. Drag to move, double-click to edit."); }} />
      )}
    </div>
  );
}
