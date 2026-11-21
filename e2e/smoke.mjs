// Signed-out smoke test against a running or deployed site (no secrets needed).
// Run: node e2e/smoke.mjs https://umlstudio.vercel.app
import assert from "node:assert/strict";
import { chromium } from "playwright";

const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

const step = async (name, fn) => { await fn(); console.log("✓", name); };

try {
  for (const path of ["/", "/diagrams", "/diagrams/er-diagram", "/gallery", "/sign-in", "/robots.txt", "/sitemap.xml"])
    await step(`GET ${path}`, async () => assert.equal((await page.request.get(BASE + path)).status(), 200));

  await step("editor renders the default diagram", async () => {
    await page.goto(BASE + "/app");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.locator('img[alt$=" diagram"]').first().waitFor({ timeout: 20000 });
  });

  for (const name of ["Flowchart", "Architecture (D2)", "Order process (BPMN)", "Dependency graph"]) {
    await step(`template "${name}" renders`, async () => {
      await page.getByText("Templates").click();
      await page.getByRole("button", { name, exact: true }).click();
      await page.waitForTimeout(4000);
      assert.equal(await page.getByText("Syntax error").isVisible(), false);
    });
  }

  await step("AI asks signed-out users to sign in", async () => {
    await page.goto(BASE + "/app?ai=1");
    await page.getByRole("button", { name: "Sign in to use AI" }).waitFor({ timeout: 10000 });
  });

  await step("whiteboard loads", async () => {
    await page.goto(BASE + "/board");
    await page.locator(".excalidraw").first().waitFor({ timeout: 20000 });
  });

  await step("admin API is hidden from the public", async () => {
    assert.equal((await page.request.get(BASE + "/api/admin")).status(), 404);
  });

  assert.deepEqual(errors, [], "uncaught page errors");
  console.log("smoke ok");
} finally {
  await browser.close();
}
