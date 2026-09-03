import type { Request, Response } from 'express';
import { eq, and, desc } from 'drizzle-orm';

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
