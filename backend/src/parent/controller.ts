import { Elysia, t } from "elysia";
import { parentService } from "./service";
import { parentModel } from "./model";
import { authPlugin } from "../auth/controller";

const service = new parentService();

export const parentRoutes = new Elysia({ prefix: "parent", tags: ["Parent"] })
  .use(authPlugin)
  .post(
    "/join",
    async ({ body, set }) => {
      try {
        return await service.getStudentsByClassCode(body.classCode);
      } catch {
        set.status = 404;
        return { error: "Section not found with that class code" };
      }
    },
    {
      auth: true,
      body: parentModel.joinSectionBody,
      response: {
        200: parentModel.sectionStudentsResponse,
        404: t.Object({ error: t.String() }),
      },
      detail: {
        description:
          "Look up a section by class code and return its students",
      },
    },
  )
  .post(
    "/students",
    async ({ body, session }) => {
      return await service.linkStudents(
        Number(session.user.id),
        body.studentIds,
      );
    },
    {
      auth: true,
      body: parentModel.linkStudentsBody,
      response: parentModel.linkStudentsResponse,
      detail: {
        description: "Link the current user as parent to selected students",
      },
    },
  );
