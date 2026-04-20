import postgres from "postgres";
import { Courses } from "../definitions/courses";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: require });

export async function fetchAllCourses() {
  try {
    const data = await sql<Courses[]>`
      SELECT * FROM courses
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all courses.');
  }
}