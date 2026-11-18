export type Lang = "plantuml" | "mermaid";
export type Kind = Lang | "excalidraw";

// Mermaid sources open with a diagram keyword (optionally after %% comments or a --- config block);
// everything else is treated as PlantUML. Detecting from text means no schema or share-link changes.
const MERMAID_START =
  /^\s*(?:%%[^\n]*\n\s*)*(?:---[\s\S]*?---\s*)?(?:graph|flowchart|sequenceDiagram|classDiagram|stateDiagram(?:-v2)?|erDiagram|journey|gantt|pie|quadrantChart|requirementDiagram|gitGraph|C4Context|C4Container|C4Component|C4Dynamic|C4Deployment|mindmap|timeline|sankey-beta|xychart-beta|block-beta|packet-beta|kanban|architecture-beta|radar-beta|treemap-beta)\b/;

export const detectLang = (src: string): Lang => (MERMAID_START.test(src) ? "mermaid" : "plantuml");

// Whiteboard scenes are stored as Excalidraw JSON in the same diagrams table.
export const detectKind = (src: string): Kind =>
  /^\s*\{\s*"type"\s*:\s*"excalidraw"/.test(src) ? "excalidraw" : detectLang(src);
