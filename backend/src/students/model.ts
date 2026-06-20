import { t, Static } from "elysia";

export const studentModel = {
  createStudentBody: t.Object({
    name: t.String({ minLength: 1, maxLength: 100, description: "Student full name" }),
    gender: t.Union([t.Literal("male"), t.Literal("female"), t.Literal("other")], {
      description: "Student gender",
    }),
  }),

  createStudentResponse: t.Object({
    id: t.Number(),
    name: t.String(),
    gender: t.String(),
    sectionId: t.Number(),
  }),

  sectionIdParam: t.Object({
    sectionId: t.Numeric({ description: "Section ID" }),
  }),
};

export type CreateStudentBody = Static<typeof studentModel.createStudentBody>;
export type CreateStudentResponse = Static<typeof studentModel.createStudentResponse>;
export type SectionIdParam = Static<typeof studentModel.sectionIdParam>;
