"use client";

import { useActionState } from "react";
import { saveSettings, type SettingsFormState } from "@/app/admin/settings/actions";
import type { SiteSettings } from "@/lib/types";

const initial: SettingsFormState = {};

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-accent"
      />
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-xl border border-border bg-white p-5">
      <legend className="px-1 text-sm font-semibold">{title}</legend>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction, pending] = useActionState(saveSettings, initial);

  return (
    <form action={formAction} className="space-y-6">
      {state.ok && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Settings saved.
        </p>
      )}
      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <Section title="General">
        <Field label="Website Title" name="site_title" defaultValue={settings.site_title} />
        <Field label="Tagline" name="tagline" defaultValue={settings.tagline} />
        <Field label="Logo URL" name="logo_url" type="url" defaultValue={settings.logo_url} />
        <Field label="Favicon URL" name="favicon_url" type="url" defaultValue={settings.favicon_url} />
      </Section>

      <fieldset className="rounded-xl border border-border bg-white p-5">
        <legend className="px-1 text-sm font-semibold">About</legend>
        <textarea
          name="about"
          rows={5}
          defaultValue={settings.about ?? ""}
          placeholder="Tell visitors about yourself and this blog…"
          className="w-full resize-y rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </fieldset>

      <Section title="Contact">
        <Field label="Contact Email" name="contact_email" type="email" defaultValue={settings.contact_email} />
        <Field label="Contact Phone" name="contact_phone" defaultValue={settings.contact_phone} />
      </Section>

      <Section title="Social Media Links">
        <Field label="Twitter / X" name="social_twitter" type="url" defaultValue={settings.social_twitter} placeholder="https://twitter.com/…" />
        <Field label="Facebook" name="social_facebook" type="url" defaultValue={settings.social_facebook} placeholder="https://facebook.com/…" />
        <Field label="Instagram" name="social_instagram" type="url" defaultValue={settings.social_instagram} placeholder="https://instagram.com/…" />
        <Field label="GitHub" name="social_github" type="url" defaultValue={settings.social_github} placeholder="https://github.com/…" />
        <Field label="LinkedIn" name="social_linkedin" type="url" defaultValue={settings.social_linkedin} placeholder="https://linkedin.com/in/…" />
      </Section>

      <fieldset className="rounded-xl border border-border bg-white p-5">
        <legend className="px-1 text-sm font-semibold">Footer</legend>
        <input
          name="footer_text"
          defaultValue={settings.footer_text ?? ""}
          placeholder="© 2026 My Blog. All rights reserved."
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </fieldset>

      <Section title="SEO & Analytics">
        <Field label="Default SEO Title" name="seo_title" defaultValue={settings.seo_title} placeholder="Falls back to the website title" />
        <Field label="SEO Keywords" name="seo_keywords" defaultValue={settings.seo_keywords} placeholder="blog, tech, tutorials" />
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">
            Default SEO Description
          </label>
          <textarea
            name="seo_description"
            rows={2}
            defaultValue={settings.seo_description ?? ""}
            placeholder="A short description of your blog shown in Google results."
            className="w-full resize-y rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
        <Field label="Google Analytics ID" name="google_analytics_id" defaultValue={settings.google_analytics_id} placeholder="G-XXXXXXXXXX" />
        <Field label="Google Search Console verification" name="google_verification" defaultValue={settings.google_verification} placeholder="verification token" />
      </Section>

      <Section title="Google AdSense">
        <div className="sm:col-span-2">
          <Field
            label="AdSense Publisher ID"
            name="adsense_publisher_id"
            defaultValue={settings.adsense_publisher_id}
            placeholder="ca-pub-XXXXXXXXXXXXXXXX"
          />
          <p className="mt-2 text-xs text-zinc-500">
            When set, the AdSense verification script and account meta tag are added
            site-wide, and <code>/ads.txt</code> is served automatically — everything
            Google needs to review and approve your site.
          </p>
        </div>
      </Section>

      <div className="sticky bottom-4 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-accent-hover disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
