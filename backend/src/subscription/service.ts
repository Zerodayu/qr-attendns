import { Xendit } from "xendit-node";
import { eq } from "drizzle-orm";
import { env } from "@env";
import db from "@drizzle";
import { subscription, user } from "@drizzle/schema";

const PLAN_PRICES: Record<string, number> = {
  essential: 20000,
  premium: 35000,
};

const SUBSCRIPTION_DURATION_DAYS = 30;

let xenditInstance: Xendit | null = null;

function getXendit() {
  if (!xenditInstance) {
    xenditInstance = new Xendit({ secretKey: env.XENDIT_SECRET_API_KEY });
  }
  return xenditInstance;
}

export async function createInvoice(
  userId: number,
  plan: string,
  payerEmail?: string,
) {
  const price = PLAN_PRICES[plan];
  if (!price) throw new Error("Invalid plan");

  const existing = await db
    .select()
    .from(subscription)
    .where(eq(subscription.userId, userId))
    .limit(1)
    .then((r) => r[0]);

  if (existing?.status === "pending") {
    return {
      invoiceUrl: existing.xenditInvoiceId
        ? `https://checkout.xendit.co/web/${existing.xenditInvoiceId}`
        : null,
      invoiceId: existing.xenditInvoiceId,
    };
  }

  const externalId = `sub-${userId}-${plan}-${Date.now()}`;

  const { Invoice } = getXendit();
  const invoice = await Invoice.createInvoice({
    data: {
      externalId,
      amount: price,
      currency: "PHP",
      description: `QR Attendnz ${plan === "essential" ? "Essential" : "Premium"} — Monthly Subscription`,
      payerEmail,
      invoiceDuration: 86400,
      successRedirectUrl: `${env.BETTER_AUTH_URL}/payment/success`,
      failureRedirectUrl: `${env.BETTER_AUTH_URL}/payment/failed`,
    },
  });

  const invoiceId = invoice.id!;

  await db
    .insert(subscription)
    .values({
      userId,
      plan,
      status: "pending",
      xenditInvoiceId: invoiceId,
    })
    .onConflictDoUpdate({
      target: subscription.userId,
      set: {
        plan,
        status: "pending",
        xenditInvoiceId: invoiceId,
        xenditSubscriptionId: null,
        currentPeriodStart: null,
        currentPeriodEnd: null,
        cancelledAt: null,
      },
    });

  return { invoiceUrl: invoice.invoiceUrl, invoiceId };
}

export async function handleInvoicePaid(invoiceId: string) {
  const sub = await db
    .select()
    .from(subscription)
    .where(eq(subscription.xenditInvoiceId, invoiceId))
    .limit(1)
    .then((r) => r[0]);

  if (!sub) return false;

  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setDate(periodEnd.getDate() + SUBSCRIPTION_DURATION_DAYS);

  await db
    .update(subscription)
    .set({
      status: "active",
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
    })
    .where(eq(subscription.id, sub.id));

  await db
    .update(user)
    .set({ plan: sub.plan })
    .where(eq(user.id, sub.userId));

  return true;
}

export async function handleInvoiceExpired(invoiceId: string) {
  await db
    .update(subscription)
    .set({ status: "expired" })
    .where(eq(subscription.xenditInvoiceId, invoiceId));
}

export async function getStatus(userId: number) {
  const sub = await db
    .select()
    .from(subscription)
    .where(eq(subscription.userId, userId))
    .limit(1)
    .then((r) => r[0]);

  if (!sub) return null;

  return {
    plan: sub.plan,
    status: sub.status,
    xenditSubscriptionId: sub.xenditSubscriptionId,
    currentPeriodStart: sub.currentPeriodStart?.toISOString() ?? null,
    currentPeriodEnd: sub.currentPeriodEnd?.toISOString() ?? null,
    trialEndsAt: sub.trialEndsAt?.toISOString() ?? null,
    cancelledAt: sub.cancelledAt?.toISOString() ?? null,
  };
}

export async function cancelSubscription(userId: number) {
  const sub = await db
    .select()
    .from(subscription)
    .where(eq(subscription.userId, userId))
    .limit(1)
    .then((r) => r[0]);

  if (!sub || sub.status !== "active") return false;

  await db
    .update(subscription)
    .set({ status: "cancelled", cancelledAt: new Date() })
    .where(eq(subscription.id, sub.id));

  await db
    .update(user)
    .set({ plan: "free" })
    .where(eq(user.id, sub.userId));

  return true;
}

export async function checkAndExpireStaleSubscriptions() {
  const now = new Date();
  const expired = await db
    .select()
    .from(subscription)
    .where(eq(subscription.status, "active"));

  for (const sub of expired) {
    if (sub.currentPeriodEnd && sub.currentPeriodEnd < now) {
      await db
        .update(subscription)
        .set({ status: "expired" })
        .where(eq(subscription.id, sub.id));

      await db
        .update(user)
        .set({ plan: "free" })
        .where(eq(user.id, sub.userId));

      console.log(`Subscription expired for user ${sub.userId}`);
    }
  }
}

export function verifyWebhookToken(headers: Record<string, string | undefined>) {
  const token = headers["x-callback-token"];
  return token === env.XENDIT_WEBHOOK_TOKEN;
}
