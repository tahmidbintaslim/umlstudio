"use client";

import { useEffect } from "react";

// Share links used to be "/#<encoded>" before the editor moved to /app; keep them working.
export function LegacyHashRedirect() {
  useEffect(() => {
    if (location.hash.length > 20) location.replace(`/app${location.hash}`);
  }, []);
  return null;
}
