import { Elysia } from "elysia";
import { authRoutes } from "./auth/controller";

export const apiRoutes = new Elysia().use(authRoutes);
