import { MockTest, SectionName } from './mock';

export interface OverallKPIs {
  totalMocks: number;
  averageScore: number;
  bestScore: number;
  lowestScore: number;
  averageAccuracy: number;
  bestAccuracy: number;
  averagePercentile: number;
  bestPercentile: number;
  lowestPercentile: number;
  totalFullLengthMocks: number;
  fullLengthCutoffRate: number;
  consecutiveClearanceStreak: number;
  bestClearanceStreak: number;
}

export interface SubjectStat {
  sectionName: SectionName;
  label: string;
  averageScore: number;
  maxMarks: number;
  averageAccuracy: number;
  averageAttemptRate: number;
  averageTimeMinutes: number;
  bestScore: number;
  attemptsCount: number;
  status: 'Mastered' | 'Strong' | 'Average' | 'Needs Improvement' | 'Critical';
  color: string;
  icon: string;
}

export interface WeakSectionDiagnosis {
  sectionName: SectionName;
  weaknessScore: number; // higher = weaker
  reasons: string[];
  averageAccuracy: number;
  averageAttemptRate: number;
  wrongPenaltyImpact: number;
  timeInefficiency: string;
  recommendation: string;
}

export interface PerformanceInsight {
  id: string;
  type: 'POSITIVE' | 'WARNING' | 'NEUTRAL' | 'MILESTONE';
  title: string;
  message: string;
  metric?: string;
  value?: string;
}

export interface MockVerdict {
  summary: string;
  keyStrengths: string[];
  criticalWeaknesses: string[];
  vsPreviousScoreDiff: number;
  vsPreviousAccuracyDiff: number;
  vsPreviousPercentileDiff: number;
  cutoffMargin: number;
  paceVerdict: string;
}
