// Run: node --experimental-strip-types src/lib/diagram-pages.test.mjs
import assert from "node:assert/strict";
import { DIAGRAM_PAGES } from "./diagram-pages.ts";
import { EXAMPLES } from "./examples.ts";

const names = new Set(EXAMPLES.map((e) => e.name));
const slugs = new Set();
for (const p of DIAGRAM_PAGES) {
  assert.ok(names.has(p.template), `${p.slug}: unknown template "${p.template}"`);
  assert.match(p.slug, /^[a-z0-9-]+$/, `${p.slug}: bad slug`);
  assert.ok(!slugs.has(p.slug), `${p.slug}: duplicate slug`);
  slugs.add(p.slug);
}
console.log(`diagram pages ok (${DIAGRAM_PAGES.length})`);
