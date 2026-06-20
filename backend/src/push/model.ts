import { t, Static } from "elysia";

export const pushModel = {
  registerSubscriptionBody: t.Object({
    endpoint: t.String({ description: "Push endpoint URL" }),
    keys: t.Object(
      {
        p256dh: t.String({ description: "P-256 Diffie-Hellman public key" }),
        auth: t.String({ description: "Auth secret" }),
      },
      { description: "Push subscription keys" },
    ),
    browserInfo: t.Optional(
      t.Object({
        userAgent: t.Optional(t.String()),
        browser: t.Optional(t.String()),
        version: t.Optional(t.String()),
        os: t.Optional(t.String()),
        deviceType: t.Optional(t.String()),
      }),
    ),
  }),

  subscriptionResponse: t.Object({
    id: t.Number(),
    endpoint: t.String(),
    browserInfo: t.Object({
      userAgent: t.String(),
      browser: t.String(),
      version: t.String(),
      os: t.String(),
      deviceType: t.Optional(t.String()),
    }),
    createdAt: t.Date(),
  }),
};

export type RegisterSubscriptionBody = Static<typeof pushModel.registerSubscriptionBody>;
export type SubscriptionResponse = Static<typeof pushModel.subscriptionResponse>;
