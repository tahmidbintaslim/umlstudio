<div align="center">

# UML Studio

**Free, open-source diagram studio with AI. PlantUML, Mermaid, text-to-diagram and photo-to-diagram.**
Write code, describe it in plain English, or snap a whiteboard photo, and get a clean, editable diagram.

**[▶ Try it live](https://umlstudio.vercel.app)** · [Diagram types](https://umlstudio.vercel.app/diagrams) · [Whiteboard](https://umlstudio.vercel.app/board)

[![MIT License](https://img.shields.io/badge/license-MIT-6366f1.svg)](LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![GitHub stars](https://img.shields.io/github/stars/tahmidbintaslim/umlstudio?style=social)](https://github.com/tahmidbintaslim/umlstudio)

<img alt="UML Studio demo: typing PlantUML with live preview, an AWS template with official icons, and a Mermaid flowchart turned into editable whiteboard shapes" src="docs/demo.gif" width="900">

</div>

## Why UML Studio?

Students and developers juggle draw.io, Excalidraw, Miro, Mermaid Live and PlantText, and each covers only part of the job.
UML Studio puts **diagrams-as-code, AI and export in one free, open-source place.**

- **Four ways in.** Write PlantUML or Mermaid, **sketch** on a hand-drawn style whiteboard, **describe** the diagram in plain English, or **upload a photo** of a whiteboard, hand sketch or screenshot. AI turns it into a clean, editable diagram.
- **Code ⇄ canvas.** Convert any Mermaid diagram into editable whiteboard shapes (powered by [Excalidraw](https://github.com/excalidraw/excalidraw)), and let AI draw straight onto the board.
- **Cloud architecture.** Official AWS, Azure, GCP and Kubernetes icons, plus C4 models.
- **Fix with AI.** Syntax error? One click repairs it.
- **Two languages, one editor.** PlantUML, Mermaid and Graphviz, detected automatically, with 24 templates.
- **Live preview** as you type, resizable split view, zoom and fit, dark mode, mobile layout.
- **Export** SVG, PNG, ASCII art, `.puml` / `.mmd`.
- **Share links** that hold the whole diagram in the URL, with nothing stored server-side.
- **Cloud library.** Sign in (GitHub, Google or email) and save every diagram.
- **Safe preview.** Diagrams render as images, so markup inside an SVG can't run script.
- **MIT licensed** and self-hostable, including your own PlantUML server.

## Roadmap

Ideas and votes welcome in [issues](https://github.com/tahmidbintaslim/umlstudio/issues).

- [x] PlantUML + Mermaid editor with live preview
- [x] AI: text → diagram, image → diagram, fix errors, edit by instruction
- [x] Cloud save, share links, exports
- [x] Whiteboard with code → canvas conversion and AI drawing
- [x] AWS / Azure / GCP / Kubernetes / C4 templates
- [x] Graphviz/DOT and C4
- [x] Whiteboard → code and PlantUML → whiteboard (AI)
- [x] Diagram from a SQL schema, OpenAPI spec or source code (AI)
- [ ] More languages: D2, BPMN
- [ ] Explain-this-diagram
- [ ] Real-time collaboration and comments
- [ ] Public template gallery from the community
- [ ] VS Code extension and embeddable diagrams for docs

## Quick start

```bash
git clone https://github.com/tahmidbintaslim/umlstudio.git
cd umlstudio
npm install
cp .env.example .env.local   # add your Clerk keys
npm run dev
```

Open http://localhost:3000.

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | yes | From the [Clerk dashboard](https://dashboard.clerk.com) |
| `AI_GATEWAY_API_KEY` | local only | AI features use [Vercel AI Gateway](https://vercel.com/ai-gateway). On Vercel it authenticates automatically; locally create a key in the Vercel dashboard. |
| `AI_MODEL` | no | Gateway model id. Default `openai/gpt-5-mini` works on the free tier; with paid credits try `anthropic/claude-sonnet-5.5`. |
| `DATABASE_URL` | no | Postgres for cloud save. Run [`schema.sql`](schema.sql) once. Without it, the editor, drafts and share links still work. |
| `NEXT_PUBLIC_PLANTUML_SERVER` | no | Your own PlantUML server (default: public plantuml.com) |
| `NEXT_PUBLIC_GITHUB_REPO` | no | `owner/repo` for the star button |

### Self-host the renderer (optional)

```bash
docker run -d -p 8080:8080 plantuml/plantuml-server:jetty
# then: NEXT_PUBLIC_PLANTUML_SERVER=http://localhost:8080
```

### Analytics and the admin dashboard

Analytics are free and first-party: each page view is stored in your own Postgres (`page_views` table) with a daily-rotating, cookieless visitor hash, with no third-party script and no IPs stored. Set `ANALYTICS_SALT` to any random string.

`/admin` shows visitors, page views, top pages, referrers, countries, sign-ups, saved diagrams and AI usage. Access is controlled by Clerk:
1. In Clerk → **Sessions → Customize session token**, add `{"metadata": "{{user.public_metadata}}"}`.
2. In Clerk → **Users**, open your user and set public metadata to `{"role": "admin"}`.

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftahmidbintaslim%2Fumlstudio&env=NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,CLERK_SECRET_KEY&envDescription=Clerk%20keys%20from%20dashboard.clerk.com)

Or any Node host: import the repo, add the environment variables, done.

## Tech stack

[Next.js 16](https://nextjs.org) (App Router) · [AI SDK](https://ai-sdk.dev) + Vercel AI Gateway · [Mermaid](https://mermaid.js.org) · [Excalidraw](https://github.com/excalidraw/excalidraw) · [React 19](https://react.dev) · [Tailwind CSS 4](https://tailwindcss.com) · [Clerk](https://clerk.com) · [CodeMirror 6](https://codemirror.net) · [postgres.js](https://github.com/porsager/postgres) · [PlantUML](https://plantuml.com)

## Contributing

Contributions are very welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).

## Support the project

If UML Studio saves you time, please **⭐ star the repo** — it helps others find it.

## License

[MIT](LICENSE) © Tahmid Bin Taslim Rafi
