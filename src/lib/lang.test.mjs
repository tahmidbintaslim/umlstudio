// Run: node --experimental-strip-types src/lib/lang.test.mjs
import assert from "node:assert/strict";
import { detectLang } from "./lang.ts";

assert.equal(detectLang("@startuml\nA -> B\n@enduml"), "plantuml");
assert.equal(detectLang("flowchart LR\n A --> B"), "mermaid");
assert.equal(detectLang("%% comment\nsequenceDiagram\n A->>B: hi"), "mermaid");
assert.equal(detectLang("---\ntitle: x\n---\nerDiagram\n A ||--o{ B : has"), "mermaid");
assert.equal(detectLang("graphql is not mermaid"), "plantuml");
assert.equal(detectLang(""), "plantuml");
console.log("lang ok");
