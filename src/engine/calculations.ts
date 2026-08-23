import { MockTest, SectionPerformance, SectionName } from '../types/mock';

/**
 * Derives performance status for section or overall test
 */
export function getPerformanceStatus(
  accuracy: number,
  attemptRate: number
): 'Mastered' | 'Strong' | 'Average' | 'Needs Improvement' | 'Critical' {
  if (accuracy >= 90 && attemptRate >= 85) return 'Mastered';
  if (accuracy >= 80 && attemptRate >= 75) return 'Strong';
  if (accuracy >= 70 && attemptRate >= 60) return 'Average';
  if (accuracy >= 55) return 'Needs Improvement';
  return 'Critical';
}

/**
 * Auto-calculates section metrics
 */
export function calculateSectionMetrics(
  totalQuestions: number,
  correct: number,
  wrong: number,
  marksPerCorrect: number = 2,
  negativePerWrong: number = 0.5,
  timeTakenMinutes: number = 15
): {
  attempted: number;
  unattempted: number;
  score: number;
  accuracy: number;
  maxMarks: number;
  status: 'Mastered' | 'Strong' | 'Average' | 'Needs Improvement' | 'Critical';
} {
  const attempted = Math.min(totalQuestions, Math.max(0, correct + wrong));
  const unattempted = Math.max(0, totalQuestions - attempted);
  const maxMarks = totalQuestions * marksPerCorrect;
  const score = Math.max(-maxMarks, correct * marksPerCorrect - wrong * negativePerWrong);
  const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;
  const attemptRate = totalQuestions > 0 ? (attempted / totalQuestions) * 100 : 0;
  const status = getPerformanceStatus(accuracy, attemptRate);

  return {
    attempted,
    unattempted,
    score: Number(score.toFixed(2)),
    accuracy: Number(accuracy.toFixed(2)),
    maxMarks,
    status
  };
}

/**
 * Validates mock test data constraints
 */
export function validateMockTestData(data: Partial<MockTest>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.testName || data.testName.trim().length === 0) {
    errors.push('Mock test title is required.');
  }

  const totalQuestions = data.totalQuestions || 0;
  const correct = data.correct || 0;
  const wrong = data.wrong || 0;
  const attempted = data.attempted || 0;
  const unattempted = data.unattempted || 0;
  const maxMarks = data.maxMarks || 0;
  const score = data.score || 0;
  const percentile = data.percentile ?? -1;

  if (totalQuestions <= 0) {
    errors.push('Total questions must be greater than 0.');
  }

  if (correct < 0 || wrong < 0) {
    errors.push('Correct and wrong questions cannot be negative.');
  }

  if (correct + wrong !== attempted) {
    errors.push(`Attempted questions (${attempted}) must equal correct (${correct}) + wrong (${wrong}).`);
  }

  if (attempted + unattempted !== totalQuestions) {
    errors.push(`Attempted (${attempted}) + Unattempted (${unattempted}) must equal Total Questions (${totalQuestions}).`);
  }

  if (maxMarks <= 0) {
    errors.push('Maximum marks must be greater than 0.');
  }

  if (score > maxMarks) {
    errors.push(`Score (${score}) cannot exceed maximum marks (${maxMarks}).`);
  }

  if (percentile < 0 || percentile > 100) {
    errors.push('Percentile must be between 0.00 and 100.00.');
  }

  if ((data.timeTakenMinutes || 0) < 0) {
    errors.push('Time taken cannot be negative.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
