export type ExamType = 'SSC CGL' | 'SSC CHSL' | 'SSC MTS' | 'RRB NTPC' | 'IBPS PO' | 'SBI PO' | 'Custom';

export type ExamTier = 'Tier 1' | 'Tier 2' | 'Prelims' | 'Mains' | 'General';

export type MockTestType = 'FULL_LENGTH' | 'SECTIONAL' | 'SUBJECT' | 'PYQ' | 'CUSTOM';

export type SectionName = 
  | 'Quantitative Aptitude'
  | 'General Intelligence & Reasoning'
  | 'English Comprehension'
  | 'General Awareness'
  | 'Computer Knowledge'
  | 'Custom';

export interface SectionPerformance {
  id: string;
  mockId: string;
  sectionName: SectionName;
  customName?: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  unattempted: number;
  maxMarks: number;
  score: number;
  accuracy: number; // 0 to 100
  timeTakenMinutes: number;
  status: 'Mastered' | 'Strong' | 'Average' | 'Needs Improvement' | 'Critical';
}

export interface MockTest {
  id: string;
  testName: string;
  exam: ExamType;
  customExamName?: string;
  tier: ExamTier;
  mockType: MockTestType;
  testPlatform: string;
  date: string; // YYYY-MM-DD
  createdAt: number; // timestamp
  totalQuestions: number;
  maxMarks: number;
  totalTimeMinutes: number;
  timeTakenMinutes: number;
  attempted: number;
  correct: number;
  wrong: number;
  unattempted: number;
  score: number;
  negativeMarks: number;
  accuracy: number;
  attemptRate: number;
  percentile: number;
  rank?: number;
  totalStudents?: number;
  cutoffMarks: number;
  isClearedCutoff: boolean;
  subjectName?: SectionName;
  topicFocus?: string;
  sections: SectionPerformance[];
  weakAreas: string[];
  analysisNotes?: string;
  isDemo?: boolean;
}

export interface MockFilters {
  search: string;
  exam: ExamType | 'ALL';
  platform?: string | 'ALL';
  subject?: SectionName | 'ALL';
  tier: ExamTier | 'ALL';
  mockType: MockTestType | 'ALL';
  cutoffStatus: 'ALL' | 'CLEARED' | 'NOT_CLEARED';
  dateRange: 'ALL' | '7_DAYS' | '30_DAYS' | '90_DAYS';
  sortBy: 'date' | 'score' | 'percentile' | 'accuracy' | 'time';
  sortOrder: 'asc' | 'desc';
}
