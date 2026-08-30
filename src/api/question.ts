// src/api/questions.ts
export interface QuestionOption {
  key: string;
  latex: string;
  images: string[];
  correct: boolean;
  wrong: boolean;
  selected: boolean;
  dataValue: string;
}
const API_BASE_URL = 'http://192.168.1.43:3000/api';

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
  if (branch && branch !== 'All') params.append('branch', branch);
  if (mainTopic && mainTopic !== 'All') params.append('mainTopic', mainTopic);
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  const response = await fetch(
    `${API_BASE_URL}/questions?${params.toString()}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch questions');
  }
  return response.json();
};
