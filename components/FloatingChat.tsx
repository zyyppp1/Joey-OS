"use client";

import { useState } from "react";
import { AiChatPanel } from "./chat/AiChatPanel";
import { LiveChatPanel } from "./chat/LiveChatPanel";

type Tab = "ai" | "live";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("ai");

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-fg text-lg text-bg shadow-lg transition-transform hover:scale-105"
      >
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[32rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
          <div className="flex border-b border-border">
            {(["ai", "live"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  tab === t ? "text-fg" : "text-muted hover:text-fg"
                }`}
              >
                {t === "ai" ? "AI Assistant" : "Live Chat"}
              </button>
            ))}
          </div>
          <div className="min-h-0 flex-1 p-4">
            {tab === "ai" ? <AiChatPanel /> : <LiveChatPanel />}
          </div>
        </div>
      )}
    </>
  );
}
