import { Elysia, t } from "elysia";
import { studentService } from "./service";
import { studentModel } from "./model";
import { authPlugin } from "../auth/controller";
import { requireTeacherPlan } from "@lib/guard";

const service = new studentService();

export const studentRoutes = new Elysia({
  prefix: "sections",
  tags: ["Students"],
})
  .use(authPlugin)
  .post(
    "/:sectionId/students",
    async ({ body, params, session, set }) => {
      const denied = requireTeacherPlan(session, set);
      if (denied) return denied;

      try {
        return await service.createStudent({
          ...body,
          sectionId: Number(params.sectionId),
          teacherId: Number(session.user.id),
        });
      } catch {
        set.status = 404;
        return { error: "Section not found or not owned by you" };
      }
    },
    {
      auth: true,
      body: studentModel.createStudentBody,
      params: studentModel.sectionIdParam,
      response: {
        200: studentModel.createStudentResponse,
        403: t.Object({ error: t.String() }),
        404: t.Object({ error: t.String() }),
      },
      detail: { description: "Add a new student to a section (teacher only)" },
    },
  );
