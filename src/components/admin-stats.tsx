"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Stats = { cards: [string, number | string][]; users: { id: string; name: string; createdAt: number; lastActiveAt: number | null }[] };

export function AdminStats() {
  const [data, setData] = useState<Stats | "denied" | null>(null);
  useEffect(() => {
    fetch("/api/admin").then((r) => (r.ok ? r.json() : "denied")).then(setData).catch(() => setData("denied"));
  }, []);

  if (data === null) return <p className="text-fg/60">Loading stats…</p>;
  if (data === "denied")
    return <p className="text-fg/60">This page is for the site owner. <Link href="/sign-in" className="text-accent underline">Sign in</Link> with an admin account.</p>;

  return (
    <>
      <section>
        <h1 className="mb-4 text-2xl font-semibold">Usage</h1>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {data.cards.map(([label, value]) => (
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
              {data.users.map((u) => (
                <tr key={u.id} className="border-t border-line">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3 tabular-nums text-fg/70">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 tabular-nums text-fg/70">{u.lastActiveAt ? new Date(u.lastActiveAt).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
              {data.users.length === 0 && <tr><td colSpan={3} className="p-3 text-fg/60">No users yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
