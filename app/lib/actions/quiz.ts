"use server";

import { db } from "../db";
import * as schema from "../db/schema";
import { eq, asc, sql } from "drizzle-orm";
import { QuizSubmitResult, QuestionResult, Question, QuestionType } from "../definitions/quizzes";
import { auth } from "@/auth";
import { updateQuestProgress } from "./quests";
import { QuestUpdateInfo } from "../definitions/quests";
import { updateStreak } from "./streak";
import { StreakResult } from "../definitions/definitions";
import { evaluateAchievements } from "./achievements";
import { revalidatePath } from "next/cache";

export async function submitQuiz(
  lessonId: string,
  answers: { [questionIndex: number]: string | number }
): Promise<QuizSubmitResult> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    // 1. Tìm quiz thuộc lesson này
    const quizData = await db
      .select()
      .from(schema.quizzes)
      .where(eq(schema.quizzes.lesson_id, Number(lessonId)))
      .limit(1);

    if (quizData.length === 0) {
      return { success: false, score: 0, total: 0, passed: false, xpEarned: 0, passingScore: 0, results: [] };
    }

    const quiz = quizData[0];

    // 2. Lấy tất cả câu hỏi thuộc quiz, sắp xếp theo order_index
    const questionsData = await db
      .select()
      .from(schema.questions)
      .where(eq(schema.questions.quiz_id, quiz.id))
      .orderBy(asc(schema.questions.order_index));

    // 3. Chấm bài: so sánh từng câu trả lời của user với correct_answer trong DB
    let score = 0;
    const results: QuestionResult[] = questionsData.map((q, index) => {
      const userRawAnswer = answers[index];
      const meta = (q.metadata || {}) as Record<string, any>;
      const options: string[] | undefined = meta.options;

      // Chuyển đổi đáp án của user thành dạng hiển thị được
      let userAnswerDisplay = String(userRawAnswer ?? "Không trả lời");

      if ((q.question_type === "multiple-choice" || q.question_type === "code") && options) {
        const idx = Number(userRawAnswer);
        if (!isNaN(idx) && idx >= 0 && idx < options.length) {
          userAnswerDisplay = options[idx];
        }
      }

      // Chuyển đổi đáp án đúng thành dạng hiển thị được
      let correctAnswerDisplay = q.correct_answer;
      if ((q.question_type === "multiple-choice" || q.question_type === "code") && options) {
        const correctIdx = Number(q.correct_answer);
        if (!isNaN(correctIdx) && correctIdx >= 0 && correctIdx < options.length) {
          correctAnswerDisplay = options[correctIdx];
        }
      }

      // So sánh đáp án
      let isCorrect = false;
      if (userRawAnswer !== undefined && userRawAnswer !== null) {
        const userStr = String(userRawAnswer).trim().toLowerCase();
        const correctStr = String(q.correct_answer).trim().toLowerCase();

        if (q.question_type === "fill-blank") {
          // Fill-blank: so sánh linh hoạt hơn (chứa chuỗi)
          isCorrect = userStr.includes(correctStr) || correctStr.includes(userStr);
        } else {
          isCorrect = userStr === correctStr;
        }
      }

      if (isCorrect) score++;

      return {
        id: q.id,
        question: q.question_text,
        userAnswer: userAnswerDisplay,
        correctAnswer: correctAnswerDisplay,
        isCorrect,
        explanation: q.explanation || "",
        xpReward: q.xp_reward || 0,
      };
    });

    const total = questionsData.length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const passingScore = quiz.passing_score || 50;
    const passed = percentage >= passingScore;

    // 4. Tính XP thưởng: cộng dồn XP từ các câu hỏi trả lời đúng
    let xpEarned = 0;
    questionsData.forEach((q, index) => {
      if (results[index].isCorrect) {
        xpEarned += q.xp_reward || 0;
      }
    });

    // 5. Cộng XP cho user nếu đăng nhập
    const questUpdates: QuestUpdateInfo[] = [];
    let streakResult: StreakResult | undefined;

    if (userId) {
      streakResult = await updateStreak(userId);

      if (xpEarned > 0) {
        await db.execute(
          sql`UPDATE users SET total_xp = COALESCE(total_xp, 0) + ${xpEarned} WHERE id = ${userId}`
        );

        // Cập nhật tiến độ quest: kiếm XP
        const res1 = await updateQuestProgress('EARN_XP', xpEarned, userId);
        questUpdates.push(...res1.questUpdates);
      }
    }

    // Cập nhật tiến độ quest: vượt qua quiz
    if (userId && passed) {
      const res2 = await updateQuestProgress('PASS_QUIZ', 1, userId);
      questUpdates.push(...res2.questUpdates);
    }

    // 6. Lưu lịch sử làm quiz vào DB
    let attemptId: number | undefined;
    if (userId) {
      const attempt = await db.insert(schema.quiz_attempts).values({
        user_id: userId,
        quiz_id: quiz.id,
        score,
        total,
        passed,
        xp_earned: xpEarned,
        answers: results,
      }).returning({ id: schema.quiz_attempts.id });

      attemptId = attempt[0].id;
    }

    const { unlocked } = await evaluateAchievements(userId || "");

    // Revalidate paths to update the streak and progress badge in RootLayout / SideNav
    revalidatePath("/dashboard/courses", "layout");

    return {
      success: true,
      attemptId,
      score,
      total,
      passed,
      xpEarned,
      passingScore,
      results,
      questUpdates,
      streakResult,
      unlockedAchievements: unlocked,
    };
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return { success: false, score: 0, total: 0, passed: false, xpEarned: 0, passingScore: 0, results: [] };
  }
}

export async function saveQuizBuilder(
  lessonId: number,
  data: {
    quizId?: number;
    title: string;
    passingScore: number;
    questions: Question[];
  }
): Promise<{ success: boolean; error?: string; quizId?: number; questions?: Question[] }> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    let finalQuizId: number | undefined;

    await db.transaction(async (tx) => {
      let quizId = data.quizId;

      // ── Bước 1: Upsert quiz ──
      if (quizId) {
        // Quiz đã tồn tại → UPDATE
        await tx.update(schema.quizzes).set({
          title: data.title,
          passing_score: data.passingScore,
          updated_at: new Date(),
        }).where(eq(schema.quizzes.id, quizId));
      } else {
        // Quiz chưa tồn tại → INSERT
        const inserted = await tx.insert(schema.quizzes).values({
          lesson_id: lessonId,
          title: data.title,
          passing_score: data.passingScore,
        }).returning({ id: schema.quizzes.id });
        quizId = inserted[0].id;
      }

      finalQuizId = quizId;

      // ── Bước 2: Xử lý questions ──
      // Lấy danh sách question IDs hiện có trong DB
      const existingQuestions = await tx.select({ id: schema.questions.id })
        .from(schema.questions)
        .where(eq(schema.questions.quiz_id, quizId));
      const existingIds = new Set(existingQuestions.map(q => q.id));

      // Phân loại: câu hỏi mới (id < 0) vs câu hỏi cũ (id > 0)
      const incomingPositiveIds = new Set(
        data.questions.filter(q => q.id > 0).map(q => q.id)
      );

      // Xóa những câu hỏi không còn trong danh sách
      const idsToDelete = [...existingIds].filter(id => !incomingPositiveIds.has(id));
      for (const id of idsToDelete) {
        await tx.delete(schema.questions).where(eq(schema.questions.id, id));
      }

      // Upsert từng câu hỏi
      for (let i = 0; i < data.questions.length; i++) {
        const q = data.questions[i];
        const metadata: Record<string, any> = {};
        if (q.options) metadata.options = q.options;
        if (q.code) metadata.code = q.code;

        if (q.id > 0 && existingIds.has(q.id)) {
          // UPDATE câu hỏi cũ
          await tx.update(schema.questions).set({
            question_type: q.type,
            question_text: q.question,
            correct_answer: String(q.correctAnswer ?? ''),
            explanation: q.explanation || '',
            xp_reward: q.xpReward || 0,
            metadata,
            order_index: i,
            updated_at: new Date(),
          }).where(eq(schema.questions.id, q.id));
        } else {
          // INSERT câu hỏi mới
          await tx.insert(schema.questions).values({
            quiz_id: quizId,
            question_type: q.type,
            question_text: q.question,
            correct_answer: String(q.correctAnswer ?? ''),
            explanation: q.explanation || '',
            xp_reward: q.xpReward || 0,
            metadata,
            order_index: i,
          });
        }
      }
    });

    // ── Bước 3: Fetch lại questions từ DB để trả về client (với ID thật) ──
    const savedQuestions = await db.select()
      .from(schema.questions)
      .where(eq(schema.questions.quiz_id, finalQuizId!))
      .orderBy(asc(schema.questions.order_index));

    const questions: Question[] = savedQuestions.map((q) => {
      const meta = (q.metadata || {}) as Record<string, any>;
      let correctAnswer: string | number = q.correct_answer;
      if (q.question_type === 'multiple-choice' || q.question_type === 'code') {
        const parsed = Number(q.correct_answer);
        if (!isNaN(parsed)) correctAnswer = parsed;
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

    revalidatePath(`/admin/courses`, "layout");
    revalidatePath(`/dashboard/courses`, "layout");

    return { success: true, quizId: finalQuizId, questions };
  } catch (error) {
    console.error("Error saving quiz:", error);
    return { success: false, error: (error as Error).message };
  }
}
