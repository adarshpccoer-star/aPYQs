import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  uniqueIndex,
  index,
  foreignKey,
  primaryKey,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

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

// 2. GATE Branch Names (Matched 1:1 with Codes above)
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
export const account = pgTable(
  'account',
  {
    id: text().primaryKey(),
    issuer: text().notNull(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp({ withTimezone: true }),
    refreshTokenExpiresAt: timestamp({ withTimezone: true }),
    scope: text(),
    password: text(),
    createdAt: timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ withTimezone: true }).notNull(),
  },
  table => [
    uniqueIndex('account_issuer_accountId_uidx').using(
      'btree',
      table.issuer.asc().nullsLast(),
      table.accountId.asc().nullsLast(),
    ),
    index('account_userId_idx').using('btree', table.userId.asc().nullsLast()),
  ],
);

export const session = pgTable(
  'session',
  {
    id: text().primaryKey(),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    token: text().notNull(),
    createdAt: timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ withTimezone: true }).notNull(),
    ipAddress: text(),
    userAgent: text(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  table => [
    index('session_userId_idx').using('btree', table.userId.asc().nullsLast()),
    unique('session_token_key').on(table.token),
  ],
);

export const user = pgTable(
  'user',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    emailVerified: boolean('email_verified').notNull(),
    image: text('image'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  table => [unique('user_email_key').on(table.email)],
);

export const verification = pgTable(
  'verification',
  {
    id: text().primaryKey(),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    createdAt: timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  table => [
    index('verification_identifier_idx').using(
      'btree',
      table.identifier.asc().nullsLast(),
    ),
  ],
);
export const profile = pgTable('profile', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: 'cascade' }),
  username: text('username'),
  branchCode: branchEnum('branch_code').notNull(),
  branchName: branchNameEnum('branch_name').notNull(),
  yearOfGate: integer('year_of_gate').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
export const questionProgress = pgTable(
  'question_progress',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),

    questionId: text('question_id').notNull(),

    solved: boolean('solved').notNull().default(false),

    bookmarked: boolean('bookmarked').notNull().default(false),

    lastAttemptedAt: timestamp('last_attempted_at', {
      withTimezone: true,
    }),

    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp('updated_at', {
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
