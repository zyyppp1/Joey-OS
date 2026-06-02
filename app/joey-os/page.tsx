import type { Metadata } from "next";
import Link from "next/link";
import JoeyOSExhibit from "@/components/legacy/JoeyOSExhibit";

export const metadata: Metadata = {
  title: "Joey OS (original)",
  description:
    "The original retro desktop-OS version of this portfolio — preserved as a playable exhibit.",
};

export default function JoeyOSPage() {
  return (
    <div className="fixed inset-0 z-[100] bg-white">
      <Link
        href="/"
        className="fixed right-4 top-4 z-[200] rounded-full bg-black/80 px-4 py-2 font-mono text-xs text-white backdrop-blur transition-colors hover:bg-black"
      >
        ← back to portfolio
      </Link>
      <JoeyOSExhibit />
    </div>
  );
}
