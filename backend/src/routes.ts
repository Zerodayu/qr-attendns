import { Elysia } from "elysia";
import { authPlugin } from "./auth/controller";
import { studentRoutes } from "./students/controller";
import { sectionRoutes } from "./sections/controller";
import { pushRoutes } from "./push/controller";
import { parentRoutes } from "./parent/controller";
import { attendanceRoutes } from "./attendance/controller";

export const apiRoutes = new Elysia({ prefix: "api/v1" })
  .use(authPlugin)
  .use(studentRoutes)
  .use(sectionRoutes)
  .use(pushRoutes)
  .use(parentRoutes)
  .use(attendanceRoutes);
