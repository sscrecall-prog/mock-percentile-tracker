import { MockTest, SectionName } from '../types/mock';
import { WeakSectionDiagnosis, PerformanceInsight, MockVerdict } from '../types/analytics';
import { calculateSubjectStats } from './analyticsEngine';

export function diagnoseWeakSections(mocks: MockTest[]): WeakSectionDiagnosis[] {
  if (mocks.length === 0) return [];

  const subjectStats = calculateSubjectStats(mocks);
  const diagnoses: WeakSectionDiagnosis[] = [];

  for (const sub of subjectStats) {
    const reasons: string[] = [];
    let weaknessScore = 0;

    // Accuracy factor
    if (sub.averageAccuracy < 70) {
      reasons.push(`Low accuracy (${sub.averageAccuracy}%), leading to heavy negative marks`);
      weaknessScore += (70 - sub.averageAccuracy) * 1.5;
    }

    // Attempt rate factor
    if (sub.averageAttemptRate < 70) {
      reasons.push(`Low question coverage (${sub.averageAttemptRate}% attempted), leaving unattempted score potential`);
      weaknessScore += (70 - sub.averageAttemptRate) * 1.0;
    }

    // Time factor
    if (sub.averageTimeMinutes > 20) {
      reasons.push(`Consumes heavy test time (~${sub.averageTimeMinutes}m), pressurizing remaining sections`);
      weaknessScore += (sub.averageTimeMinutes - 20) * 1.8;
    }

    if (weaknessScore > 10) {
      diagnoses.push({
        sectionName: sub.sectionName,
        weaknessScore: Number(weaknessScore.toFixed(1)),
        reasons,
        averageAccuracy: sub.averageAccuracy,
        averageAttemptRate: sub.averageAttemptRate,
        wrongPenaltyImpact: Number(((100 - sub.averageAccuracy) * 0.5).toFixed(1)),
        timeInefficiency: sub.averageTimeMinutes > 18 ? 'High' : 'Moderate',
        recommendation: getSubjectRecommendation(sub.sectionName, sub.averageAccuracy, sub.averageAttemptRate)
      });
    }
  }

  // Sort by highest weakness score first
  return diagnoses.sort((a, b) => b.weaknessScore - a.weaknessScore);
}

function getSubjectRecommendation(name: SectionName, accuracy: number, attemptRate: number): string {
  if (name === 'Quantitative Aptitude') {
    if (accuracy < 75) return 'Practice topic-wise speed drills in Arithmetic (Percentages, CI/SI, Time & Work) to eliminate calculation traps.';
    return 'Attempt mixed sectional quizzes to improve question selection and skip heavy calculation puzzles early.';
  }
  if (name === 'General Intelligence & Reasoning') {
    return 'Focus on non-verbal analogies and circular seating arrangements with a strict 45-second timer per question.';
  }
  if (name === 'English Comprehension') {
    return 'Revise high-frequency Vocab / Idioms (PYQ 2018-2024) and read 1 editorial daily to speed up reading comprehension.';
  }
  if (name === 'General Awareness') {
    return 'Consolidate Static GK (Polity Articles, Modern History, National Parks) and last 6 months Current Affairs capsules.';
  }
  return 'Review mock errors in your notebook and re-attempt all wrong questions within 48 hours.';
}

export function generatePerformanceInsights(mocks: MockTest[]): PerformanceInsight[] {
  if (mocks.length === 0) {
    return [{
      id: 'empty-state',
      type: 'NEUTRAL',
      title: 'Ready for First Mock Test',
      message: 'Log your first mock test attempt to activate automatic percentile trajectory, AI diagnosis, and pacing intelligence.'
    }];
  }

  const insights: PerformanceInsight[] = [];
  const sorted = [...mocks].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const newestFirst = [...mocks].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 1. Streak & Consistency
  let streak = 0;
  for (const m of newestFirst) {
    if (m.isClearedCutoff) streak++;
    else break;
  }
  if (streak >= 3) {
    insights.push({
      id: 'streak-insight',
      type: 'POSITIVE',
      title: `${streak}-Mock Cutoff Clearance Streak! ??`,
      message: `You have cleared the target cutoff margin in ${streak} consecutive mocks. Keep maintaining this solid consistency.`,
      metric: 'Clearance Streak',
      value: `${streak} Mocks`
    });
  }

  // 2. Percentile Trajectory
  if (sorted.length >= 3) {
    const recent3 = sorted.slice(-3);
    const p1 = recent3[0].percentile;
    const p2 = recent3[1].percentile;
    const p3 = recent3[2].percentile;
    if (p3 > p2 && p2 > p1) {
      insights.push({
        id: 'percentile-gain',
        type: 'POSITIVE',
        title: 'Accelerating Percentile Momentum ??',
        message: `Your percentile has steadily increased across your last 3 attempts (${p1}% ? ${p2}% ? ${p3}%).`,
        metric: 'Percentile Delta',
        value: `+${(p3 - p1).toFixed(1)}%`
      });
    }
  }

  // 3. Subject Dominance vs Trap
  const subStats = calculateSubjectStats(mocks);
  if (subStats.length >= 2) {
    const sortedByAcc = [...subStats].sort((a, b) => b.averageAccuracy - a.averageAccuracy);
    const strongest = sortedByAcc[0];
    const weakest = sortedByAcc[sortedByAcc.length - 1];

    if (strongest.averageAccuracy >= 85) {
      insights.push({
        id: 'strongest-subject',
        type: 'POSITIVE',
        title: `${strongest.label} is Your Main Scoring Pillar ??`,
        message: `Consistent ${strongest.averageAccuracy}% accuracy in ${strongest.label} provides a dependable score foundation.`,
        metric: 'Best Accuracy',
        value: `${strongest.averageAccuracy}%`
      });
    }

    if (weakest.averageAccuracy < 72) {
      insights.push({
        id: 'weakest-subject',
        type: 'WARNING',
        title: `Negative Marks Spike in ${weakest.label} ??`,
        message: `Accuracy drops to ${weakest.averageAccuracy}% in ${weakest.label}. Skipping doubtful questions will directly increase your net score by +${((100 - weakest.averageAccuracy) * 0.3).toFixed(1)} marks.`,
        metric: 'Negative Drain',
        value: `${weakest.averageAccuracy}% Acc`
      });
    }
  }

  // 4. Time Efficiency
  const avgTime = mocks.reduce((sum, m) => sum + m.timeTakenMinutes, 0) / mocks.length;
  if (avgTime > 55) {
    insights.push({
      id: 'time-caution',
      type: 'NEUTRAL',
      title: 'Operating Close to Time Ceiling ??',
      message: `Averaging ${avgTime.toFixed(0)} min per 60 min test. Aim to build a 4-minute buffer for final review of marked questions.`,
      metric: 'Avg Test Time',
      value: `${avgTime.toFixed(0)}m`
    });
  }

  return insights;
}

export function generateIndividualMockVerdict(mock: MockTest, previousMocks: MockTest[]): MockVerdict {
  const previousSameType = previousMocks
    .filter(m => m.mockType === mock.mockType && m.id !== mock.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const prev = previousSameType[0];
  const scoreDiff = prev ? mock.score - prev.score : 0;
  const accDiff = prev ? mock.accuracy - prev.accuracy : 0;
  const percDiff = prev ? mock.percentile - prev.percentile : 0;
  const cutoffMargin = mock.score - mock.cutoffMarks;

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  for (const s of mock.sections) {
    if (s.accuracy >= 85) {
      strengths.push(`${s.sectionName} (${s.accuracy}% accuracy, ${s.score} marks)`);
    } else if (s.accuracy < 70 || s.wrong >= 4) {
      weaknesses.push(`${s.sectionName} (${s.accuracy}% accuracy, ${s.wrong} wrong answers)`);
    }
  }

  let summary = '';
  if (mock.isClearedCutoff) {
    if (prev && scoreDiff > 0) {
      summary = `Excellent progression! You comfortably cleared the cutoff by +${cutoffMargin.toFixed(1)} marks with a +${scoreDiff.toFixed(1)} score boost over your previous mock.`;
    } else {
      summary = `Cutoff Cleared! Strong overall performance maintaining a +${cutoffMargin.toFixed(1)} mark buffer over the cutoff benchmark.`;
    }
  } else {
    summary = `Below Cutoff by ${Math.abs(cutoffMargin).toFixed(1)} marks. Eliminating unforced errors in ${weaknesses[0] || 'low-accuracy sections'} will bridge this margin easily.`;
  }

  const paceVerdict = mock.timeTakenMinutes <= mock.totalTimeMinutes * 0.9 
    ? 'Fast and controlled pace with ample review margin.'
    : mock.timeTakenMinutes >= mock.totalTimeMinutes 
      ? 'Time pressure observed during the final 10 minutes.' 
      : 'Balanced and optimal pacing throughout the test.';

  return {
    summary,
    keyStrengths: strengths.length > 0 ? strengths : ['Solid overall attempt discipline'],
    criticalWeaknesses: weaknesses.length > 0 ? weaknesses : ['Minimal unforced errors'],
    vsPreviousScoreDiff: Number(scoreDiff.toFixed(1)),
    vsPreviousAccuracyDiff: Number(accDiff.toFixed(1)),
    vsPreviousPercentileDiff: Number(percDiff.toFixed(1)),
    cutoffMargin: Number(cutoffMargin.toFixed(1)),
    paceVerdict
  };
}
