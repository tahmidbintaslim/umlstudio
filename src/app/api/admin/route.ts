import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { sql } from "@/lib/db";

// Owner-only usage stats. Access: signed-in users whose email is in ADMIN_EMAILS (comma-separated).
export async function GET() {
  const me = await currentUser();
  const admins = (process.env.ADMIN_EMAILS ?? "").toLowerCase().split(",").map((s) => s.trim()).filter(Boolean);
  if (!me || !me.emailAddresses.some((e) => admins.includes(e.emailAddress.toLowerCase())))
    return Response.json({ error: "Not found" }, { status: 404 }); // don't reveal the page exists

  const clerk = await clerkClient();
  const [totalUsers, recent] = await Promise.all([
    clerk.users.getCount(),
    clerk.users.getUserList({ orderBy: "-created_at", limit: 100 }),
  ]);
  const weekAgo = Date.now() - 7 * 864e5;

  const [db] = sql
    ? await sql`select
        (select count(*)::int from diagrams) as diagrams,
        (select count(*)::int from diagrams where created_at > now() - interval '7 days') as diagrams_7d,
        (select count(distinct user_id)::int from diagrams) as savers,
        (select count(*)::int from ai_usage) as ai_total,
        (select count(*)::int from ai_usage where created_at > now() - interval '24 hours') as ai_24h,
        (select count(*)::int from ai_usage where created_at > now() - interval '7 days') as ai_7d,
        (select count(distinct user_id)::int from ai_usage) as ai_users`
    : [null];

  return Response.json({
    cards: [
      ["Registered users", totalUsers],
      ["New users (7 days)", recent.data.filter((u) => u.createdAt > weekAgo).length],
      ["Saved diagrams", db?.diagrams ?? "—"],
      ["Diagrams saved (7 days)", db?.diagrams_7d ?? "—"],
      ["Users who saved", db?.savers ?? "—"],
      ["AI requests (24 h)", db?.ai_24h ?? "—"],
      ["AI requests (7 days)", db?.ai_7d ?? "—"],
      ["AI requests (all time)", db?.ai_total ?? "—"],
      ["Users who used AI", db?.ai_users ?? "—"],
    ],
    users: recent.data.slice(0, 20).map((u) => ({
      id: u.id,
      name: [u.firstName, u.lastName].filter(Boolean).join(" ") || u.primaryEmailAddress?.emailAddress || u.id,
      createdAt: u.createdAt,
      lastActiveAt: u.lastActiveAt,
    })),
  });
}
