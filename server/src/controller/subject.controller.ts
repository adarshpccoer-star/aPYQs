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

    // Convert query params safely to strings
    const branchValue = typeof branch === 'string' ? branch : undefined;

    const mainTopicValue =
      typeof mainTopic === 'string' ? mainTopic : undefined;

    const pageValue = typeof page === 'string' ? page : '1';

    const limitValue = typeof limit === 'string' ? limit : '20';

    const pageNum = Math.max(1, Number.parseInt(pageValue, 10) || 1);

    const limitNum = Math.min(
      100,
      Math.max(1, Number.parseInt(limitValue, 10) || 20),
    );

    // Explicitly type the MongoDB filter
    const filter: {
      mainTopic?: RegExp;
      branch?: RegExp;
    } = {};
    if (mainTopicValue) {
      filter.mainTopic = new RegExp(`^${escapeRegex(mainTopicValue)}$`, 'i');
    }

    if (branchValue) {
      filter.branch = new RegExp(`^${escapeRegex(branchValue)}$`, 'i');
    }

    const skip = (pageNum - 1) * limitNum;

    const [questions, totalQuestions] = await Promise.all([
      QuestionModel.find(filter).skip(skip).limit(limitNum).lean(),

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
