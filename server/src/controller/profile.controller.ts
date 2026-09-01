import type { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db/drizzle/index.js';
import { user } from '../db/schema.js';
import { getMobileSession } from '../utils/get-mobile-session.js';

const GATE_BRANCHES = [
  { code: 'AE', name: 'Aerospace Engineering' },
  { code: 'AG', name: 'Agricultural Engineering' },
  { code: 'AR', name: 'Architecture and Planning' },
  { code: 'BM', name: 'Biomedical Engineering' },
  { code: 'BT', name: 'Biotechnology' },
  { code: 'CE', name: 'Civil Engineering' },
  { code: 'CH', name: 'Chemical Engineering' },
  { code: 'CS', name: 'Computer Science and Information Technology' },
  { code: 'CY', name: 'Chemistry' },
  { code: 'DA', name: 'Data Science and Artificial Intelligence' },
  { code: 'EC', name: 'Electronics and Communication Engineering' },
  { code: 'EE', name: 'Electrical Engineering' },
  { code: 'ES', name: 'Environmental Science and Engineering' },
  { code: 'EY', name: 'Ecology and Evolution' },
  { code: 'GE', name: 'Geomatics Engineering' },
  { code: 'GG', name: 'Geology and Geophysics' },
  { code: 'IN', name: 'Instrumentation Engineering' },
  { code: 'MA', name: 'Mathematics' },
  { code: 'ME', name: 'Mechanical Engineering' },
  { code: 'MN', name: 'Mining Engineering' },
  { code: 'MT', name: 'Metallurgical Engineering' },
  { code: 'NM', name: 'Naval Architecture and Marine Engineering' },
  { code: 'PE', name: 'Petroleum Engineering' },
  { code: 'PH', name: 'Physics' },
  { code: 'PI', name: 'Production and Industrial Engineering' },
  { code: 'ST', name: 'Statistics' },
  { code: 'TF', name: 'Textile Engineering and Fibre Science' },
  { code: 'XE', name: 'Engineering Sciences' },
  { code: 'XH', name: 'Humanities and Social Sciences' },
  { code: 'XL', name: 'Life Sciences' },
] as const;
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { branchCode, branchName, yearOfGate } = req.body;

    // Get authenticated user from the mobile session.
    const session = await getMobileSession(req);

    if (!session) {
      return res.status(401).json({
        error: 'Unauthorized',
      });
    }

    const userId = session.user.id;

    // Validate required fields.
    if (
      typeof branchCode !== 'string' ||
      typeof branchName !== 'string' ||
      typeof yearOfGate !== 'number' ||
      !Number.isInteger(yearOfGate)
    ) {
      return res.status(400).json({
        error: 'branchCode, branchName and yearOfGate are required',
      });
    }

    // Validate branch code.
    const selectedBranch = GATE_BRANCHES.find(
      branch => branch.code === branchCode,
    );

    if (!selectedBranch) {
      return res.status(400).json({
        error: 'Invalid GATE branch code',
      });
    }

    // Validate branch name against branch code.
    if (branchName !== selectedBranch.name) {
      return res.status(400).json({
        error: 'Branch name does not match branch code',
      });
    }

    // Validate GATE year.
    const currentYear = new Date().getFullYear();

    if (yearOfGate < currentYear || yearOfGate > currentYear + 4) {
      return res.status(400).json({
        error: 'Invalid GATE year',
      });
    }

    // Update authenticated user's profile.
    const [updatedUser] = await db
      .update(user)
      .set({
        branchCode: selectedBranch.code,
        branchName: selectedBranch.name,
        yearOfGate,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId))
      .returning();

    if (!updatedUser) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        emailVerified: updatedUser.emailVerified,
        image: updatedUser.image,
        branchCode: updatedUser.branchCode,
        branchName: updatedUser.branchName,
        yearOfGate: updatedUser.yearOfGate,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    console.error('UPDATE PROFILE ERROR:', error);

    const message = error instanceof Error ? error.message : String(error);

    return res.status(500).json({
      error: 'Failed to update profile',
      details: message,
    });
  }
};
export const formSubmit = async (req: Request, res: Response) => {
  try {
    const { branchCode, branchName, yearOfGate } = req.body;

    // Get authenticated user from the mobile session.
    const session = await getMobileSession(req);

    if (!session) {
      return res.status(401).json({
        error: 'Unauthorized',
      });
    }

    const userId = session.user.id;

    // Validate required fields.
    if (
      typeof branchCode !== 'string' ||
      typeof branchName !== 'string' ||
      typeof yearOfGate !== 'number' ||
      !Number.isInteger(yearOfGate)
    ) {
      return res.status(400).json({
        error: 'branchCode, branchName and yearOfGate are required',
      });
    }

    // Validate branchCode against trusted server-side list.
    const selectedBranch = GATE_BRANCHES.find(
      branch => branch.code === branchCode,
    );

    if (!selectedBranch) {
      return res.status(400).json({
        error: 'Invalid GATE branch code',
      });
    }

    // Make sure branchName matches the branchCode.
    if (branchName !== selectedBranch.name) {
      return res.status(400).json({
        error: 'Branch name does not match branch code',
      });
    }

    // Validate GATE year.
    const currentYear = new Date().getFullYear();

    if (yearOfGate < currentYear || yearOfGate > currentYear + 4) {
      return res.status(400).json({
        error: 'Invalid GATE year',
      });
    }

    // Update authenticated user's profile.
    const [updatedUser] = await db
      .update(user)
      .set({
        branchCode: selectedBranch.code,
        branchName: selectedBranch.name,
        yearOfGate,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId))
      .returning();

    if (!updatedUser) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    return res.status(200).json({
      message: 'Profile completed successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        emailVerified: updatedUser.emailVerified,
        image: updatedUser.image,
        branchCode: updatedUser.branchCode,
        branchName: updatedUser.branchName,
        yearOfGate: updatedUser.yearOfGate,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    console.error('PROFILE UPDATE ERROR:', error);

    const message = error instanceof Error ? error.message : String(error);

    return res.status(500).json({
      error: 'Failed to update profile',
      details: message,
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const session = await getMobileSession(req);

    if (!session) {
      return res.status(401).json({
        error: 'Unauthorized',
      });
    }

    const userId = session.user.id;

    const [userProfile] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        branchCode: user.branchCode,
        branchName: user.branchName,
        yearOfGate: user.yearOfGate,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!userProfile) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    // Profile is incomplete.
    if (
      !userProfile.branchCode ||
      !userProfile.branchName ||
      userProfile.yearOfGate === null ||
      userProfile.yearOfGate === undefined
    ) {
      return res.status(404).json({
        error: 'Profile not found',
      });
    }

    return res.status(200).json({
      message: 'Profile fetched successfully',
      user: userProfile,
    });
  } catch (error) {
    console.error('GET PROFILE ERROR:', error);

    const message = error instanceof Error ? error.message : String(error);

    return res.status(500).json({
      error: 'Failed to fetch profile',
      details: message,
    });
  }
};
