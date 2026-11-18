import Link from "next/link";
import { Logo } from "./logo";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="dot-grid flex min-h-dvh flex-col items-center justify-center gap-8 bg-bg p-4">
      <Link href="/" aria-label="UML Studio home"><Logo /></Link>
      {children}
      <Link href="/app" className="text-sm text-fg/60 hover:text-fg">Continue without an account →</Link>
    </main>
  );
}
