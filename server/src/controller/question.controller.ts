import type { Request, Response } from 'express';
import { eq, and } from 'drizzle-orm';

import { questionProgress } from '../db/schema.js';
import { getMobileSession } from '../utils/get-mobile-session.js';
import { db } from '../db/drizzle/index.js';

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

    const progress = await db
      .select()
      .from(questionProgress)
      .where(eq(questionProgress.userId, userId));

    return res.status(200).json({
      message: 'Question progress fetched successfully',
      progress,
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
