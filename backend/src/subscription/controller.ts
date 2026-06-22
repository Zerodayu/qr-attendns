import { Elysia, t } from "elysia";
import { authPlugin } from "../auth/controller";
import { subscriptionModel } from "./model";
import {
  createInvoice,
  handleLinkPaymentPaid,
  handleLinkPaymentFailed,
  getStatus,
  cancelSubscription,
  verifyWebhookSignature,
  checkAndExpireStaleSubscriptions,
} from "./service";

export const subscriptionRoutes = new Elysia({
  prefix: "subscription",
  tags: ["Subscription"],
})
  .use(authPlugin)
  .post(
    "/create-invoice",
    async ({ body, session, set }) => {
      try {
        const result = await createInvoice(
          Number(session.user.id),
          body.plan,
          session.user.email,
        );
        if (!result.checkoutUrl) {
          set.status = 409;
          return { error: "A pending invoice already exists" };
        }
        return result;
      } catch (err) {
        set.status = 400;
        return { error: err instanceof Error ? err.message : "Failed to create invoice" };
      }
    },
    {
      auth: true,
      body: subscriptionModel.planParam,
      response: {
        200: subscriptionModel.createInvoiceResponse,
        400: subscriptionModel.invoiceError,
        409: subscriptionModel.invoiceError,
      },
      detail: { description: "Create a PayMongo payment link for subscription" },
    },
  )
  .post(
    "/webhook",
    async ({ request, set }) => {
      const rawBody = await request.clone().text();
      const signatureHeader =
        request.headers.get("webhook-signature") ?? "";

      const valid = await verifyWebhookSignature(rawBody, signatureHeader);
      if (!valid) {
        set.status = 401;
        return { error: "Invalid webhook signature" };
      }

      type PayMongoEvent = {
        data: {
          attributes: {
            type: string;
            data: {
              id: string;
              attributes: {
                status: string;
                payments?: Array<{ id: string }>;
              };
            };
          };
        };
      };

      let event: PayMongoEvent;
      try {
        event = JSON.parse(rawBody);
      } catch {
        set.status = 400;
        return { error: "Invalid webhook payload" };
      }

      const {
        type,
        data: { id: linkId, attributes: linkAttrs },
      } = event.data.attributes;
      const paymentId = linkAttrs.payments?.[0]?.id;

      if (type === "link.payment.paid" && linkAttrs.status === "paid") {
        await handleLinkPaymentPaid(linkId, paymentId ?? "");
      } else if (type === "link.payment.failed") {
        await handleLinkPaymentFailed(linkId);
      }

      return { received: true };
    },
    {
      auth: false,
      response: {
        200: t.Object({ received: t.Boolean() }),
        400: subscriptionModel.webhookError,
        401: subscriptionModel.webhookError,
      },
      detail: { description: "PayMongo webhook endpoint for link payment events" },
    },
  )
  .get(
    "/status",
    async ({ session, set }) => {
      const result = await getStatus(Number(session.user.id));
      if (!result) {
        set.status = 404;
        return { error: "No subscription found" };
      }
      return result;
    },
    {
      auth: true,
      response: {
        200: subscriptionModel.subscriptionStatusResponse,
        404: subscriptionModel.webhookError,
      },
      detail: { description: "Get current subscription status for the authenticated user" },
    },
  )
  .post(
    "/cancel",
    async ({ session, set }) => {
      const cancelled = await cancelSubscription(Number(session.user.id));
      if (!cancelled) {
        set.status = 400;
        return { error: "No active subscription to cancel" };
      }
      return { message: "Subscription cancelled successfully" };
    },
    {
      auth: true,
      response: {
        200: subscriptionModel.cancelResponse,
        400: subscriptionModel.webhookError,
      },
      detail: { description: "Cancel the active subscription" },
    },
  );

if (typeof setInterval !== "undefined") {
  setInterval(() => {
    checkAndExpireStaleSubscriptions().catch(console.error);
  }, 60 * 60 * 1000);
}
