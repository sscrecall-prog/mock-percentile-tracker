import { ExamType } from './mock';

export type ThemeMode = 'dark' | 'light' | 'warm-cream' | 'system';

export interface UserSettings {
  selectedExam: ExamType;
  customExamName?: string;
  targetPercentile: number;
  targetScore: number;
  theme: ThemeMode;
  enable3D: boolean;
  reducedMotion: boolean;
  defaultTimeLimitMinutes: number;
  defaultNegativeMarkRatio: number; // e.g. 0.5 marks deduction for 2 marks question = 0.25 ratio
}

export interface ImportSummary {
  totalFound: number;
  importedCount: number;
  skippedCount: number;
  errors: string[];
}
