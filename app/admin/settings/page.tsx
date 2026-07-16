import type { Metadata } from "next";
import { getSettings } from "@/lib/queries";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Website Settings</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
