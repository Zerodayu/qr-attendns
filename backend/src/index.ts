import openapi from "@elysiajs/openapi";
import { Elysia } from "elysia";

const app = new Elysia()
  .use(
    openapi({
      documentation: {
        info: {
          version: "v1",
          title: "QR Attendnz — backend service",
          description: "this is the documentation for the Qr Attendnz backend",
        },
      },
    }),
  )
  .get("/", () => "Hello Elysia")
  .listen(8080);

console.log(
  `🦊 Elysia is running at (http://${app.server?.hostname}:${app.server?.port})`,
);
