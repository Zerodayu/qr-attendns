import { env } from "@env";
import { db } from "../../drizzle";
import { parentStudent, pushSubscription } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

let _webpush: any = null;
async function getWebpush() {
  if (!_webpush) {
    const webpush = (await import("web-push")).default;
    webpush.setVapidDetails(env.VAPID_EMAIL, env.VAPID_PUBLIC_KEY, env.VAPID_PRIVATE_KEY);
    _webpush = webpush;
  }
  return _webpush;
}

export async function sendPushToParent(
  studentId: number,
  studentName: string,
  type: "in" | "out",
) {
  const parents = await db.query.parentStudent.findMany({
    where: eq(parentStudent.studentId, studentId),
  });

  if (parents.length === 0) return;

  const parentIds = parents.map((p) => p.parentId);
  const subscriptions: {
    id: number;
    userId: number;
    endpoint: string;
    keys: unknown;
  }[] = [];

  for (const pid of parentIds) {
    const subs = await db.query.pushSubscription.findMany({
      where: eq(pushSubscription.userId, pid),
    });
    subscriptions.push(...subs);
  }

  if (subscriptions.length === 0) return;

  const webpush = await getWebpush();
  const now = new Date().toLocaleTimeString();
  const title = type === "in" ? "Present" : "Checked Out";
  const body =
    type === "in"
      ? `${studentName} was marked present at ${now}.`
      : `${studentName} checked out at ${now}.`;

  for (const sub of subscriptions) {
    try {
      const keys = sub.keys as { p256dh: string; auth: string } | null;
      if (!keys?.p256dh || !keys?.auth) continue;
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys },
        JSON.stringify({ title, body }),
      );
    } catch (err: any) {
      if (err?.statusCode === 410 || err?.statusCode === 404) {
        await db
          .delete(pushSubscription)
          .where(eq(pushSubscription.id, sub.id));
      }
    }
  }
}
