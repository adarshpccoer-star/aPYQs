import type { Request, Response } from 'express';
import { eq, and, desc, sql, Count, count } from 'drizzle-orm';

import { questionProgress } from '../db/schema.js';
import { getMobileSession } from '../utils/get-mobile-session.js';
import { db } from '../db/drizzle/index.js';
import { QuestionModel } from '../db/mongodb/schema/question.schema.js';

export const POST = async (req: Request, res: Response) => {
  try {
    const { questionId, solved, correct } = req.body;

    if (
      !questionId ||
      typeof solved !== 'boolean' ||
      typeof correct !== 'boolean'
    ) {
      return res.status(400).json({
        error:
          'Invalid payload. questionId, solved (boolean), and correct (boolean) are required.',
      });
    }

    const mobileSession = await getMobileSession(req);

    if (!mobileSession) {
      return res.status(401).json({
        error: 'Unauthorized',
      });
    }

    const userId = mobileSession.user.id;

    const [savedProgress] = await db
      .insert(questionProgress)
      .values({
        userId,
        questionId,
        correct,
        solved,
        lastAttemptedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [questionProgress.userId, questionProgress.questionId],
        set: {
          correct, // Updated so re-attempts overwrite past correctness
          solved,
          lastAttemptedAt: new Date(),
          updatedAt: new Date(),
        },
      })
      .returning();

    if (!savedProgress) {
      return res.status(500).json({
        error: 'Failed to save question progress',
      });
    }

    return res.status(200).json({
      message: 'Question progress saved successfully',
      savedProgress,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Error saving question progress:', msg);
    return res.status(500).json({
      error: msg,
    });
  }
};

export const GET = async (req: Request, res: Response) => {
  try {
    const mobileSession = await getMobileSession(req);

    if (!mobileSession) {
      return res.status(401).json({
        error: 'Unauthorized',
      });
    }

    const userId = mobileSession.user.id;

    // 1. Fetch latest progress records for the user
    const progress = await db
      .select()
      .from(questionProgress)
      .where(eq(questionProgress.userId, userId))
      .orderBy(desc(questionProgress.updatedAt))
      .limit(5);

    if (progress.length === 0) {
      return res.status(200).json({
        message: 'Question progress fetched successfully',
        data: [],
      });
    }

    // 2. Extract MongoDB question IDs
    const questionIds = progress.map(p => p.questionId);

    // 3. Fetch matching MongoDB documents using _id only
    const questions = await QuestionModel.find({
      _id: { $in: questionIds },
    }).lean();

    // 4. Map questions by string representation of _id
    const questionMap = new Map(questions.map(q => [q._id.toString(), q]));

    // 5. Merge progress data with corresponding question documents
    const result = progress.map(p => ({
      ...p,
      question: questionMap.get(p.questionId.toString()) ?? null,
    }));

    return res.status(200).json({
      message: 'Question progress fetched successfully',
      data: result,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);

    console.error('Error fetching question progress:', msg);

    return res.status(500).json({
      error: msg,
    });
  }
};

export const PUT = async (req: Request, res: Response) => {
  try {
    const { questionId, correct } = req.body;

    if (!questionId) {
      return res.status(400).json({
        error: 'questionId is required',
      });
    }

    const mobileSession = await getMobileSession(req);

    if (!mobileSession) {
      return res.status(401).json({
        error: 'Unauthorized',
      });
    }

    const userId = mobileSession.user.id;

    const updatePayload: Record<string, any> = {
      solved: true,
      lastAttemptedAt: new Date(),
      updatedAt: new Date(),
    };

    if (typeof correct === 'boolean') {
      updatePayload.correct = correct;
    }

    const [updatedProgress] = await db
      .update(questionProgress)
      .set(updatePayload)
      .where(
        and(
          eq(questionProgress.userId, userId),
          eq(questionProgress.questionId, questionId),
        ),
      )
      .returning();

    if (!updatedProgress) {
      return res.status(404).json({
        error: 'Question progress record not found',
      });
    }

    return res.status(200).json({
      message: 'Question progress updated successfully',
      updatedProgress,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Error updating question progress:', msg);
    return res.status(500).json({
      error: msg,
    });
  }
};
export const GET_STATS = async (req: Request, res: Response) => {
  try {
    const mobileSession = await getMobileSession(req);
    const userId = mobileSession?.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
      });
    }

    // 1. Fetch total solved count & correct count
    const [counts] = await db
      .select({
        totalSolved: count(questionProgress.id),
        totalCorrect: sql<number>`SUM(CASE WHEN ${questionProgress.correct} = true THEN 1 ELSE 0 END)`,
      })
      .from(questionProgress)
      .where(
        and(
          eq(questionProgress.userId, userId),
          eq(questionProgress.solved, true),
        ),
      );

    const totalSolved = Number(counts?.totalSolved || 0);
    const totalCorrect = Number(counts?.totalCorrect || 0);

    const accuracyPercentage =
      totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0;

    // 2. Fetch daily activity
    const now = new Date();
    const startOfWeek = new Date(now);
    const dayOfWeek = now.getDay();
    const distanceToMon = (dayOfWeek + 6) % 7;
    startOfWeek.setDate(now.getDate() - distanceToMon);
    startOfWeek.setHours(0, 0, 0, 0);

    const recentAttempts = await db
      .select({
        attemptedAt: questionProgress.lastAttemptedAt,
        correct: questionProgress.correct,
      })
      .from(questionProgress)
      .where(
        and(
          eq(questionProgress.userId, userId),
          eq(questionProgress.solved, true),
        ),
      )
      .orderBy(desc(questionProgress.lastAttemptedAt));

    // Calculate daily streak
    let streakDays = 0;
    const attemptedDates = new Set<string>();

    for (const record of recentAttempts) {
      if (record.attemptedAt) {
        const dateObj = new Date(record.attemptedAt);
        if (!isNaN(dateObj.getTime())) {
          attemptedDates.add(dateObj.toISOString().split('T')[0] as string);
        }
      }
    }

    let checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);

    const todayStr = checkDate.toISOString().split('T')[0] as string;
    if (!attemptedDates.has(todayStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (
      attemptedDates.has(checkDate.toISOString().split('T')[0] as string)
    ) {
      streakDays++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // 3. Group activity into days of the week (Mon-Sun)
    const daysOfWeek = [
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun',
    ] as const;
    type DayName = (typeof daysOfWeek)[number];

    const dailyCounts: Record<DayName, number> = {
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
      Sun: 0,
    };

    const currentWeekAttempts = recentAttempts.filter(r => {
      return r.attemptedAt ? new Date(r.attemptedAt) >= startOfWeek : false;
    });

    currentWeekAttempts.forEach(attempt => {
      if (!attempt.attemptedAt) return;
      const date = new Date(attempt.attemptedAt);
      const dayIndex = (date.getDay() + 6) % 7;
      const dayName = daysOfWeek[dayIndex];

      if (dayName) {
        dailyCounts[dayName] = (dailyCounts[dayName] || 0) + 1;
      }
    });

    const maxCountInWeek = Math.max(...Object.values(dailyCounts), 1);

    const weeklyActivity = daysOfWeek.map(day => ({
      day,
      count: dailyCounts[day],
      percentage: Math.round((dailyCounts[day] / maxCountInWeek) * 100),
    }));

    // 4. Weekly accuracy comparison
    const endOfLastWeek = new Date(startOfWeek);
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    const lastWeekAttempts = recentAttempts.filter(r => {
      if (!r.attemptedAt) return false;
      const attemptDate = new Date(r.attemptedAt);
      return attemptDate >= startOfLastWeek && attemptDate < endOfLastWeek;
    });

    const lastWeekSolved = lastWeekAttempts.length;
    const lastWeekCorrect = lastWeekAttempts.filter(r => r.correct).length;
    const lastWeekAccuracy =
      lastWeekSolved > 0
        ? Math.round((lastWeekCorrect / lastWeekSolved) * 100)
        : 0;

    const weeklyChangePercentage = accuracyPercentage - lastWeekAccuracy;

    return res.status(200).json({
      streakDays,
      totalSolved,
      totalTarget: 500,
      accuracyPercentage,
      weeklyChangePercentage,
      weeklyActivity,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Error fetching user stats:', msg);
    return res.status(500).json({
      error: msg,
    });
  }
};
