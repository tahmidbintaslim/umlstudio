import postgres from "postgres";

// Cloud save is optional: without DATABASE_URL the app still works (local drafts + share links).
export const sql = process.env.DATABASE_URL
  ? postgres(process.env.DATABASE_URL, { ssl: "require", max: 5 })
  : null;

export const MAX_SOURCE = 2_000_000; // chars; fits whiteboards with a few images, under Vercel's 4.5 MB body limit

// Shared request validation for create/update.
export async function parse(req: Request) {
  const b = await req.json().catch(() => null);
  if (typeof b?.source !== "string" || b.source.length > MAX_SOURCE) return null;
  const title = typeof b.title === "string" && b.title.trim() ? b.title.trim().slice(0, 120) : "Untitled";
  return { title, source: b.source as string };
}
