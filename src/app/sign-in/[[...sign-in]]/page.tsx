import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth-shell";

export const metadata = { title: "Sign in · UML Studio" };

export default function Page() {
  return <AuthShell><Suspense><SignIn /></Suspense></AuthShell>;
}
