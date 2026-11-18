"use client";

import { useEffect, useRef, useState } from "react";
import { SignInButton } from "@clerk/nextjs";
import { ImagePlus, Loader2, Sparkles, X } from "lucide-react";
import type { Lang } from "@/lib/lang";

export type AiRequest = { mode: "create" | "edit" | "fix"; lang: Lang; prompt?: string; source?: string; error?: string; image?: string };

// Shared by the panel and the editor's "Fix with AI" button.
export async function askAi(body: AiRequest): Promise<string> {
  const res = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.code) throw new Error(data.error || "AI request failed");
  return data.code;
}

const IDEAS = [
  "Class diagram for a library management system",
  "ER diagram for an e-commerce store",
  "Sequence diagram of OAuth login with Google",
  "Microservices architecture with API gateway, auth, orders and payments",
  "Use case diagram for an ATM",
  "Flowchart of a CI/CD pipeline",
];

// Phone photos are often 5–10 MB; downscale to keep uploads fast and well under the API limit.
async function toDataUrl(file: File): Promise<string> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
  const c = Object.assign(document.createElement("canvas"), { width: Math.round(bmp.width * scale), height: Math.round(bmp.height * scale) });
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#fff"; // transparent PNGs become white, not black, as JPEG
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.85);
}

export function AiPanel({ signedIn, lang, source, onClose, onResult }: {
  signedIn: boolean; lang: Lang; source: string; onClose: () => void; onResult: (code: string) => void;
}) {
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [target, setTarget] = useState<Lang>(lang);
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !busy && onClose();
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [onClose, busy]);

  const attach = async (file?: File | null) => {
    if (!file?.type.startsWith("image/")) return;
    try { setImage(await toDataUrl(file)); setError(null); } catch { setError("Could not read that image"); }
  };

  const submit = async () => {
    setBusy(true); setError(null);
    try {
      const code = await askAi(mode === "create"
        ? { mode, lang: target, prompt, image: image ?? undefined }
        : { mode, lang, prompt, source, image: image ?? undefined });
      onResult(code);
      onClose();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const canSubmit = !busy && (prompt.trim() || image);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm" onClick={() => !busy && onClose()}>
      <aside
        role="dialog" aria-modal="true" aria-label="AI diagram assistant"
        className="flex h-full w-full max-w-md flex-col border-l border-line bg-bg shadow-xl"
        onClick={(e) => e.stopPropagation()}
        onPaste={(e) => attach(e.clipboardData.files[0])}
      >
        <div className="flex h-14 items-center justify-between border-b border-line px-4">
          <h2 className="flex items-center gap-2 font-semibold"><Sparkles size={16} className="text-accent" /> AI assistant</h2>
          <button onClick={onClose} aria-label="Close" className="rounded p-1 text-fg/60 hover:bg-muted hover:text-fg"><X size={16} /></button>
        </div>

        {!signedIn ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <Sparkles size={32} className="text-accent" />
            <p className="text-sm text-fg/70">Turn a sentence, a whiteboard photo or a screenshot into an editable diagram. Free with an account.</p>
            <SignInButton mode="modal">
              <button className="h-9 rounded-md bg-accent px-4 text-sm font-medium text-white hover:bg-accent/90">Sign in to use AI</button>
            </SignInButton>
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
            <div role="tablist" className="grid grid-cols-2 rounded-lg border border-line p-0.5 text-sm">
              {(["create", "edit"] as const).map((m) => (
                <button key={m} role="tab" aria-selected={mode === m} onClick={() => setMode(m)}
                  className={`rounded-md py-1.5 ${mode === m ? "bg-muted font-medium" : "text-fg/60 hover:text-fg"}`}>
                  {m === "create" ? "New diagram" : "Edit current"}
                </button>
              ))}
            </div>

            {mode === "create" && (
              <label className="flex items-center justify-between text-sm">
                <span className="text-fg/70">Output language</span>
                <select value={target} onChange={(e) => setTarget(e.target.value as Lang)} className="rounded-md border border-line bg-bg px-2 py-1">
                  <option value="plantuml">PlantUML</option>
                  <option value="mermaid">Mermaid</option>
                </select>
              </label>
            )}

            <textarea
              autoFocus value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={5}
              onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && canSubmit) submit(); }}
              placeholder={mode === "create"
                ? "Describe your diagram… e.g. “Sequence diagram of a user paying with Stripe, including webhooks”"
                : "What should change? e.g. “Add a Redis cache between the API and the database”"}
              aria-label="Describe the diagram"
              className="w-full resize-none rounded-lg border border-line bg-bg p-3 text-sm outline-none focus:ring-2 focus:ring-accent/40"
            />

            {/* Image input: click, drop, or paste anywhere in the panel */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); attach(e.dataTransfer.files[0]); }}
              className="rounded-lg border border-dashed border-line p-3 text-sm"
            >
              {image ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt="Attached reference" className="max-h-48 w-full rounded-md object-contain" />
                  <button onClick={() => setImage(null)} aria-label="Remove image" className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"><X size={12} /></button>
                </div>
              ) : (
                <button onClick={() => fileInput.current?.click()} className="flex w-full flex-col items-center gap-1 py-3 text-fg/60 hover:text-fg">
                  <ImagePlus size={20} />
                  <span>Add a photo, sketch or screenshot</span>
                  <span className="text-xs text-fg/40">Click, drop or paste · whiteboards and hand drawings work too</span>
                </button>
              )}
              <input ref={fileInput} type="file" accept="image/*" hidden onChange={(e) => attach(e.target.files?.[0])} />
            </div>

            {mode === "create" && !prompt && !image && (
              <div className="flex flex-wrap gap-1.5">
                {IDEAS.map((i) => (
                  <button key={i} onClick={() => setPrompt(i)} className="rounded-full border border-line px-2.5 py-1 text-xs text-fg/70 hover:bg-muted hover:text-fg">{i}</button>
                ))}
              </div>
            )}

            {error && <p role="alert" className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">{error}</p>}

            <button onClick={submit} disabled={!canSubmit}
              className="mt-auto flex h-10 items-center justify-center gap-2 rounded-lg bg-accent text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50">
              {busy ? <><Loader2 size={16} className="animate-spin" /> Drawing…</> : <><Sparkles size={16} /> {mode === "create" ? "Generate diagram" : "Apply changes"}</>}
            </button>
            <p className="text-center text-xs text-fg/40">Ctrl/⌘ + Enter · AI can make mistakes, so review the result</p>
          </div>
        )}
      </aside>
    </div>
  );
}
