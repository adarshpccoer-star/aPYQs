import type { Request, Response } from 'express';
import { QuestionModel } from '../db/mongodb/schema/question.schema.js';

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
    const { branch, mainTopic, page = '1', limit = '20' } = req.query;

    const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
    const limitNum = Math.min(
      100,
      Math.max(1, parseInt(String(limit), 10) || 20),
    );

    // Construct filter object
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

    // Execute query and count concurrently
    const [questions, totalQuestions] = await Promise.all([
      QuestionModel.find(filter)
        .sort({ createdAt: -1 }) // Added explicit sorting for stable pagination
        .skip(skip)
        .limit(limitNum)
        .lean(),
      QuestionModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalQuestions / limitNum);

    return res.status(200).json({
      success: true,
      data: questions,
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
