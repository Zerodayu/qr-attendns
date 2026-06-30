"use server";

import { del, get, post } from "@/lib/api";

export interface PushSubscription {
  browserInfo?: {
    userAgent?: string;
    browser?: string;
    version?: string;
    os?: string;
    deviceType?: string;
  };
  createdAt: string;
  endpoint: string;
  id: number;
  keys: { p256dh: string; auth: string };
}

export async function getSubscriptions() {
  return get<PushSubscription[]>("/subscriptions");
}

export async function registerSubscription(body: {
  endpoint: string;
  keys: { p256dh: string; auth: string };
  browserInfo?: Record<string, string>;
}) {
  return post<PushSubscription>("/subscriptions", body);
}

export async function unregisterSubscription(id: number) {
  return del(`/subscriptions/${id}`);
}
