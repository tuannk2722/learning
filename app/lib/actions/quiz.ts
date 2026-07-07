"use server";

import { db } from "../db";
import * as schema from "../db/schema";
import { eq, asc, sql } from "drizzle-orm";
import { QuizSubmitResult, QuestionResult } from "../definitions/quiz-results";
import { auth } from "@/auth";
import { updateQuestProgress } from "./quests";
import { QuestUpdateInfo } from "../definitions/quests";
import { updateStreak } from "./streak";
import { StreakResult } from "../definitions/definitions";
import { evaluateAchievements } from "./achievements";

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
      };
    });

    const total = questionsData.length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const passingScore = quiz.passing_score || 50;
    const passed = percentage >= passingScore;

    // 4. Tính XP thưởng: đạt → full XP, không đạt → tỉ lệ theo phần trăm
    const fullXp = quiz.xp_reward || 0;
    const xpEarned = passed ? fullXp : Math.round(fullXp * (percentage / 100));

    // 5. Cộng XP cho user nếu đăng nhập
    const questUpdates: QuestUpdateInfo[] = [];
    let streakResult: StreakResult | undefined;

    if (userId && xpEarned > 0) {
      await db.execute(
        sql`UPDATE users SET total_xp = COALESCE(total_xp, 0) + ${xpEarned} WHERE id = ${userId}`
      );

      // Cập nhật streak (quiz nộp bài = có học)
      streakResult = await updateStreak(userId);

      // Cập nhật tiến độ quest: kiếm XP
      const res1 = await updateQuestProgress('EARN_XP', xpEarned, userId);
      questUpdates.push(...res1.questUpdates);
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
