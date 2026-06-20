import { db } from "../../drizzle";
import { section } from "../../drizzle/schema";

export class sectionService {
  async createSection(data: {
    name: string;
    classCode: string;
    teacherId: number;
  }) {
    const [newSection] = await db
      .insert(section)
      .values({
        name: data.name,
        classCode: data.classCode,
        teacherId: data.teacherId,
      })
      .returning();

    return newSection;
  }
}
