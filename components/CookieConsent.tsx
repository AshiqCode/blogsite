"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "cookie-consent";

type Choice = "granted" | "denied";

function gtagUpdate(choice: Choice) {
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag !== "function") return;
  const value = choice === "granted" ? "granted" : "denied";
  w.gtag("consent", "update", {
    ad_storage: value,
    analytics_storage: value,
    ad_user_data: value,
    ad_personalization: value,
  });
}

/**
 * Lightweight cookie-consent banner. Shown only when Analytics/AdSense are
 * configured (i.e. when non-essential cookies are actually in play). Works with
 * Google Consent Mode: consent defaults to "denied" (set in the layout), and we
 * flip it to "granted" only after the visitor accepts.
 */
export function CookieConsent({ enabled }: { enabled: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const stored = localStorage.getItem(STORAGE_KEY) as Choice | null;
    if (stored === "granted") {
      gtagUpdate("granted");
    } else if (!stored) {
      setVisible(true);
    }
  }, [enabled]);

  function decide(choice: Choice) {
    localStorage.setItem(STORAGE_KEY, choice);
    gtagUpdate(choice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-lift sm:flex-row sm:items-center sm:gap-5 sm:p-5">
        <p className="flex-1 text-sm leading-relaxed text-foreground/90">
          We use cookies to analyze traffic and, where enabled, personalize ads.
          You can accept or decline non-essential cookies. See our{" "}
          <Link href="/privacy" className="font-semibold text-accent hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => decide("denied")}
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-muted transition-colors hover:text-foreground"
          >
            Decline
          </button>
          <button
            onClick={() => decide("granted")}
            className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
