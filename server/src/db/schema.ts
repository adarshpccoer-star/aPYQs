// src/db/schema.ts
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  uniqueIndex,
  index,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';

export const branchEnum = pgEnum('branch', [
  'AE',
  'AG',
  'AR',
  'BM',
  'BT',
  'CE',
  'CH',
  'CS',
  'CY',
  'DA',
  'EC',
  'EE',
  'ES',
  'EY',
  'GE',
  'GG',
  'IN',
  'MA',
  'ME',
  'MN',
  'MT',
  'NM',
  'PE',
  'PH',
  'PI',
  'ST',
  'TF',
  'XE',
  'XH',
  'XL',
]);

export const branchNameEnum = pgEnum('branch_name', [
  'Aerospace Engineering',
  'Agricultural Engineering',
  'Architecture and Planning',
  'Biomedical Engineering',
  'Biotechnology',
  'Civil Engineering',
  'Chemical Engineering',
  'Computer Science and Information Technology',
  'Chemistry',
  'Data Science and Artificial Intelligence',
  'Electronics and Communication Engineering',
  'Electrical Engineering',
  'Environmental Science and Engineering',
  'Ecology and Evolution',
  'Geomatics Engineering',
  'Geology and Geophysics',
  'Instrumentation Engineering',
  'Mathematics',
  'Mechanical Engineering',
  'Mining Engineering',
  'Metallurgical Engineering',
  'Naval Architecture and Marine Engineering',
  'Petroleum Engineering',
  'Physics',
  'Production and Industrial Engineering',
  'Statistics',
  'Textile Engineering and Fibre Science',
  'Engineering Sciences',
  'Humanities and Social Sciences',
  'Life Sciences',
]);
export const user = pgTable('user', {
  id: text('id').primaryKey(),

  name: text('name').notNull(),

  email: text('email').notNull().unique(),

  emailVerified: boolean('emailVerified').notNull(),

  image: text('image'),

  // Profile fields

  branchCode: branchEnum('branchCode'),

  branchName: branchNameEnum('branchName'),

  yearOfGate: integer('yearOfGate'),

  createdAt: timestamp('createdAt', { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expiresAt', { withTimezone: true }).notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('createdAt', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull(),
    ipAddress: text('ipAddress'),
    userAgent: text('userAgent'),
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  table => [index('session_userId_idx').on(table.userId)],
);
export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    issuer: text('issuer').notNull(),
    accountId: text('accountId').notNull(),
    providerId: text('providerId').notNull(),

    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),

    accessToken: text('accessToken'),
    refreshToken: text('refreshToken'),
    idToken: text('idToken'),
    accessTokenExpiresAt: timestamp('accessTokenExpiresAt', {
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt', {
      withTimezone: true,
    }),
    scope: text('scope'),
    password: text('password'),

    createdAt: timestamp('createdAt', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull(),
  },
  table => [
    index('account_userId_idx').on(table.userId),
    uniqueIndex('account_issuer_accountId_uidx').on(
      table.issuer,
      table.accountId,
    ),
  ],
);
export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expiresAt', { withTimezone: true }).notNull(),
    createdAt: timestamp('createdAt', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  table => [index('verification_identifier_idx').on(table.identifier)],
);

export const questionProgress = pgTable(
  'questionProgress',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    userId: text('userId')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
      }),

    questionId: text('questionId').notNull(),

    correct: boolean('correct').notNull(),

    solved: boolean('solved').notNull().default(true),

    bookmarked: boolean('bookmarked').notNull().default(false),

    lastAttemptedAt: timestamp('lastAttemptedAt', {
      withTimezone: true,
    }),

    createdAt: timestamp('createdAt', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp('updatedAt', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },

  table => [
    unique('user_question_unique').on(table.userId, table.questionId),

    index('question_progress_user_idx').on(table.userId),

    index('question_progress_question_idx').on(table.questionId),
  ],
);
