// D2 and BPMN render on a Kroki server (https://kroki.io by default; self-hostable).
export const KROKI_SERVER = (process.env.NEXT_PUBLIC_KROKI_SERVER || "https://kroki.io").replace(/\/$/, "");

export async function renderKroki(type: string, src: string, signal?: AbortSignal): Promise<string> {
  const res = await fetch(`${KROKI_SERVER}/${type}/svg`, { method: "POST", body: src, headers: { "Content-Type": "text/plain" }, signal });
  const text = await res.text();
  if (!res.ok) throw new Error(text.trim().slice(0, 1000) || `Render failed (${res.status})`);
  return text;
}

// GET-able image URL (zlib deflate + base64url), for embeds and Markdown.
export async function krokiUrl(type: string, src: string): Promise<string> {
  const buf = await new Response(new Blob([src]).stream().pipeThrough(new CompressionStream("deflate"))).arrayBuffer();
  let bin = "";
  for (const b of new Uint8Array(buf)) bin += String.fromCharCode(b); // spread overflows the stack on big sources
  const b64 = btoa(bin).replace(/\+/g, "-").replace(/\//g, "_");
  return `${KROKI_SERVER}/${type}/svg/${b64}`;
}
