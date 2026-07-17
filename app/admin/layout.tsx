import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ConfirmProvider } from "@/components/admin/ConfirmProvider";

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
    <ConfirmProvider>
      <div className="flex min-h-screen bg-zinc-50 text-foreground">
        <AdminSidebar userEmail={user.email ?? ""} />
        {/* min-w-0 lets this flex column shrink to the viewport (prevents
            horizontal overflow / forced zoom-out on mobile). pt-16 clears the
            fixed mobile top bar; reset on desktop where the sidebar is docked. */}
        <div className="min-w-0 flex-1 pt-16 lg:pt-0 lg:pl-64">
          <main className="mx-auto max-w-5xl break-words px-4 py-8 sm:px-6">
            {children}
          </main>
        </div>
      </div>
    </ConfirmProvider>
  );
}
