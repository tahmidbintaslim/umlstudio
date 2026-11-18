import { auth } from "@clerk/nextjs/server";
import { sql, parse } from "@/lib/db";

const UUID = /^[0-9a-f-]{36}$/i;

async function guard(ctx: RouteContext<"/api/diagrams/[id]">) {
  const { userId } = await auth();
  const { id } = await ctx.params;
  if (!userId) return { err: Response.json({ error: "Unauthorized" }, { status: 401 }) };
  if (!sql) return { err: Response.json({ error: "Cloud save not configured" }, { status: 503 }) };
  if (!UUID.test(id)) return { err: Response.json({ error: "Not found" }, { status: 404 }) };
  return { userId, id, sql };
}

export async function GET(_req: Request, ctx: RouteContext<"/api/diagrams/[id]">) {
  const g = await guard(ctx);
  if (g.err) return g.err;
  const [row] = await g.sql`select id, title, source, updated_at from diagrams where id = ${g.id} and user_id = ${g.userId}`;
  return row ? Response.json(row) : Response.json({ error: "Not found" }, { status: 404 });
}

export async function PUT(req: Request, ctx: RouteContext<"/api/diagrams/[id]">) {
  const g = await guard(ctx);
  if (g.err) return g.err;
  const body = await parse(req);
  if (!body) return Response.json({ error: "Invalid body" }, { status: 400 });
  const rows = await g.sql`
    update diagrams set title = ${body.title}, source = ${body.source}, updated_at = now()
    where id = ${g.id} and user_id = ${g.userId} returning id`;
  return rows.length ? Response.json(rows[0]) : Response.json({ error: "Not found" }, { status: 404 });
}

export async function DELETE(_req: Request, ctx: RouteContext<"/api/diagrams/[id]">) {
  const g = await guard(ctx);
  if (g.err) return g.err;
  await g.sql`delete from diagrams where id = ${g.id} and user_id = ${g.userId}`;
  return new Response(null, { status: 204 });
}
