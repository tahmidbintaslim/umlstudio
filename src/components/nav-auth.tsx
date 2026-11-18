"use client";

import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";

// Client-side auth state keeps the landing page fully static (no server-rendered auth to resume).
export function NavAuth() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return null;
  return isSignedIn ? <UserButton /> : (
    <Link href="/sign-in" className="hidden h-9 items-center rounded-md px-3 text-sm hover:bg-muted sm:flex">Sign in</Link>
  );
}
