import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const endpoint = body?.endpoint as string | undefined;
    const p256dh = body?.keys?.p256dh as string | undefined;
    const auth = body?.keys?.auth as string | undefined;
    if (!endpoint || !p256dh || !auth) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }
    const supabase = await createClient();
    await supabase
      .from("push_subscriptions")
      .upsert({ endpoint, p256dh, auth }, { onConflict: "endpoint" });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const endpoint = body?.endpoint as string | undefined;
    if (endpoint) {
      const supabase = await createClient();
      await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
