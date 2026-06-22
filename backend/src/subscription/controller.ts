import { Elysia, t } from "elysia";
import { authPlugin } from "../auth/controller";
import { subscriptionModel } from "./model";
import {
  createInvoice,
  handleInvoicePaid,
  handleInvoiceExpired,
  getStatus,
  cancelSubscription,
  verifyWebhookToken,
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
        if (!result.invoiceUrl) {
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
      detail: { description: "Create a Xendit invoice for subscription payment" },
    },
  )
  .post(
    "/webhook",
    async ({ request, set }) => {
      const headers: Record<string, string | undefined> = {};
      request.headers.forEach((value, key) => {
        headers[key.toLowerCase()] = value;
      });

      if (!verifyWebhookToken(headers)) {
        set.status = 401;
        return { error: "Invalid webhook token" };
      }

      const body = await request.clone().json().catch(() => null);
      if (!body || typeof body !== "object" || !("id" in body) || !("status" in body)) {
        set.status = 400;
        return { error: "Invalid webhook payload" };
      }

      const { id: invoiceId, status } = body as { id: string; status: string };

      if (status === "PAID") {
        await handleInvoicePaid(invoiceId);
      } else if (status === "EXPIRED") {
        await handleInvoiceExpired(invoiceId);
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
      detail: { description: "Xendit webhook endpoint for invoice events" },
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
