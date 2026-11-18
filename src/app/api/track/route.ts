import { createHash } from "node:crypto";
import { sql } from "@/lib/db";

const BOTS = /bot|crawl|spider|slurp|preview|headless|lighthouse|monitor|curl|wget|python|axios/i;

// Cookieless page-view counter: a visitor is a daily-rotating hash of IP + user agent,
// so unique counts work without storing IPs or setting cookies (same approach as Plausible).
export async function POST(req: Request) {
  const ua = req.headers.get("user-agent") ?? "";
  if (!sql || BOTS.test(ua)) return new Response(null, { status: 204 });

  const b = await req.json().catch(() => null);
  const path = typeof b?.path === "string" && b.path.startsWith("/") ? b.path.slice(0, 200) : null;
  if (!path || path.startsWith("/admin")) return new Response(null, { status: 204 });

  let referrer: string | null = null;
  try {
    const host = new URL(String(b.ref)).hostname.replace(/^www\./, "");
    if (host && host !== new URL(req.url).hostname) referrer = host.slice(0, 100);
  } catch {}

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "";
  const day = new Date().toISOString().slice(0, 10);
  const visitor = createHash("sha256").update(`${process.env.ANALYTICS_SALT ?? ""}|${day}|${ip}|${ua}`).digest("hex").slice(0, 16);
  const country = req.headers.get("x-vercel-ip-country")?.slice(0, 2) || null;
  const device = /mobile|android|iphone|ipad/i.test(ua) ? "mobile" : "desktop";

  // Analytics must never break a page: log and swallow DB errors.
  await sql`insert into page_views (path, referrer, country, device, visitor) values (${path}, ${referrer}, ${country}, ${device}, ${visitor})`
    .catch((e) => console.error("track insert failed", e.message));
  return new Response(null, { status: 204 });
}
