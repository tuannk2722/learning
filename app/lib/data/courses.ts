import postgres from "postgres";
import { Courses } from "../definitions/courses";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: require });

export async function fetchAllCourses() {
  try {
    const data = await sql<Courses[]>`
      SELECT 
        c.*, 
        cat.name as category_name,
        COUNT(DISTINCT l.id) AS total_lessons,
        COUNT(DISTINCT e2.user_id) AS enrolled_count
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN sections s ON c.id = s.course_id
      LEFT JOIN lessons l ON s.id = l.section_id
      LEFT JOIN enrollments e2 ON c.id = e2.course_id
      GROUP BY c.id, cat.name
      ORDER BY enrolled_count DESC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all courses.');
  }
}

export async function fetchPopularCourses() {
  try {
    const data = await sql<Courses[]>`
      SELECT 
        c.*, 
        cat.name as category_name,
        COUNT(DISTINCT l.id) AS total_lessons,
        COUNT(DISTINCT e2.user_id) AS enrolled_count
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN sections s ON c.id = s.course_id
      LEFT JOIN lessons l ON s.id = l.section_id
      LEFT JOIN enrollments e2 ON c.id = e2.course_id
      GROUP BY c.id, cat.name
      ORDER BY enrolled_count DESC
      LIMIT 3
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch popular courses.');
  }
}

export async function fetchUserEnrolledCourses(userId: string) {
  try {
    const data = await sql<Courses[]>`
      SELECT 
        c.id, c.name, c.icon_name, c.theme_color, c.description,
        cat.name as category_name,
        e.progress_percent
      FROM courses c
      JOIN enrollments e ON e.course_id = c.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE e.user_id = ${userId}
    `
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user enrolled courses.');
  }
}

export async function fetchUserNotEnrolledCourses(userId: string) {
  try {
    const data = await sql<Courses[]>`
      SELECT 
        c.*, 
        cat.name as category_name,
        COUNT(DISTINCT l.id) AS total_lessons,
        COUNT(DISTINCT e2.user_id) AS enrolled_count
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN sections s ON c.id = s.course_id
      LEFT JOIN lessons l ON s.id = l.section_id
      LEFT JOIN enrollments e2 ON c.id = e2.course_id
      WHERE c.id NOT IN (SELECT course_id FROM enrollments WHERE user_id = ${userId})
      GROUP BY c.id, cat.name
    `
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user not enrolled courses.');
  }
}