"use client";

import { useEffect, useState } from "react";

type Row = { label: string; n: number };
type Stats = {
  cards: [string, number][];
  daily: { day: string; visitors: number; views: number }[];
  lists: Record<string, Row[]>;
  users: { id: string; name: string; createdAt: number; lastActiveAt: number | null }[];
};

export function AdminStats() {
  const [data, setData] = useState<Stats | string | null>(null);
  useEffect(() => {
    fetch("/api/admin")
      .then(async (r) => (r.ok ? r.json() : (await r.json().catch(() => ({}))).error || "Not available"))
      .then(setData)
      .catch(() => setData("Could not load stats"));
  }, []);

  if (data === null) return <p className="text-fg/60">Loading stats…</p>;
  if (typeof data === "string") return <p className="text-fg/60">{data}</p>;

  const max = Math.max(1, ...data.daily.map((d) => d.views));
  return (
    <>
      <section>
        <h1 className="mb-4 text-2xl font-semibold">Usage</h1>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {data.cards.map(([label, value]) => (
            <div key={label} className="rounded-xl border border-line p-4">
              <p className="text-sm text-fg/60">{label}</p>
              <p className="mt-1 text-3xl font-semibold tabular-nums">{value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Last 14 days</h2>
        <div className="rounded-xl border border-line p-4">
          <div className="flex h-40 items-end gap-1.5" role="img" aria-label="Daily page views and visitors, last 14 days">
            {data.daily.map((d) => (
              <div key={d.day} className="group relative flex h-full flex-1 flex-col justify-end" title={`${d.day}: ${d.visitors} visitors, ${d.views} views`}>
                <div className="relative w-full rounded-t bg-accent/25" style={{ height: `${(d.views / max) * 100}%` }}>
                  <div className="absolute inset-x-0 bottom-0 rounded-t bg-accent" style={{ height: d.views ? `${(d.visitors / d.views) * 100}%` : 0 }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-fg/50">
            <span>{data.daily[0]?.day}</span>
            <span className="flex gap-3">
              <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-accent" /> visitors</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-accent/25" /> page views</span>
            </span>
            <span>{data.daily.at(-1)?.day}</span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {Object.entries(data.lists).map(([title, rows]) => {
          const top = Math.max(1, ...rows.map((r) => r.n));
          return (
            <div key={title} className="rounded-xl border border-line p-4">
              <h3 className="mb-3 text-sm font-semibold">{title} <span className="font-normal text-fg/50">· 7 days</span></h3>
              {rows.length === 0 && <p className="text-sm text-fg/50">No data yet.</p>}
              <ul className="space-y-1.5 text-sm">
                {rows.map((r) => (
                  <li key={r.label} className="relative flex justify-between overflow-hidden rounded px-2 py-1">
                    <span className="absolute inset-y-0 left-0 bg-accent/10" style={{ width: `${(r.n / top) * 100}%` }} />
                    <span className="relative truncate">{r.label}</span>
                    <span className="relative tabular-nums text-fg/70">{r.n}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
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
        <p className="mt-3 text-xs text-fg/50">
          Analytics are first-party and cookieless: visitors are counted by a daily-rotating hash, and no IPs are stored.
        </p>
      </section>
    </>
  );
}
