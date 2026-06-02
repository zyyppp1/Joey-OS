// lib/chat/store.ts — shared chat state (replaces the old module-level `let` globals).
// Tiny pub/sub + useSyncExternalStore so every chat instance (inline showcase +
// floating widget) stays in sync and survives open/close (resets on full reload).

import { useSyncExternalStore } from "react";

export type AiMsg = { role: "user" | "assistant"; content: string };
export type LiveMsg = { sender: "visitor" | "joey"; text: string };

function createStore<T>(initial: T) {
  let state = initial;
  const subs = new Set<() => void>();
  return {
    getSnapshot: () => state,
    set: (next: T) => {
      state = next;
      for (const s of subs) s();
    },
    update: (fn: (prev: T) => T) => {
      state = fn(state);
      for (const s of subs) s();
    },
    subscribe: (cb: () => void) => {
      subs.add(cb);
      return () => {
        subs.delete(cb);
      };
    },
  };
}

const AI_INTRO: AiMsg[] = [
  {
    role: "assistant",
    content:
      "Hi — I'm Joey's AI assistant. Ask me anything about his experience, projects, or tech stack.",
  },
];

const aiStore = createStore<AiMsg[]>(AI_INTRO);
const liveStore = createStore<LiveMsg[]>([]);

let sessionId = "";
export function getSessionId(): string {
  if (!sessionId) {
    sessionId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
  }
  return sessionId;
}

export function useAiMessages() {
  return useSyncExternalStore(
    aiStore.subscribe,
    aiStore.getSnapshot,
    aiStore.getSnapshot
  );
}
export const aiChat = {
  append: (m: AiMsg) => aiStore.update((p) => [...p, m]),
};

export function useLiveMessages() {
  return useSyncExternalStore(
    liveStore.subscribe,
    liveStore.getSnapshot,
    liveStore.getSnapshot
  );
}
export const liveChat = {
  get: liveStore.getSnapshot,
  set: liveStore.set,
  append: (m: LiveMsg) => liveStore.update((p) => [...p, m]),
};
