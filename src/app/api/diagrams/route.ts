import { auth } from "@clerk/nextjs/server";
import { sql, parse } from "@/lib/db";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!sql) return Response.json({ error: "Cloud save not configured" }, { status: 503 });
  const rows = await sql`
    select id, title, source, updated_at from diagrams
    where user_id = ${userId} order by updated_at desc limit 200`;
  return Response.json(rows);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!sql) return Response.json({ error: "Cloud save not configured" }, { status: 503 });
  const body = await parse(req);
  if (!body) return Response.json({ error: "Invalid body" }, { status: 400 });
  const [row] = await sql`
    insert into diagrams (user_id, title, source)
    values (${userId}, ${body.title}, ${body.source}) returning id`;
  return Response.json(row, { status: 201 });
}
