import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { sql } from "@/lib/db";
import { Logo } from "@/components/logo";

export const metadata = { title: "Admin · UML Studio", robots: { index: false } };

// Owner-only usage dashboard. Access: signed-in users whose email is in ADMIN_EMAILS (comma-separated).
export default function AdminPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-8 p-6">
      <header className="flex items-center justify-between">
        <Link href="/"><Logo /></Link>
        <Link href="/app" className="text-sm text-fg/60 hover:text-fg">Open editor →</Link>
      </header>
      <Suspense fallback={<p className="text-fg/60">Loading stats…</p>}>
        <Stats />
      </Suspense>
    </main>
  );
}

async function Stats() {
  const me = await currentUser();
  const admins = (process.env.ADMIN_EMAILS ?? "").toLowerCase().split(",").map((s) => s.trim()).filter(Boolean);
  if (!me || !me.emailAddresses.some((e) => admins.includes(e.emailAddress.toLowerCase()))) notFound();

  const clerk = await clerkClient();
  // eslint-disable-next-line react-hooks/purity -- server component, renders once per request
  const weekAgo = Date.now() - 7 * 864e5;
  const [totalUsers, recent] = await Promise.all([
    clerk.users.getCount(),
    clerk.users.getUserList({ orderBy: "-created_at", limit: 100 }),
  ]);
  const newThisWeek = recent.data.filter((u) => u.createdAt > weekAgo).length;

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

  const cards: [string, number | string][] = [
    ["Registered users", totalUsers],
    ["New users (7 days)", newThisWeek],
    ["Saved diagrams", db?.diagrams ?? "—"],
    ["Diagrams saved (7 days)", db?.diagrams_7d ?? "—"],
    ["Users who saved", db?.savers ?? "—"],
    ["AI requests (24 h)", db?.ai_24h ?? "—"],
    ["AI requests (7 days)", db?.ai_7d ?? "—"],
    ["AI requests (all time)", db?.ai_total ?? "—"],
    ["Users who used AI", db?.ai_users ?? "—"],
  ];

  return (
    <>
      <section>
        <h1 className="mb-4 text-2xl font-semibold">Usage</h1>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {cards.map(([label, value]) => (
            <div key={label} className="rounded-xl border border-line p-4">
              <p className="text-sm text-fg/60">{label}</p>
              <p className="mt-1 text-3xl font-semibold tabular-nums">{value}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-fg/60">
          Visitors, page views, countries and referrers are in{" "}
          <a className="text-accent underline" href="https://vercel.com/tahmid-bin-taslim-rafis-projects/umlstudio/analytics" target="_blank" rel="noreferrer">Vercel Analytics</a>.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Latest sign-ups</h2>
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-fg/60">
              <tr><th className="p-3 font-medium">User</th><th className="p-3 font-medium">Joined</th><th className="p-3 font-medium">Last active</th></tr>
            </thead>
            <tbody>
              {recent.data.slice(0, 20).map((u) => (
                <tr key={u.id} className="border-t border-line">
                  <td className="p-3">{[u.firstName, u.lastName].filter(Boolean).join(" ") || u.primaryEmailAddress?.emailAddress || u.id}</td>
                  <td className="p-3 tabular-nums text-fg/70">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 tabular-nums text-fg/70">{u.lastActiveAt ? new Date(u.lastActiveAt).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
              {recent.data.length === 0 && <tr><td colSpan={3} className="p-3 text-fg/60">No users yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
