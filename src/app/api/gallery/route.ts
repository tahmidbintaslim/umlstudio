import { sql } from "@/lib/db";

// Public: approved community diagrams. CDN-cached for 5 minutes.
export async function GET() {
  if (!sql) return Response.json([]);
  const rows = await sql`
    select id, title, source, published_at from diagrams
    where status = 'approved' order by published_at desc limit 60`;
  return Response.json(rows, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } });
}
