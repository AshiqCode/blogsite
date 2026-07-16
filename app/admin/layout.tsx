import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · Admin" },
  robots: { index: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/admin");

  return (
    <div className="flex min-h-screen bg-zinc-50 text-foreground">
      <AdminSidebar userEmail={user.email ?? ""} />
      {/* pt-16 on mobile clears the fixed top bar; reset on desktop (sidebar is side-docked). */}
      <div className="flex-1 pt-16 lg:pt-0 lg:pl-64">
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
