import { db } from "@drizzle";
import { pushSubscription } from "@drizzle/schema";
import { eq, and } from "drizzle-orm";

export class pushService {
  async register(
    userId: number,
    endpoint: string,
    keys: { p256dh: string; auth: string },
    browserInfo?: {
      userAgent?: string;
      browser?: string;
      version?: string;
      os?: string;
      deviceType?: string;
    },
  ) {
    const existing = await db.query.pushSubscription.findFirst({
      where: eq(pushSubscription.endpoint, endpoint),
    });

    if (existing) {
      const [updated] = await db
        .update(pushSubscription)
        .set({ keys, userId, browserInfo: browserInfo as any })
        .where(eq(pushSubscription.id, existing.id))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(pushSubscription)
      .values({
        userId,
        endpoint,
        keys,
        browserInfo: (browserInfo || {}) as any,
      })
      .returning();

    return created;
  }

  async unregister(userId: number, subscriptionId: number) {
    const sub = await db.query.pushSubscription.findFirst({
      where: and(
        eq(pushSubscription.id, subscriptionId),
        eq(pushSubscription.userId, userId),
      ),
    });

    if (!sub) return false;

    await db
      .delete(pushSubscription)
      .where(eq(pushSubscription.id, subscriptionId));
    return true;
  }

  async list(userId: number) {
    return db.query.pushSubscription.findMany({
      where: eq(pushSubscription.userId, userId),
    });
  }

  async getSubscriptionsByParentId(parentId: number) {
    return db.query.pushSubscription.findMany({
      where: eq(pushSubscription.userId, parentId),
    });
  }
}
