import type { Metadata } from "next";
import { BoardLoader } from "@/components/board-loader";

export const metadata: Metadata = { title: "Whiteboard · UML Studio" };

export default function BoardPage() {
  return <BoardLoader />;
}
