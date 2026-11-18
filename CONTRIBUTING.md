# Contributing

Thanks for helping make UML Studio better!

1. Fork and clone the repo, then `npm install`.
2. Copy `.env.example` to `.env.local` and add Clerk keys (`npx clerk@latest init` creates free dev keys).
3. `npm run dev`, make your change, and run `npm run lint && npm run build` before opening a PR.

**Guidelines**

- Keep PRs small and focused; describe the *why*.
- Match the existing style (TypeScript, Tailwind, small components).
- UI changes: include a before/after screenshot and check both light and dark mode.

**Good first issues:** new templates in `src/lib/examples.ts`, more keywords in `src/lib/plantuml-lang.ts`, accessibility improvements.
