import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth-shell";

export const metadata = { title: "Sign up · UML Studio" };

export default function Page() {
  return <AuthShell><Suspense><SignUp /></Suspense></AuthShell>;
}
