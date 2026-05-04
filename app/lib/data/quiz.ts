import { db } from "../db";
import * as schema from "../db/schema";
import { eq, asc } from "drizzle-orm";
import { QuestionType, QuizData } from "../definitions/quizzes";

/**
 * Lấy quiz và danh sách questions thuộc một lesson cụ thể.
 * Trả về null nếu lesson đó không có quiz.
 */
export async function getQuizByLessonId(lessonId: number): Promise<QuizData | null> {
  try {
    // 1. Lấy quiz thuộc lesson này
    const quizData = await db
      .select()
      .from(schema.quizzes)
      .where(eq(schema.quizzes.lesson_id, lessonId))
      .limit(1);

    if (quizData.length === 0) return null;

    const quiz = quizData[0];

    // 2. Lấy tất cả questions thuộc quiz này, sắp xếp theo order_index
    const questionsData = await db
      .select()
      .from(schema.questions)
      .where(eq(schema.questions.quiz_id, quiz.id))
      .orderBy(asc(schema.questions.order_index));

    // 3. Map từ DB schema sang frontend Question interface (không gửi correctAnswer)
    const questions = questionsData.map((q) => {
      const meta = (q.metadata || {}) as Record<string, any>;
      const type = q.question_type as QuestionType;

      return {
        id: q.id,
        type,
        question: q.question_text,
        options: meta.options || undefined,
        code: meta.code || undefined,
      };
    });

    // 4. Trả về object QuizData cho frontend
    return {
      title: quiz.title,
      totalQuestions: questions.length,
      passingScore: quiz.passing_score || 50,
      xpReward: quiz.xp_reward || 0,
      questions,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch quiz data.");
  }
}
