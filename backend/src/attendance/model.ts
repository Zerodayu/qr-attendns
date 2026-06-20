import { t, Static } from "elysia";

export const attendanceModel = {
  studentIdBody: t.Object({
    studentId: t.Number({ description: "Student ID from QR code" }),
  }),

  attendanceResponse: t.Object({
    id: t.Number(),
    studentId: t.Number(),
    date: t.String(),
    timeIn: t.Union([t.Date(), t.Null()]),
    timeOut: t.Union([t.Date(), t.Null()]),
  }),
};

export type StudentIdBody = Static<typeof attendanceModel.studentIdBody>;
export type AttendanceResponse = Static<typeof attendanceModel.attendanceResponse>;
