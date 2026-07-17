import "server-only";
import webpush from "web-push";
import { createAdminClient } from "@/lib/supabase/server";

let configured = false;
function configure(): boolean {
  if (configured) return true;
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:admin@example.com";
  if (!pub || !priv) return false;
  webpush.setVapidDetails(subject, pub, priv);
  configured = true;
  return true;
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  icon?: string;
  tag?: string;
}

interface Sub {
  endpoint: string;
  p256dh: string;
  auth: string;
}

async function sendTo(sub: Sub, payload: PushPayload) {
  try {
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      JSON.stringify(payload),
    );
  } catch (e: unknown) {
    const code = (e as { statusCode?: number })?.statusCode;
    // Expired / unsubscribed — clean it up.
    if (code === 404 || code === 410) {
      try {
        const admin = createAdminClient();
        await admin
          .from("push_subscriptions")
          .delete()
          .eq("endpoint", sub.endpoint);
      } catch {
        /* ignore */
      }
    }
  }
}

/** Send a notification to every subscriber (e.g. a new post). */
export async function broadcastPush(payload: PushPayload): Promise<void> {
  if (!configure()) return;
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("push_subscriptions")
      .select("endpoint,p256dh,auth");
    await Promise.all(((data as Sub[]) ?? []).map((s) => sendTo(s, payload)));
  } catch {
    /* never let notifications break the main action */
  }
}

/** Send a notification to a single subscriber by endpoint (e.g. comment status). */
export async function pushToEndpoint(
  endpoint: string | null | undefined,
  payload: PushPayload,
): Promise<void> {
  if (!endpoint || !configure()) return;
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("push_subscriptions")
      .select("endpoint,p256dh,auth")
      .eq("endpoint", endpoint)
      .maybeSingle();
    if (data) await sendTo(data as Sub, payload);
  } catch {
    /* ignore */
  }
}
