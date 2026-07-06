export type SubjectId = "pinyin" | "chinese" | "math" | "english";

export type LessonStatus = "locked" | "unlocked" | "completed";

export type MistakeType =
  | "拼音错误"
  | "认字错误"
  | "听音错误"
  | "组词错误"
  | "计算错误"
  | "理解错误";

export interface ChineseChar {
  id: string;
  char: string;
  pinyin: string;
  pinyinPlain: string;
  grade: number;
  volume: "上册" | "下册" | "高频";
  unit: number;
  lesson: string;
  words: string[];
  sentence: string;
  strokeCount: number;
  strokeOrder: string[];
  radical: string;
  structure: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export interface Lesson {
  id: string;
  subject: SubjectId;
  title: string;
  subtitle: string;
  section: string;
  order: number;
  theme: string;
  minutes: number;
  charIds?: string[];
  questionCount: number;
  review?: boolean;
}

export interface QuizOption {
  id: string;
  label: string;
  speakText: string;
  visual?: string;
}

export interface QuizQuestion {
  id: string;
  subject: SubjectId;
  type: string;
  prompt: string;
  speakText: string;
  options: QuizOption[];
  answerId: string;
  charId?: string;
  mistakeType: MistakeType;
  visual?: string;
  hint?: string;
}

export interface CharLearningRecord {
  learned: boolean;
  correctCount: number;
  wrongCount: number;
  masteryLevel: number;
  lastPracticedAt?: string;
  nextReviewAt?: string;
  mistakeTypes: MistakeType[];
}

export interface LessonProgress {
  status: LessonStatus;
  bestScore: number;
  stars: number;
  attempts: number;
  lastCompletedAt?: string;
}

export interface MistakeRecord {
  id: string;
  char?: string;
  pinyin?: string;
  words?: string[];
  subject: SubjectId;
  title: string;
  mistakeTypes: MistakeType[];
  wrongCount: number;
  lastMistakeAt: string;
}

export interface RewardState {
  totalStars: number;
  coins: number;
  streakDays: number;
  petLevel: number;
  badges: string[];
  lastStudyDate?: string;
}

export interface DailyReport {
  date: string;
  questions: number;
  correct: number;
  wrong: number;
  stars: number;
  coins: number;
}

export interface QuizSummary {
  lesson: Lesson;
  total: number;
  correct: number;
  wrong: number;
  stars: number;
  coins: number;
  wrongQuestions: QuizQuestion[];
  touchedWrongQuestionIds: string[];
}
