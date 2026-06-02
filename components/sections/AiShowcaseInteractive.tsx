"use client";

import React, { useRef } from "react";
import { AiChatPanel, type AiChatHandle } from "../chat/AiChatPanel";

const EXAMPLES = [
  "What did Joey build at SpinnrTech?",
  "Is he authorised to work in the UK?",
  "What's his strongest tech stack?",
];

export function AiShowcaseInteractive() {
  const ref = useRef<AiChatHandle>(null);

  return (
    <div className="grid gap-6 sm:grid-cols-[1fr_22rem]">
      <div>
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted">
          Tap to ask
        </p>
        <ul className="space-y-2">
          {EXAMPLES.map((q) => (
            <li key={q}>
              <button
                onClick={() => ref.current?.send(q)}
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-left font-mono text-sm text-muted transition-colors hover:border-fg hover:text-fg"
              >
                <span className="text-terminal">&gt;</span> {q}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="h-[26rem] rounded-2xl border border-border bg-surface p-4">
        <AiChatPanel ref={ref} />
      </div>
    </div>
  );
}
