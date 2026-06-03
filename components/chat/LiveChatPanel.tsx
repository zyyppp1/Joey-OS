"use client";

import React, { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import { useLiveMessages, liveChat, getSessionId, type LiveMsg } from "@/lib/chat/store";

const AWS_API_URL = process.env.NEXT_PUBLIC_AWS_API_URL || "";

const INTRO: LiveMsg[] = [
  {
    sender: "joey",
    text: "This pings Joey's phone directly. Leave a message — if he's around he'll reply right here in real time.",
  },
];

export function LiveChatPanel({ className = "" }: { className?: string }) {
  const convo = useLiveMessages();
  const messages = [...INTRO, ...convo];
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const pusherRef = useRef<Pusher | null>(null);

  useEffect(() => {
    const id = getSessionId();
    setSessionId(id);

    const connect = () => {
      pusherRef.current?.disconnect();
      const key = process.env.NEXT_PUBLIC_PUSHER_KEY || "";
      const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "";
      if (!key) return;
      const pusher = new Pusher(key, { cluster });
      const channel = pusher.subscribe(`session-${id}`);
      channel.bind("new_message", (data: LiveMsg) => {
        liveChat.append({ sender: data.sender === "joey" ? "joey" : "visitor", text: data.text });
      });
      pusherRef.current = pusher;
    };

    // Authoritative rebuild from the server's timestamp-sorted history.
    const recover = async () => {
      if (!AWS_API_URL) return;
      try {
        const res = await fetch(AWS_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "get_live_messages", session_id: id }),
        });
        const data = await res.json();
        if (!Array.isArray(data.messages)) return;
        const sorted = [...data.messages].sort((a, b) =>
          String(a.Timestamp || "").localeCompare(String(b.Timestamp || ""))
        );
        const rebuilt: LiveMsg[] = sorted.map((m: { Sender: string; Text: string }) => ({
          sender: m.Sender === "joey" ? "joey" : "visitor",
          text: m.Text,
        }));
        // Non-destructive: only replace when the server is at least as complete.
        if (rebuilt.length >= liveChat.get().length) liveChat.set(rebuilt);
      } catch {
        /* offline / not configured */
      }
    };

    connect();
    recover();
    const onVis = () => {
      if (document.visibilityState === "visible") {
        connect();
        recover();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      pusherRef.current?.disconnect();
      pusherRef.current = null;
    };
  }, []);

  // Scroll the list itself (not scrollIntoView, which would also scroll the page).
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [convo]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = input.trim();
    if (!t || sending) return;
    setInput("");
    liveChat.append({ sender: "visitor", text: t });
    setSending(true);
    if (!AWS_API_URL) {
      liveChat.append({
        sender: "joey",
        text: "[live chat isn't connected in this environment yet]",
      });
      setSending(false);
      return;
    }
    try {
      await fetch(AWS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_telegram",
          session_id: sessionId || getSessionId(),
          message: t,
        }),
      });
    } catch {
      liveChat.append({ sender: "joey", text: "[couldn't send — check your connection]" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={`flex h-full flex-col ${className}`}>
      <div className="mb-3 flex items-center gap-2 font-mono text-xs text-muted">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-terminal" aria-hidden="true" />
        live to Joey&apos;s phone
      </div>
      <div
        ref={listRef}
        className="flex-1 space-y-3 overflow-y-auto pr-1 text-sm leading-relaxed"
        role="log"
        aria-live="polite"
        aria-atomic="false"
        aria-busy={sending}
      >
        {messages.map((m, i) => (
          <div key={i} className={m.sender === "visitor" ? "text-right" : ""}>
            <span
              className={
                m.sender === "visitor"
                  ? "inline-block max-w-[85%] rounded-2xl bg-fg px-3 py-2 text-left text-bg"
                  : "inline-block max-w-[85%] rounded-2xl border border-border bg-bg px-3 py-2"
              }
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit} className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message Joey…"
          aria-label="Message Joey directly"
          className="min-w-0 flex-1 rounded-full border border-border bg-surface px-4 py-2 text-sm outline-none transition-colors focus:border-fg"
        />
        <button
          type="submit"
          disabled={sending}
          className="rounded-full bg-fg px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
