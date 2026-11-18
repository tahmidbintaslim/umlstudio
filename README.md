<div align="center">

# UML Studio

**A fast, beautiful, open-source PlantUML editor.**
Type on the left, see the diagram on the right — instantly.

[![MIT License](https://img.shields.io/badge/license-MIT-6366f1.svg)](LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![GitHub stars](https://img.shields.io/github/stars/tahmidbintaslim/umlstudio?style=social)](https://github.com/tahmidbintaslim/umlstudio)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/screenshot-dark.png">
  <img alt="UML Studio screenshot" src="docs/screenshot-light.png" width="900">
</picture>

</div>

## Why UML Studio?

| | PlantText & co. | **UML Studio** |
|---|---|---|
| Live preview as you type | ❌ click "Refresh" | ✅ debounced, instant |
| Resizable split view, mobile layout | ❌ | ✅ |
| Zoom, fit-to-screen, Ctrl+wheel zoom | ❌ | ✅ |
| Syntax highlighting | basic | ✅ PlantUML-aware |
| Inline syntax-error indicator | ❌ | ✅ |
| Export SVG · PNG · ASCII · `.puml` | partial | ✅ |
| Share by link (no account, no server storage) | ❌ | ✅ |
| Save diagrams to your account | ❌ | ✅ Clerk auth + Postgres |
| Dark mode | ❌ | ✅ |
| Self-hostable, MIT licensed | ❌ | ✅ |

## Features

- ⚡ **Live rendering** — every keystroke, debounced, with in-flight requests cancelled.
- 🎨 **Polished editor** — CodeMirror 6 with PlantUML highlighting, light/dark themes.
- 🔗 **Share links** — the diagram is encoded in the URL hash, so nothing is stored server-side.
- ☁️ **Cloud save** — sign in with Clerk, press <kbd>Ctrl</kbd>/<kbd>⌘</kbd>+<kbd>S</kbd>, open saved diagrams from *My diagrams*.
- 💾 **Never lose work** — your draft autosaves to the browser.
- 📚 **10 starter templates** — sequence, class, activity, use case, component, state, ER, mind map, Gantt, JSON.
- 🔒 **Safe preview** — diagrams render as images, so markup inside an SVG can't run script.

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
| `DATABASE_URL` | no | Postgres for cloud save. Run [`schema.sql`](schema.sql) once. Without it, the editor, drafts and share links still work. |
| `NEXT_PUBLIC_PLANTUML_SERVER` | no | Your own PlantUML server (default: public plantuml.com) |
| `NEXT_PUBLIC_GITHUB_REPO` | no | `owner/repo` for the star button |

### Self-host the renderer (optional)

```bash
docker run -d -p 8080:8080 plantuml/plantuml-server:jetty
# then: NEXT_PUBLIC_PLANTUML_SERVER=http://localhost:8080
```

## Deploy

Deploy to [Vercel](https://vercel.com/new) (or any Node host): import the repo, add the environment variables, done.

## Tech stack

[Next.js 16](https://nextjs.org) (App Router) · [React 19](https://react.dev) · [Tailwind CSS 4](https://tailwindcss.com) · [Clerk](https://clerk.com) · [CodeMirror 6](https://codemirror.net) · [postgres.js](https://github.com/porsager/postgres) · [PlantUML](https://plantuml.com)

## Contributing

Contributions are very welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).

## Support the project

If UML Studio saves you time, please **⭐ star the repo** — it helps others find it.

## License

[MIT](LICENSE) © Tahmid Bin Taslim Rafi
