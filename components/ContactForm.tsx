"use client";

import { useActionState, useEffect, useRef } from "react";
import { sendContactMessage, type ContactState } from "@/app/(site)/contact/actions";

const initial: ContactState = { ok: false };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    sendContactMessage,
    initial,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      {/* Honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      {state.ok && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Thanks! Your message has been sent — we’ll get back to you soon.
        </p>
      )}
      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold">Your name</label>
          <input
            name="name"
            required
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">Your email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold">Message</label>
        <textarea
          name="message"
          required
          rows={6}
          className="w-full resize-y rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
