import type { Request, Response } from 'express';

import { db } from '../db/drizzle/index.js';
import { profile } from '../db/schema/index.js';
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

export const formSubmit = async (req: Request, res: Response) => {
  try {
    const { username, branchCode, branchName, yearOfGate } = req.body;

    // Get the authenticated Better Auth session.
    // Never trust userId from the mobile app.
    const session = await getMobileSession(req);

    if (!session) {
      return res.status(401).json({
        error: 'Unauthorized',
      });
    }

    const userId = session.user.id;

    // Basic type validation.
    if (
      (username !== undefined &&
        username !== null &&
        typeof username !== 'string') ||
      typeof branchCode !== 'string' ||
      typeof branchName !== 'string' ||
      typeof yearOfGate !== 'number' ||
      !Number.isInteger(yearOfGate)
    ) {
      return res.status(400).json({
        error: 'Invalid profile data',
      });
    }

    // Validate branch code/name combination.
    const selectedBranch = GATE_BRANCHES.find(
      branch => branch.code === branchCode,
    );

    if (!selectedBranch || selectedBranch.name !== branchName) {
      return res.status(400).json({
        error: 'Invalid GATE branch',
      });
    }

    // Validate GATE year.
    const currentYear = new Date().getFullYear();

    if (yearOfGate < currentYear || yearOfGate > currentYear + 4) {
      return res.status(400).json({
        error: 'Invalid GATE year',
      });
    }

    const cleanUsername =
      typeof username === 'string' && username.trim() ? username.trim() : null;

    // Create or update the user's profile.
    const [savedProfile] = await db
      .insert(profile)
      .values({
        userId,
        username: cleanUsername,
        branchCode: selectedBranch.code,
        branchName: selectedBranch.name,
        yearOfGate,
      })
      .onConflictDoUpdate({
        target: profile.userId,
        set: {
          username: cleanUsername,
          branchCode: selectedBranch.code,
          branchName: selectedBranch.name,
          yearOfGate,
          updatedAt: new Date(),
        },
      })
      .returning();

    if (!savedProfile) {
      return res.status(500).json({
        error: 'Profile could not be created',
      });
    }

    return res.status(200).json({
      message: 'Profile completed successfully',
      user: {
        ...session.user,
        username: savedProfile.username,
        branch: savedProfile.branchName,
        branchCode: savedProfile.branchCode,
        yearOfGate: savedProfile.yearOfGate,
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
