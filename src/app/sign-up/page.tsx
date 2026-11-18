import { SignUp } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth-shell";

export const metadata = { title: "Sign up · UML Studio" };

// Hash routing: a plain static page, no catch-all route to partially prerender.
export default function Page() {
  return <AuthShell><SignUp routing="hash" /></AuthShell>;
}
