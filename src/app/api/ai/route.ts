import { auth } from "@clerk/nextjs/server";
import { generateText } from "ai";
import { sql, MAX_SOURCE } from "@/lib/db";

// gpt-5-mini: available on the AI Gateway free tier, reads images, and produced valid diagrams
// in testing. Set AI_MODEL (e.g. anthropic/claude-sonnet-5.5) after adding gateway credits.
const MODEL = process.env.AI_MODEL || "openai/gpt-5-mini";
const DAILY_LIMIT = 25; // per user, rolling 24h — caps the AI bill
const MAX_IMAGE = 5 * 1024 * 1024;
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

const SYSTEM = `You are an expert at technical diagrams: UML (sequence, class, activity, use case, state, component, deployment), ER/database schemas, system architecture, flowcharts, mind maps, Gantt charts.
You write diagram source code. Rules:
- Output ONLY the diagram source. No prose, no explanations, no markdown code fences.
- PlantUML: start with @startuml (or @startmindmap/@startgantt/@startjson etc.) and end with the matching @end tag. Use only syntax the official PlantUML server renders.
- Mermaid: start with the diagram keyword (flowchart, sequenceDiagram, classDiagram, erDiagram, stateDiagram-v2, gantt, mindmap, ...). Quote labels containing special characters.
- Prefer clear names, logical grouping and a readable layout. Keep it as detailed as the input implies, never invent large unrelated parts.
- When given an image (whiteboard photo, screenshot, hand sketch, existing diagram), faithfully reproduce its structure, labels and relationships.`;

type Body = { mode?: string; lang?: string; prompt?: string; source?: string; error?: string; image?: string };

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Sign in to use AI" }, { status: 401 });

  const b: Body | null = await req.json().catch(() => null);
  const mode = b?.mode;
  const lang = b?.lang === "mermaid" ? "Mermaid" : "PlantUML";
  const prompt = typeof b?.prompt === "string" ? b.prompt.trim().slice(0, 4000) : "";
  const source = typeof b?.source === "string" ? b.source : "";
  if (!mode || !["create", "edit", "fix"].includes(mode) || source.length > MAX_SOURCE)
    return Response.json({ error: "Invalid request" }, { status: 400 });

  // Image arrives as a data URL from the browser; validate type and size before forwarding.
  let image: { data: string; mediaType: string } | undefined;
  if (b?.image) {
    const m = /^data:(image\/[a-z+]+);base64,([A-Za-z0-9+/=]+)$/.exec(b.image);
    if (!m || !IMAGE_TYPES.includes(m[1]) || (m[2].length * 3) / 4 > MAX_IMAGE)
      return Response.json({ error: "Image must be PNG, JPEG, WebP or GIF under 5 MB" }, { status: 400 });
    image = { mediaType: m[1], data: m[2] };
  }
  if (mode === "create" && !prompt && !image) return Response.json({ error: "Describe the diagram or attach an image" }, { status: 400 });
  if (mode !== "create" && !source.trim()) return Response.json({ error: "Nothing to edit yet" }, { status: 400 });

  // shortcut: without DATABASE_URL (self-hosting) there's no limit; add one before exposing such a deploy publicly.
  if (sql) {
    const [{ n }] = await sql`select count(*)::int as n from ai_usage where user_id = ${userId} and created_at > now() - interval '24 hours'`;
    if (n >= DAILY_LIMIT) return Response.json({ error: `Daily AI limit reached (${DAILY_LIMIT}). Try again tomorrow.` }, { status: 429 });
  }

  const task =
    mode === "create" ? `Create a ${lang} diagram.${prompt ? `\n\nRequest:\n${prompt}` : ""}${image ? "\n\nUse the attached image as the source." : ""}`
    : mode === "edit" ? `Modify this ${lang} diagram as requested and return the full updated source.\n\nRequest:\n${prompt || "Improve it."}\n\nCurrent source:\n${source}`
    : `This ${lang} diagram fails to render. Fix it with minimal changes and return the full corrected source.${b?.error ? `\n\nRenderer error:\n${String(b.error).slice(0, 1000)}` : ""}\n\nSource:\n${source}`;

  try {
    const { text } = await generateText({
      model: MODEL,
      system: SYSTEM,
      maxOutputTokens: 4000,
      messages: [{
        role: "user",
        content: image ? [{ type: "file", mediaType: image.mediaType, data: image.data }, { type: "text", text: task }] : task,
      }],
    });
    if (sql) await sql`insert into ai_usage (user_id, mode) values (${userId}, ${mode})`;
    return Response.json({ code: stripFences(text) });
  } catch (e) {
    console.error("AI generation failed", e);
    return Response.json({ error: "AI is unavailable right now. Please try again." }, { status: 502 });
  }
}

// Models sometimes wrap code in ``` fences despite instructions.
const stripFences = (t: string) => t.trim().replace(/^```[\w-]*\n([\s\S]*?)\n?```$/, "$1").trim();
