import { pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const branchEnum = pgEnum('branch', [
  'AE', // Aerospace Engineering
  'AG', // Agricultural Engineering
  'AR', // Architecture and Planning
  'BM', // Biomedical Engineering
  'BT', // Biotechnology
  'CE', // Civil Engineering
  'CH', // Chemical Engineering
  'CS', // Computer Science & Information Technology
  'CY', // Chemistry
  'DA', // Data Science & Artificial Intelligence
  'EC', // Electronics & Communication Engineering
  'EE', // Electrical Engineering
  'ES', // Environmental Science & Engineering
  'EY', // Ecology & Evolution
  'GE', // Geomatics Engineering
  'GG', // Geology & Geophysics
  'IN', // Instrumentation Engineering
  'MA', // Mathematics
  'ME', // Mechanical Engineering
  'MN', // Mining Engineering
  'MT', // Metallurgical Engineering
  'NM', // Naval Architecture & Marine Engineering
  'PE', // Petroleum Engineering
  'PH', // Physics
  'PI', // Production & Industrial Engineering
  'ST', // Statistics
  'TF', // Textile Engineering & Fibre Science
  'XE', // Engineering Sciences
  'XH', // Humanities & Social Sciences
  'XL', // Life Sciences
]);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),

  githubId: text('github_id').unique().notNull(),

  username: text('username').notNull().unique(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),

  branch: branchEnum('branch').notNull(),

  avatar: text('avatar').default(
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuqagUH2Ovr0v9_ewMz4nuY8ZMoBVD3ujNkGymscQKNJmXRcaAtkohB-A&s=10',
  ),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});
