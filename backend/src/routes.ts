import { Elysia } from "elysia";
import { authPlugin } from "./auth/controller";
import { studentRoutes } from "./students/controller";

export const apiRoutes = new Elysia({ prefix: "api/v1/" })
  .use(authPlugin)
  .use(studentRoutes);
