import { Elysia, t } from "elysia";
import { pushService } from "./service";
import { pushModel } from "./model";
import { authPlugin } from "../auth/controller";

const service = new pushService();

export const pushRoutes = new Elysia({ prefix: "subscriptions", tags: ["Push Subscriptions"] })
  .use(authPlugin)
  .get(
    "/",
    async ({ session }) => {
      return await service.list(Number(session.user.id));
    },
    {
      auth: true,
      detail: { description: "List all push subscriptions for the current user" },
    },
  )
  .post(
    "/",
    async ({ body, session }) => {
      return await service.register(
        Number(session.user.id),
        body.endpoint,
        body.keys,
        body.browserInfo,
      );
    },
    {
      auth: true,
      body: pushModel.registerSubscriptionBody,
      response: pushModel.subscriptionResponse,
      detail: { description: "Register a new push subscription" },
    },
  )
  .delete(
    "/:id",
    async ({ params, session, set }) => {
      const deleted = await service.unregister(Number(session.user.id), Number(params.id));
      if (!deleted) {
        set.status = 404;
        return { error: "Subscription not found" };
      }
      return { success: true };
    },
    {
      auth: true,
      params: t.Object({ id: t.Numeric() }),
      response: {
        200: t.Object({ success: t.Boolean() }),
        404: t.Object({ error: t.String() }),
      },
      detail: { description: "Remove a push subscription" },
    },
  );
