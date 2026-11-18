import { SignIn } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth-shell";

export const metadata = { title: "Sign in · UML Studio" };

// Hash routing: a plain static page, no catch-all route to partially prerender.
export default function Page() {
  return <AuthShell><SignIn routing="hash" /></AuthShell>;
}
