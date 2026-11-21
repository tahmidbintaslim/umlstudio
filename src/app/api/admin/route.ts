import { auth, clerkClient } from "@clerk/nextjs/server";
import { sql } from "@/lib/db";

const isAdmin = async () => (await auth()).sessionClaims?.metadata?.role === "admin";

// Owner-only usage stats. The proxy already enforces the Clerk admin role; checked again here.
export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: "Not found" }, { status: 404 });

  const clerk = await clerkClient();
  const [totalUsers, recent] = await Promise.all([
    clerk.users.getCount(),
    clerk.users.getUserList({ orderBy: "-created_at", limit: 100 }),
  ]);
  const weekAgo = Date.now() - 7 * 864e5;

  if (!sql) return Response.json({ error: "DATABASE_URL not configured" }, { status: 503 });
  const [[db], daily, pages, referrers, countries, devices, pending] = await Promise.all([
    sql`select
        (select count(distinct visitor)::int from page_views where created_at > now() - interval '24 hours') as visitors_24h,
        (select count(distinct visitor)::int from page_views where created_at > now() - interval '7 days') as visitors_7d,
        (select count(distinct visitor)::int from page_views where created_at > now() - interval '30 days') as visitors_30d,
        (select count(*)::int from page_views where created_at > now() - interval '7 days') as views_7d,
        (select count(*)::int from diagrams) as diagrams,
        (select count(*)::int from diagrams where created_at > now() - interval '7 days') as diagrams_7d,
        (select count(distinct user_id)::int from diagrams) as savers,
        (select count(*)::int from ai_usage where created_at > now() - interval '24 hours') as ai_24h,
        (select count(*)::int from ai_usage where created_at > now() - interval '7 days') as ai_7d,
        (select count(distinct user_id)::int from ai_usage) as ai_users`,
    // Visitor hashes rotate daily, so per-day uniques are exact; multi-day uniques are an upper bound.
    sql`select to_char(d, 'YYYY-MM-DD') as day,
          (select count(distinct visitor)::int from page_views where created_at >= d and created_at < d + interval '1 day') as visitors,
          (select count(*)::int from page_views where created_at >= d and created_at < d + interval '1 day') as views
        from generate_series(date_trunc('day', now()) - interval '13 days', date_trunc('day', now()), interval '1 day') d order by d`,
    sql`select path as label, count(*)::int as n from page_views where created_at > now() - interval '7 days' group by 1 order by 2 desc limit 10`,
    sql`select referrer as label, count(*)::int as n from page_views where created_at > now() - interval '7 days' and referrer is not null group by 1 order by 2 desc limit 10`,
    sql`select coalesce(country, '??') as label, count(distinct visitor)::int as n from page_views where created_at > now() - interval '7 days' group by 1 order by 2 desc limit 10`,
    sql`select device as label, count(distinct visitor)::int as n from page_views where created_at > now() - interval '7 days' group by 1 order by 2 desc`,
    sql`select id, title, source from diagrams where status = 'pending' order by published_at limit 50`,
  ]);

  return Response.json({
    cards: [
      ["Visitors (24 h)", db.visitors_24h],
      ["Visitors (7 days)", db.visitors_7d],
      ["Visitors (30 days)", db.visitors_30d],
      ["Page views (7 days)", db.views_7d],
      ["Registered users", totalUsers],
      ["New users (7 days)", recent.data.filter((u) => u.createdAt > weekAgo).length],
      ["Saved diagrams", db.diagrams],
      ["Diagrams saved (7 days)", db.diagrams_7d],
      ["Users who saved", db.savers],
      ["AI requests (24 h)", db.ai_24h],
      ["AI requests (7 days)", db.ai_7d],
      ["Users who used AI", db.ai_users],
    ],
    daily,
    pending,
    lists: { "Top pages": pages, "Top referrers": referrers, Countries: countries, Devices: devices },
    users: recent.data.slice(0, 20).map((u) => ({
      id: u.id,
      name: [u.firstName, u.lastName].filter(Boolean).join(" ") || u.primaryEmailAddress?.emailAddress || u.id,
      createdAt: u.createdAt,
      lastActiveAt: u.lastActiveAt,
    })),
  });
}

// Gallery moderation: approve or reject (reject just un-publishes; the owner keeps the diagram).
export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Not found" }, { status: 404 });
  if (!sql) return Response.json({ error: "DATABASE_URL not configured" }, { status: 503 });
  const b = await req.json().catch(() => null);
  if (typeof b?.id !== "string" || !/^[0-9a-f-]{36}$/i.test(b.id) || !["approve", "reject"].includes(b?.action))
    return Response.json({ error: "Invalid body" }, { status: 400 });
  await sql`update diagrams set status = ${b.action === "approve" ? "approved" : null},
    published_at = ${b.action === "approve" ? new Date() : null} where id = ${b.id}`;
  return new Response(null, { status: 204 });
}
