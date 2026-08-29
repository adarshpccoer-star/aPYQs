import mongoose, { Schema } from 'mongoose';

export type ExamInfo = {
  title: string;
  url?: string;
};

export type TopicInfo = {
  title: string;
  url?: string;
};

export type QuestionMetadata = {
  year: number | null;
  set: string | null;
  yearSet: string | null;
  topicName: string | null;
};

export type QuestionOption = {
  key: string;
  latex: string;
  images: string[];
  correct: boolean;
  wrong: boolean;
  selected: boolean;
  dataValue: string | null;
};

export type Question = {
  branch: string;
  number: number;
  type: string;
  marks: number | null;

  questionLatex: string;
  questionImages: string[];

  options: QuestionOption[];

  answer: string | string[] | null;
  explanationLatex: string | null;

  exam: ExamInfo | null;

  mainTopic: string;
  topic: string | null;

  metadata: QuestionMetadata;

  sourceUrl: string;
};

const questionOptionSchema = new Schema<QuestionOption>(
  {
    key: { type: String, required: true },
    latex: { type: String, default: '' },
    images: { type: [String], default: [] },
    correct: { type: Boolean, default: false },
    wrong: { type: Boolean, default: false },
    selected: { type: Boolean, default: false },
    dataValue: { type: String, default: null },
  },
  { _id: false },
);

const examInfoSchema = new Schema<ExamInfo>(
  {
    title: { type: String, required: true },
    url: { type: String, default: null },
  },
  { _id: false },
);

const questionMetadataSchema = new Schema<QuestionMetadata>(
  {
    year: { type: Number, default: null },
    set: { type: String, default: null },
    yearSet: { type: String, default: null },
    topicName: { type: String, default: null },
  },
  { _id: false },
);

const questionSchema = new Schema<Question>(
  {
    branch: {
      type: String,
      required: true,
      index: true,
    },

    number: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    marks: {
      type: Number,
      default: null,
    },

    questionLatex: {
      type: String,
      default: '',
    },

    questionImages: {
      type: [String],
      default: [],
    },

    options: {
      type: [questionOptionSchema],
      default: [],
    },

    answer: {
      type: Schema.Types.Mixed,
      default: null,
    },

    explanationLatex: {
      type: String,
      default: null,
    },

    exam: {
      type: examInfoSchema,
      default: null,
    },

    mainTopic: {
      type: String,
      required: true,
      index: true,
    },

    topic: {
      type: String,
      default: null,
      index: true,
    },

    metadata: {
      type: questionMetadataSchema,
      default: {},
    },

    sourceUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

questionSchema.index({
  branch: 1,
  type: 1,
  mainTopic: 1,
  topic: 1,
});

questionSchema.index(
  {
    sourceUrl: 1,
    number: 1,
  },
  {
    unique: true,
  },
);

mongoose.model<Question>('Question', questionSchema);

export default mongoose.model<Question>('Question', questionSchema);

export const QuestionModel = mongoose.model<Question>(
  'Question',
  questionSchema,
);
