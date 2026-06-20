import { t, Static } from "elysia";

export const parentModel = {
  joinSectionBody: t.Object({
    classCode: t.String({ description: "Class code received from teacher" }),
  }),

  sectionStudentsResponse: t.Object({
    sectionId: t.Number(),
    sectionName: t.String(),
    students: t.Array(
      t.Object({
        id: t.Number(),
        name: t.String(),
        gender: t.String(),
      }),
    ),
  }),

  linkStudentsBody: t.Object({
    studentIds: t.Array(t.Number(), {
      minItems: 1,
      description: "Student IDs to link as your children",
    }),
  }),

  linkStudentsResponse: t.Object({
    success: t.Boolean(),
    linked: t.Number(),
  }),
};

export type JoinSectionBody = Static<typeof parentModel.joinSectionBody>;
export type SectionStudentsResponse = Static<typeof parentModel.sectionStudentsResponse>;
export type LinkStudentsBody = Static<typeof parentModel.linkStudentsBody>;
export type LinkStudentsResponse = Static<typeof parentModel.linkStudentsResponse>;
