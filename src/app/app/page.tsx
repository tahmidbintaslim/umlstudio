import type { Metadata } from "next";
import { EditorApp } from "@/components/editor-app";

export const metadata: Metadata = { title: "Editor · UML Studio" };

export default function EditorPage() {
  return <EditorApp />;
}
