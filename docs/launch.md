# Launch kit

Ready-to-post copy for launching UML Studio. Post from your own accounts; adjust the voice to sound like you.
Links: app <https://umlstudio.vercel.app> · repo <https://github.com/tahmidbintaslim/umlstudio> · demo GIF `docs/demo.gif`.

**Suggested order:** Show HN (Tue–Thu, ~8–10am US Eastern) → Reddit the same day → dev.to article the next day → Product Hunt the following week (12:01am Pacific). Reply to every comment in the first few hours; that matters more than the post itself.

---

## Hacker News: Show HN

**Title** (80 chars max):
> Show HN: UML Studio – open-source PlantUML/Mermaid editor with a whiteboard and AI

**URL:** https://github.com/tahmidbintaslim/umlstudio

**First comment (post right after submitting):**
> Hi HN, I'm a student and kept bouncing between PlantText, Mermaid Live, draw.io and Excalidraw for coursework and side projects. Each does one part well, so I built one place that does all of it:
>
> - PlantUML, Mermaid and Graphviz with live preview, plus AWS/Azure/GCP/Kubernetes/C4 templates using the official icon sets
> - A hand-drawn whiteboard (Excalidraw under the hood). Any Mermaid diagram converts into editable shapes, and AI can turn a sketch back into code
> - AI that drafts a diagram from a sentence, a whiteboard photo, a SQL schema, an OpenAPI spec or source code, and fixes syntax errors in one click
> - Share links hold the whole diagram in the URL, so nothing is stored server-side unless you sign in to save
>
> Stack: Next.js 16, Clerk, Postgres (Neon), AI SDK. Rendering uses the public PlantUML server by default; you can point it at your own. MIT licensed.
>
> No account needed to use the editor or whiteboard; AI needs a free account (rate-limited, since I'm paying for it). Feedback very welcome, especially on what's missing compared to the tools you use today.

---

## Reddit

Read each subreddit's self-promotion rules first. Several only allow it on certain days or in a weekly thread. Lead with what's useful, not "please star".

**r/webdev** (Showoff Saturday only)
> **Title:** I built an open-source diagram tool: PlantUML + Mermaid + an Excalidraw whiteboard + AI, in one place
>
> Body: the HN comment above, shortened to the bullet list + one line on the stack + links. Attach the demo GIF.

**r/learnprogramming / r/computerscience / r/csMajors**
> **Title:** Free tool for UML/ER diagrams in your CS courses: write code, sketch, or snap a photo of the whiteboard
>
> I made this for my own software engineering and database classes. You can type PlantUML/Mermaid, start from templates (sequence, class, use case, ER, activity…), or take a photo of the lecture whiteboard and have AI redraw it as a clean, editable diagram. It's free and open source, with no account needed for the editor. Would love to hear what diagram types your courses use that I should add.

**r/devops / r/aws / r/sysadmin**
> **Title:** Architecture diagrams as code with official AWS/Azure/GCP/K8s icons, free and open source
>
> Focus on the cloud templates and C4, and mention diagrams live in text (diffable in PRs). Include the AWS template screenshot from `/diagrams/aws-architecture-diagram`.

---

## Product Hunt

- **Name:** UML Studio
- **Tagline** (60 chars): *Diagrams from code, a sketch, a sentence, or a photo*
- **Topics:** Developer Tools, Design Tools, Artificial Intelligence, Open Source, Education
- **Gallery:** demo GIF first, then the landing-page hero, the AWS template, the whiteboard, and the AI panel
- **Description:**
  > UML Studio is a free, open-source diagram studio for students and developers. Write PlantUML, Mermaid or Graphviz with live preview, sketch on a hand-drawn whiteboard, or let AI draw from a sentence, a whiteboard photo, a SQL schema or an OpenAPI spec. Convert code to editable shapes and sketches back to code. Official AWS, Azure, GCP, Kubernetes and C4 icons, with export to SVG/PNG.
- **Maker comment:** reuse the HN first comment, ending with a question: *"What's the diagram you draw most often?"*

---

## dev.to / Hashnode article

**Title:** *I was tired of switching between five diagram tools, so I built one (and open-sourced it)*

Outline:
1. The problem: PlantText for UML, Mermaid Live for READMEs, draw.io for cloud diagrams, Excalidraw for whiteboarding, plus copy-pasting between them.
2. What UML Studio does (demo GIF).
3. Three technical bits people like reading about:
   - Detecting PlantUML vs Mermaid vs Excalidraw from the text alone (`src/lib/lang.ts`).
   - Turning Mermaid into Excalidraw shapes, and AI turning a sketch back into Mermaid.
   - Cookieless first-party analytics in Postgres with a daily-rotating visitor hash.
4. What's next (roadmap) and a call for contributors and good first issues.
5. Links + "a ⭐ helps other students find it."

Tags: `opensource`, `webdev`, `nextjs`, `ai`

---

## X / Twitter thread

1. I built a free, open-source diagram studio: PlantUML + Mermaid + an Excalidraw whiteboard + AI, in one tab. 🧵 [demo GIF]
2. Write code with live preview. 24 templates including AWS, Azure, GCP, K8s and C4 with official icons.
3. Snap a photo of a whiteboard → AI redraws it as an editable diagram. Paste a SQL schema → ER diagram.
4. Turn any Mermaid diagram into hand-drawn shapes, and sketches back into code.
5. MIT licensed, built with Next.js + Clerk + Postgres. Try it: umlstudio.vercel.app · ⭐ github.com/tahmidbintaslim/umlstudio

---

## LinkedIn

> I just launched UML Studio, a free, open-source diagram tool I built for students and developers.
>
> It combines diagrams-as-code (PlantUML, Mermaid, Graphviz), a hand-drawn whiteboard, and AI that turns a sentence, a whiteboard photo or a SQL schema into an editable diagram. It also includes official AWS, Azure and GCP icons for architecture diagrams.
>
> Built with Next.js, Clerk, Postgres and the AI SDK. I'd love feedback from anyone who draws system designs or UML for a living.
>
> 🔗 umlstudio.vercel.app
