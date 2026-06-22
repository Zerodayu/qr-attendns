import { eq } from "drizzle-orm";
import crypto from "crypto";
import { env } from "@env";
import db from "@drizzle";
import { subscription, user } from "@drizzle/schema";

const PAYMONGO_API = "https://api.paymongo.com/v1";

const PLAN_PRICES: Record<string, number> = {
  essential: 20000,
  premium: 35000,
};

const SUBSCRIPTION_DURATION_DAYS = 30;

function basicAuth() {
  return btoa(`${env.PAYMONGO_SECRET_KEY}:`);
}

async function paymongoFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${PAYMONGO_API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${basicAuth()}`,
      ...options.headers,
    },
  });

  const json = await res.json();

  if (!res.ok) {
    const msg =
      json.errors?.[0]?.detail ??
      json.errors?.[0]?.title ??
      "PayMongo API error";
    throw new Error(msg);
  }

  return json;
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

  if (existing?.status === "pending" && existing.providerLinkId) {
    return {
      checkoutUrl: `https://checkout.paymongo.com/${existing.providerLinkId.replace("link_", "")}`,
      linkId: existing.providerLinkId,
    };
  }

  const externalId = `sub-${userId}-${plan}-${Date.now()}`;

  const body = {
    data: {
      attributes: {
        amount: price,
        description: `QR Attendnz ${plan === "essential" ? "Essential" : "Premium"} — Monthly Subscription`,
        remarks: externalId,
        redirect: {
          success: `${env.FRONTEND_URL}/payment/success`,
          failed: `${env.FRONTEND_URL}/payment/failed`,
        },
      },
    },
  };

  const result = await paymongoFetch("/links", {
    method: "POST",
    body: JSON.stringify(body),
  });

  const linkId: string = result.data.id;
  const checkoutUrl: string = result.data.attributes.checkout_url;

  await db
    .insert(subscription)
    .values({
      userId,
      plan,
      status: "pending",
      provider: "paymongo",
      providerLinkId: linkId,
    })
    .onConflictDoUpdate({
      target: subscription.userId,
      set: {
        plan,
        status: "pending",
        provider: "paymongo",
        providerLinkId: linkId,
        providerPaymentId: null,
        currentPeriodStart: null,
        currentPeriodEnd: null,
        cancelledAt: null,
      },
    });

  return { checkoutUrl, linkId };
}

export async function handleLinkPaymentPaid(linkId: string, paymentId: string) {
  const sub = await db
    .select()
    .from(subscription)
    .where(eq(subscription.providerLinkId, linkId))
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
      providerPaymentId: paymentId,
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
    })
    .where(eq(subscription.id, sub.id));

  await db.update(user).set({ plan: sub.plan }).where(eq(user.id, sub.userId));

  return true;
}

export async function handleLinkPaymentFailed(linkId: string) {
  await db
    .update(subscription)
    .set({ status: "failed" })
    .where(eq(subscription.providerLinkId, linkId));
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
    provider: sub.provider,
    providerLinkId: sub.providerLinkId,
    providerPaymentId: sub.providerPaymentId,
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

  await db.update(user).set({ plan: "free" }).where(eq(user.id, sub.userId));

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

export async function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string,
): Promise<boolean> {
  if (!signatureHeader) return false;

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(env.PAYMONGO_WEBHOOK_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const sigBuf = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(rawBody),
    );
    const expected = Array.from(new Uint8Array(sigBuf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const a = Buffer.from(expected);
    const b = Buffer.from(signatureHeader);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
