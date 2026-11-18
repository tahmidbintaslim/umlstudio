// Client-only Mermaid rendering. Returns standalone SVG text that displays correctly inside <img>.
export async function renderMermaid(src: string): Promise<string> {
  const mermaid = (await import("mermaid")).default;
  // htmlLabels off: <foreignObject> labels don't render reliably when the SVG is shown as an image.
  mermaid.initialize({ startOnLoad: false, securityLevel: "strict", theme: "default", htmlLabels: false, flowchart: { htmlLabels: false } });
  await mermaid.parse(src); // throws a readable syntax error before render touches the DOM
  const { svg } = await mermaid.render(`m${Math.random().toString(36).slice(2)}`, src);
  const el = new DOMParser().parseFromString(svg, "image/svg+xml").documentElement;
  const vb = el.getAttribute("viewBox")?.trim().split(/[\s,]+/).map(Number);
  // Mermaid emits width="100%"; give it an intrinsic size or <img> collapses to 300x150.
  if (vb?.length === 4) {
    el.setAttribute("width", String(Math.ceil(vb[2])));
    el.setAttribute("height", String(Math.ceil(vb[3])));
    el.removeAttribute("style");
  }
  return new XMLSerializer().serializeToString(el);
}

// Rasterise an SVG string to PNG at 2x for crisp exports.
export async function svgToPng(svg: string): Promise<Blob | null> {
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  try {
    const img = new Image();
    await new Promise((ok, fail) => { img.onload = ok; img.onerror = fail; img.src = url; });
    const c = Object.assign(document.createElement("canvas"), { width: img.naturalWidth * 2, height: img.naturalHeight * 2 });
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, 0, c.width, c.height);
    return await new Promise((ok) => c.toBlob(ok, "image/png"));
  } finally {
    URL.revokeObjectURL(url);
  }
}
