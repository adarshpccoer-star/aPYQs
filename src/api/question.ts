// src/api/questions.ts

import path from 'node:path';
import * as Keychain from 'react-native-keychain';

const API_BASE_URL = 'http://192.168.1.43:3000/api';
const KEYCHAIN_SERVICE = 'com.apyqs.auth';

export interface QuestionOption {
  key: string;
  latex: string;
  images: string[];
  correct: boolean;
  wrong: boolean;
  selected: boolean;
  dataValue: string;
}

export interface QuestionProgress {
  correct: boolean;
  solved: boolean;
  bookmarked: boolean;
  lastAttemptedAt: string | null;
}

export interface Question {
  _id: { $oid: string } | string;
  sourceUrl: string;
  number: number;
  answer: string[];
  branch: string;
  exam: {
    title: string;
    url: string;
  };
  explanationLatex: string;
  mainTopic: string;
  marks: number | null;
  metadata: {
    year: number;
    set: string | null;
    yearSet: string;
    topicName: string | null;
  };
  options: QuestionOption[];
  questionImages: string[];
  questionLatex: string;
  type: 'MCQ' | 'MSQ' | 'NAT';
  progress: QuestionProgress | null;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface QuestionsResponse {
  success: boolean;
  data: Question[];
  pagination: PaginationInfo;
}

export interface SubjectsResponse {
  success: boolean;
  branch: string;
  subjects: string[];
}

/**
 * Get the saved Better Auth mobile session token.
 */
const getSessionToken = async (): Promise<string> => {
  const credentials = await Keychain.getGenericPassword({
    service: KEYCHAIN_SERVICE,
  });

  if (!credentials) {
    throw new Error('No authenticated session found');
  }

  return credentials.password;
};

export const fetchSubjects = async (
  branch: string,
): Promise<SubjectsResponse> => {
  const url = `${API_BASE_URL}/subject/${encodeURIComponent(branch)}`;

  console.log('Fetching subjects:', url);

  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text();

    throw new Error(`Failed to fetch subjects (${response.status}): ${text}`);
  }

  const data: SubjectsResponse = await response.json();

  console.log('Subjects response:', data);

  return data;
};

export const fetchQuestions = async (
  branch?: string,
  mainTopic?: string,
  page: number = 1,
  limit: number = 20,
): Promise<QuestionsResponse> => {
  const params = new URLSearchParams();

  if (branch && branch !== 'All') {
    params.append('branch', branch);
  }

  if (mainTopic && mainTopic !== 'All') {
    params.append('mainTopic', mainTopic);
  }

  params.append('page', page.toString());
  params.append('limit', limit.toString());

  const url = `${API_BASE_URL}/questions?${params.toString()}`;

  console.log('Fetching questions:', url);

  // Get authenticated mobile session token
  const sessionToken = await getSessionToken();

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  console.log('Questions response status:', response.status);

  if (!response.ok) {
    const text = await response.text();

    console.error('Questions API error:', text);

    throw new Error(`Failed to fetch questions (${response.status}): ${text}`);
  }

  const data: QuestionsResponse = await response.json();

  console.log('Questions received:', data.data.length);

  return data;
};

// src/api/question.ts (or wherever fetchQuestions is defined)

export interface SaveProgressPayload {
  questionId: string;
  solved: boolean;
  correct: boolean;
}
// src/api/questions.ts

export const saveQuestionProgress = async (
  payload: SaveProgressPayload,
  token?: string,
) => {
  try {
    // If no token is passed, retrieve it automatically from Keychain
    const sessionToken = token || (await getSessionToken());

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionToken}`,
    };

    console.log('Posting question progress:', payload);

    const response = await fetch(`${API_BASE_URL}/questionProgress`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Server error response:', response.status, data);
      throw new Error(
        data.error || `Server responded with status ${response.status}`,
      );
    }

    return data;
  } catch (error) {
    console.error('saveQuestionProgress failed:', error);
    throw error;
  }
};

export const fetchProgress = async () => {
  try {
    const sessionToken = await getSessionToken();
    if (!sessionToken) {
      console.log('session token not found');
      return;
    }
    const response = await fetch(`${API_BASE_URL}/questionProgress`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${sessionToken}` },
    });
    const data = await response.json();
    console.log('progress data:', data);
    return data;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.log(
      'error spotted at the /home/adarsh/Desktop/aPYQs/src/api/question.ts:fetchProgress',
      msg,
    );
  }
};
