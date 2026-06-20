import { Elysia } from "elysia";
import { authPlugin } from "./auth/controller";

export const apiRoutes = new Elysia({ prefix: "api/v1/" }).use(authPlugin);
