import type { Request, Response } from 'express';
import { QuestionModel } from '../db/mongodb/schema/question.schema.js';
import { getMobileSession } from '../utils/get-mobile-session.js';
import { db } from '../db/drizzle/index.js';
import { questionProgress } from '../db/schema.js';
import { and, eq, inArray } from 'drizzle-orm';
export const getSubjects = async (req: Request, res: Response) => {
  try {
    const { branch } = req.params;

    if (!branch) {
      return res.status(400).json({
        success: false,
        message: 'Branch is required',
      });
    }

    const subjects: string[] = await QuestionModel.distinct('mainTopic', {
      branch,
    });

    subjects.sort((a: string, b: string) => a.localeCompare(b));

    return res.status(200).json({
      success: true,
      branch,
      subjects,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Something went wrong';

    return res.status(500).json({
      success: false,
      message,
    });
  }
};
const escapeRegex = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const getquestions = async (req: Request, res: Response) => {
  try {
    const mobileSession = await getMobileSession(req);

    if (!mobileSession) {
      return res.status(401).json({
        error: 'Unauthorized',
      });
    }

    const userId = mobileSession.user.id;
    const { branch, mainTopic, page = '1', limit = '20' } = req.query;

    const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
    const limitNum = Math.min(
      100,
      Math.max(1, parseInt(String(limit), 10) || 20),
    );

    const filter: Record<string, unknown> = {};

    if (typeof branch === 'string' && branch.trim() && branch !== 'All') {
      filter.branch = new RegExp(`^${escapeRegex(branch.trim())}$`, 'i');
    }

    if (
      typeof mainTopic === 'string' &&
      mainTopic.trim() &&
      mainTopic !== 'All'
    ) {
      filter.mainTopic = new RegExp(`^${escapeRegex(mainTopic.trim())}$`, 'i');
    }

    const skip = (pageNum - 1) * limitNum;

    // 1. Fetch targeted page from MongoDB
    const [questions, totalQuestions] = await Promise.all([
      QuestionModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      QuestionModel.countDocuments(filter),
    ]);

    if (!questions.length) {
      return res.status(200).json({
        success: true,
        data: [],
        pagination: {
          total: totalQuestions,
          page: pageNum,
          limit: limitNum,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });
    }

    // 2. Fetch progress for retrieved questions from Postgres
    const questionIds = questions.map(q => q._id.toString());

    const progressList = await db
      .select({
        questionId: questionProgress.questionId,
        correct: questionProgress.correct,
        solved: questionProgress.solved,
        bookmarked: questionProgress.bookmarked,
        lastAttemptedAt: questionProgress.lastAttemptedAt,
      })
      .from(questionProgress)
      .where(
        and(
          eq(questionProgress.userId, userId),
          inArray(questionProgress.questionId, questionIds),
        ),
      );

    const progressMap = new Map(
      progressList.map(item => [
        item.questionId.toString().trim(),
        {
          correct: item.correct,
          solved: item.solved,
          bookmarked: item.bookmarked,
          lastAttemptedAt: item.lastAttemptedAt,
        },
      ]),
    );

    // 3. Map progress onto questions
    const result = questions.map(q => {
      const questionId = q._id.toString();
      return {
        ...q,
        progress: progressMap.get(questionId) ?? null,
      };
    });

    const totalPages = Math.ceil(totalQuestions / limitNum);

    return res.status(200).json({
      success: true,
      data: result,
      pagination: {
        total: totalQuestions,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPreviousPage: pageNum > 1,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Something went wrong';

    return res.status(500).json({
      success: false,
      message,
    });
  }
};
