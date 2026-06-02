"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useAiMessages, aiChat } from "@/lib/chat/store";

export type AiChatHandle = { send: (text: string) => void };

const AWS_API_URL = process.env.NEXT_PUBLIC_AWS_API_URL || "";

export const AiChatPanel = forwardRef<AiChatHandle, { className?: string }>(
  function AiChatPanel({ className = "" }, ref) {
    const messages = useAiMessages();
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, typing]);

    const send = async (text: string) => {
      const t = text.trim();
      if (!t || typing) return;
      aiChat.append({ role: "user", content: t });
      if (!AWS_API_URL) {
        aiChat.append({
          role: "assistant",
          content: "The assistant isn't connected in this environment yet.",
        });
        return;
      }
      setTyping(true);
      try {
        const res = await fetch(AWS_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: t }),
        });
        if (res.status === 429) {
          aiChat.append({
            role: "assistant",
            content: "Rate limit reached — give it a moment and try again.",
          });
          return;
        }
        if (!res.ok) throw new Error("request failed");
        const data = await res.json();
        aiChat.append({ role: "assistant", content: data.reply ?? "(no response)" });
      } catch {
        aiChat.append({
          role: "assistant",
          content: "Couldn't reach the AI right now — try again, or use live chat.",
        });
      } finally {
        setTyping(false);
      }
    };

    useImperativeHandle(ref, () => ({ send }));

    const onSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const t = input;
      setInput("");
      send(t);
    };

    return (
      <div className={`flex h-full flex-col ${className}`}>
        <div
          className="flex-1 space-y-3 overflow-y-auto pr-1 text-sm leading-relaxed"
          role="log"
          aria-live="polite"
          aria-atomic="false"
          aria-busy={typing}
        >
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-right" : ""}>
              <span
                className={
                  m.role === "user"
                    ? "inline-block max-w-[85%] rounded-2xl bg-fg px-3 py-2 text-left text-bg"
                    : "inline-block max-w-[85%] rounded-2xl border border-border bg-bg px-3 py-2"
                }
              >
                {m.content}
              </span>
            </div>
          ))}
          {typing && (
            <p className="font-mono text-xs text-muted">
              <span className="text-terminal">AI</span> is thinking
              <span className="animate-pulse">…</span>
            </p>
          )}
          <div ref={endRef} />
        </div>
        <form onSubmit={onSubmit} className="mt-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about my work…"
            aria-label="Ask the AI assistant about Joey's work"
            className="min-w-0 flex-1 rounded-full border border-border bg-surface px-4 py-2 text-sm outline-none transition-colors focus:border-fg"
          />
          <button
            type="submit"
            disabled={typing}
            className="rounded-full bg-fg px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    );
  }
);
