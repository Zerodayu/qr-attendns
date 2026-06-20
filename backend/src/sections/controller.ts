import { Elysia, t } from "elysia";
import { sectionService } from "./service";
import { sectionModel } from "./model";
import { authPlugin } from "../auth/controller";

const service = new sectionService();

export const sectionRoutes = new Elysia({ prefix: "sections", tags: ["Sections"] })
  .use(authPlugin)
  .get(
    "/",
    async ({ session, query }) => {
      return await service.getTeacherSections(Number(session.user.id), query.date);
    },
    {
      auth: true,
      query: sectionModel.dateQuery,
      response: sectionModel.teacherSectionsResponse,
      detail: { description: "Get all sections with students and attendance for a date (teacher only, defaults to today)" },
    },
  )
  .post(
    "/",
    async ({ body, session, set }) => {
      if (session.user.role !== "teacher") {
        set.status = 403;
        return { error: "Only teachers can create sections" };
      }

      return await service.createSection({
        ...body,
        teacherId: Number(session.user.id),
      });
    },
    {
      auth: true,
      body: sectionModel.createSectionBody,
      response: {
        200: sectionModel.createSectionResponse,
        403: t.Object({ error: t.String() }),
      },
      detail: { description: "Create a new section (teacher only)" },
    },
  );
