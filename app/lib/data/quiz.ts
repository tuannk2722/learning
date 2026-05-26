import { db } from "../db";
import * as schema from "../db/schema";
import { eq, asc, desc } from "drizzle-orm";
import {
  QuestionType,
  QuizData,
  QuizAttemptSummary,
  QuizAttemptDetail,
  QuestionResult,
  Question,
} from "../definitions/quizzes";

/**
 * Lấy quiz + questions ĐẦY ĐỦ cho Admin Builder (bao gồm correctAnswer, explanation).
 * Trả về null nếu lesson chưa có quiz.
 */
export async function getQuizForBuilder(lessonId: number): Promise<{
  quizId: number;
  title: string;
  passingScore: number;
  questions: Question[];
} | null> {
  try {
    // 1. Lấy quiz thuộc lesson
    const quizData = await db.select().from(schema.quizzes)
      .where(eq(schema.quizzes.lesson_id, lessonId)).limit(1);

    if (quizData.length === 0) return null;
    const quiz = quizData[0];

    // 2. Lấy questions đầy đủ (bao gồm correctAnswer, explanation)
    const questionsData = await db.select().from(schema.questions)
      .where(eq(schema.questions.quiz_id, quiz.id))
      .orderBy(asc(schema.questions.order_index));

    const questions: Question[] = questionsData.map((q) => {
      const meta = (q.metadata || {}) as Record<string, any>;
      // Convert correctAnswer back based on question type
      let correctAnswer: string | number = q.correct_answer;
      if (q.question_type === 'multiple-choice' || q.question_type === 'code') {
        const parsed = Number(q.correct_answer);
        if (!isNaN(parsed)) {
          correctAnswer = parsed;
        }
      }

      return {
        id: q.id,
        type: q.question_type as QuestionType,
        question: q.question_text,
        options: meta.options || undefined,
        code: meta.code || undefined,
        xpReward: q.xp_reward || 0,
        correctAnswer,
        explanation: q.explanation || '',
        order_index: q.order_index,
      };
    });

    return {
      quizId: quiz.id,
      title: quiz.title,
      passingScore: quiz.passing_score || 50,
      questions,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch quiz data for builder.");
  }
}

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
        xpReward: q.xp_reward || 0,
      };
    });

    const xpReward = questionsData.reduce((sum, q) => sum + (q.xp_reward || 0), 0);

    // 4. Trả về object QuizData cho frontend
    return {
      title: quiz.title,
      totalQuestions: questions.length,
      passingScore: quiz.passing_score || 50,
      xpReward,
      questions,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch quiz data.");
  }
}

/**
 * Lấy toàn bộ lịch sử làm quiz của user (cho trang Analytics).
 * Join qua quizzes → lessons → sections để lấy tên quiz, lesson, courseId.
 */
export async function getQuizHistory(userId: string): Promise<QuizAttemptSummary[]> {
  try {
    const data = await db
      .select({
        id: schema.quiz_attempts.id,
        score: schema.quiz_attempts.score,
        total: schema.quiz_attempts.total,
        passed: schema.quiz_attempts.passed,
        xpEarned: schema.quiz_attempts.xp_earned,
        completedAt: schema.quiz_attempts.completed_at,
        quizTitle: schema.quizzes.title,
        lessonTitle: schema.lessons.title,
        lessonId: schema.lessons.id,
        courseId: schema.sections.course_id,
      })
      .from(schema.quiz_attempts)
      .innerJoin(schema.quizzes, eq(schema.quiz_attempts.quiz_id, schema.quizzes.id))
      .innerJoin(schema.lessons, eq(schema.quizzes.lesson_id, schema.lessons.id))
      .innerJoin(schema.sections, eq(schema.lessons.section_id, schema.sections.id))
      .where(eq(schema.quiz_attempts.user_id, userId))
      .orderBy(desc(schema.quiz_attempts.completed_at));

    return data.map((row) => ({
      id: row.id,
      quizTitle: row.quizTitle,
      lessonTitle: row.lessonTitle,
      courseId: row.courseId || 0,
      lessonId: row.lessonId,
      score: row.score,
      total: row.total,
      passed: row.passed,
      xpEarned: row.xpEarned || 0,
      completedAt: row.completedAt?.toISOString() || "",
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch quiz history.");
  }
}

/**
 * Lấy chi tiết 1 lần làm quiz (cho trang result/[attemptId]).
 * Trả về null nếu không tìm thấy.
 */
export async function getAttemptById(attemptId: number): Promise<QuizAttemptDetail | null> {
  try {
    const data = await db
      .select({
        id: schema.quiz_attempts.id,
        score: schema.quiz_attempts.score,
        total: schema.quiz_attempts.total,
        passed: schema.quiz_attempts.passed,
        xpEarned: schema.quiz_attempts.xp_earned,
        answers: schema.quiz_attempts.answers,
        completedAt: schema.quiz_attempts.completed_at,
        quizTitle: schema.quizzes.title,
        passingScore: schema.quizzes.passing_score,
      })
      .from(schema.quiz_attempts)
      .innerJoin(schema.quizzes, eq(schema.quiz_attempts.quiz_id, schema.quizzes.id))
      .where(eq(schema.quiz_attempts.id, attemptId))
      .limit(1);

    if (data.length === 0) return null;

    const row = data[0];
    return {
      id: row.id,
      quizTitle: row.quizTitle,
      score: row.score,
      total: row.total,
      passed: row.passed,
      xpEarned: row.xpEarned || 0,
      passingScore: row.passingScore || 50,
      completedAt: row.completedAt?.toISOString() || "",
      answers: (row.answers || []) as QuestionResult[],
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch attempt detail.");
  }
}
