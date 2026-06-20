import { t, Static } from "elysia";

export const sectionModel = {
  createSectionBody: t.Object({
    name: t.String({ minLength: 1, maxLength: 100, description: "Section name (e.g. Grade 3 - Sampaguita)" }),
    classCode: t.String({ minLength: 1, maxLength: 20, description: "Unique class code for parents to join" }),
  }),

  createSectionResponse: t.Object({
    id: t.Number(),
    name: t.String(),
    classCode: t.String(),
    teacherId: t.Number(),
    createdAt: t.Date(),
  }),
};

export type CreateSectionBody = Static<typeof sectionModel.createSectionBody>;
export type CreateSectionResponse = Static<typeof sectionModel.createSectionResponse>;
