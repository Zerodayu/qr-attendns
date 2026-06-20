import { Elysia } from "elysia";
import { openapi } from "@elysiajs/openapi";
import { OpenAPI } from "./auth/controller";
import { apiRoutes } from "./routes";

const app = new Elysia()
  .use(
    openapi({
      documentation: {
        info: {
          version: "v1",
          title: "QR Attendnz — backend service",
          description: "this is the documentation for the Qr Attendnz backend",
        },
        components: (await OpenAPI.components) as any,
        paths: (await OpenAPI.getPaths()) as any,
      },
    }),
  )
  .get("/", () => "Hello Elysia", {
    detail: { hide: true },
  })
  .use(apiRoutes)
  .listen(8080);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
