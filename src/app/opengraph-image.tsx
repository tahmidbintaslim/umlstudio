import { ImageResponse } from "next/og";

export const alt = "UML Studio: AI diagrams from text, code or a photo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#0b0b0f", color: "#e4e4e7", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="8" fill="#6366f1" />
            <path d="M10 11h12M10 11l6 11M22 11l-6 11" stroke="#fff" strokeOpacity=".55" strokeWidth="1.6" fill="none" />
            <rect x="6" y="7.5" width="8" height="7" rx="2" fill="#fff" />
            <rect x="18" y="7.5" width="8" height="7" rx="2" fill="#fff" />
            <circle cx="16" cy="22.5" r="4" fill="#fff" />
          </svg>
          <span style={{ fontSize: 44, fontWeight: 700 }}>UML Studio</span>
        </div>
        <div style={{ marginTop: 48, fontSize: 68, fontWeight: 700, lineHeight: 1.1, display: "flex", flexWrap: "wrap" }}>
          Technical diagrams at the&nbsp;<span style={{ color: "#818cf8" }}>speed of thought</span>
        </div>
        <div style={{ marginTop: 32, fontSize: 30, color: "#a1a1aa" }}>
          PlantUML · Mermaid · AI from text or a photo · Free & open source
        </div>
      </div>
    ),
    size,
  );
}
