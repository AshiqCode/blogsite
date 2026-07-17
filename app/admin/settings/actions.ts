"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export interface SettingsFormState {
  ok?: boolean;
  error?: string;
}

const field = (fd: FormData, key: string) => {
  const v = String(fd.get(key) ?? "").trim();
  return v || null;
};

export async function saveSettings(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdmin();
  const supabase = await createClient();

  const siteTitle = String(formData.get("site_title") ?? "").trim();
  if (!siteTitle) return { error: "Website title is required." };

  const record = {
    id: 1,
    site_title: siteTitle,
    tagline: field(formData, "tagline"),
    logo_url: field(formData, "logo_url"),
    favicon_url: field(formData, "favicon_url"),
    about: field(formData, "about"),
    contact_email: field(formData, "contact_email"),
    contact_phone: field(formData, "contact_phone"),
    social_twitter: field(formData, "social_twitter"),
    social_facebook: field(formData, "social_facebook"),
    social_instagram: field(formData, "social_instagram"),
    social_github: field(formData, "social_github"),
    social_linkedin: field(formData, "social_linkedin"),
    footer_text: field(formData, "footer_text"),
    seo_title: field(formData, "seo_title"),
    seo_description: field(formData, "seo_description"),
    seo_keywords: field(formData, "seo_keywords"),
    google_analytics_id: field(formData, "google_analytics_id"),
    google_verification: field(formData, "google_verification"),
    adsense_publisher_id: field(formData, "adsense_publisher_id"),
    comment_moderation:
      String(formData.get("comment_moderation") ?? "manual") === "auto"
        ? "auto"
        : "manual",
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("settings")
    .upsert(record, { onConflict: "id" });

  if (error) return { error: "Failed to save settings." };

  revalidatePath("/", "layout");
  return { ok: true };
}
