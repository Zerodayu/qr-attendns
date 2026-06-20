import { Elysia, t } from "elysia";
import { attendanceService } from "./service";
import { attendanceModel } from "./model";
import { authPlugin } from "../auth/controller";

const service = new attendanceService();

export const attendanceRoutes = new Elysia({ prefix: "attendance", tags: ["Attendance"] })
  .use(authPlugin)
  .post(
    "/time-in",
    async ({ body, session, set }) => {
      if (session.user.role !== "teacher") {
        set.status = 403;
        return { error: "Only teachers can mark attendance" };
      }
      try {
        return await service.markTimeIn(body.studentId, Number(session.user.id));
      } catch (err: unknown) {
        set.status = 404;
        return { error: err instanceof Error ? err.message : "Failed to mark time in" };
      }
    },
    {
      auth: true,
      body: attendanceModel.studentIdBody,
      response: {
        200: attendanceModel.attendanceResponse,
        403: t.Object({ error: t.String() }),
        404: t.Object({ error: t.String() }),
      },
      detail: { description: "Mark a student time in (teacher only)" },
    },
  )
  .post(
    "/time-out",
    async ({ body, session, set }) => {
      if (session.user.role !== "teacher") {
        set.status = 403;
        return { error: "Only teachers can mark attendance" };
      }
      try {
        return await service.markTimeOut(body.studentId, Number(session.user.id));
      } catch (err: unknown) {
        set.status = err instanceof Error && err.message === "Student has not checked in today" ? 400 : 404;
        return { error: err instanceof Error ? err.message : "Failed to mark time out" };
      }
    },
    {
      auth: true,
      body: attendanceModel.studentIdBody,
      response: {
        200: attendanceModel.attendanceResponse,
        400: t.Object({ error: t.String() }),
        403: t.Object({ error: t.String() }),
        404: t.Object({ error: t.String() }),
      },
      detail: { description: "Mark a student time out (teacher only)" },
    },
  );
