import { t } from "elysia";

export const subscriptionModel = {
  planParam: t.Object({
    plan: t.Union([t.Literal("essential"), t.Literal("premium")]),
  }),

  createInvoiceResponse: t.Object({
    checkoutUrl: t.String(),
    linkId: t.String(),
  }),

  subscriptionStatusResponse: t.Object({
    plan: t.String(),
    status: t.String(),
    provider: t.String(),
    providerLinkId: t.Nullable(t.String()),
    providerPaymentId: t.Nullable(t.String()),
    currentPeriodStart: t.Nullable(t.String()),
    currentPeriodEnd: t.Nullable(t.String()),
    trialEndsAt: t.Nullable(t.String()),
    cancelledAt: t.Nullable(t.String()),
  }),

  cancelResponse: t.Object({
    message: t.String(),
  }),

  webhookError: t.Object({
    error: t.String(),
  }),

  invoiceError: t.Object({
    error: t.String(),
  }),
};
