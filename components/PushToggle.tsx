"use client";

import { useEffect, useState } from "react";

const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) output[i] = raw.charCodeAt(i);
  return output;
}

type State = "unsupported" | "default" | "subscribed" | "busy" | "denied";

export function PushToggle({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<State>("default");

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window) ||
      !PUBLIC_KEY
    ) {
      setState("unsupported");
      return;
    }
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => {
        if (Notification.permission === "denied") setState("denied");
        else setState(sub ? "subscribed" : "default");
        if (sub) localStorage.setItem("push-endpoint", sub.endpoint);
      })
      .catch(() => setState("default"));
  }, []);

  async function enable() {
    setState("busy");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState(permission === "denied" ? "denied" : "default");
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY!),
      });
      const json = sub.toJSON();
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });
      localStorage.setItem("push-endpoint", sub.endpoint);
      setState("subscribed");
    } catch {
      setState("default");
    }
  }

  async function disable() {
    setState("busy");
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      localStorage.removeItem("push-endpoint");
      setState("default");
    } catch {
      setState("subscribed");
    }
  }

  if (state === "unsupported") return null;

  const base = compact
    ? "rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-semibold shadow-sm transition-colors"
    : "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors";

  if (state === "denied") {
    return (
      <span className={`${base} text-muted`} title="Enable notifications in your browser settings">
        🔕 Notifications blocked
      </span>
    );
  }

  if (state === "subscribed") {
    return (
      <button onClick={disable} className={`${base} text-muted hover:text-accent`}>
        🔔 Notifications on · turn off
      </button>
    );
  }

  return (
    <button
      onClick={enable}
      disabled={state === "busy"}
      className={`${base} bg-accent text-white hover:bg-accent-hover disabled:opacity-60`}
    >
      {state === "busy" ? "Enabling…" : "🔔 Notify me of new posts"}
    </button>
  );
}
