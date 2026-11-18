import Link from "next/link";
import { Logo } from "@/components/logo";
import { AdminStats } from "@/components/admin-stats";

export const metadata = { title: "Admin · UML Studio", robots: { index: false } };

// Static shell; stats load client-side from /api/admin, which enforces ADMIN_EMAILS.
export default function AdminPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-8 p-6">
      <header className="flex items-center justify-between">
        <Link href="/"><Logo /></Link>
        <Link href="/app" className="text-sm text-fg/60 hover:text-fg">Open editor →</Link>
      </header>
      <AdminStats />
    </main>
  );
}
