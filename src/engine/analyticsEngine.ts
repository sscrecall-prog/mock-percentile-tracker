import { MockTest, MockTestType, SectionName } from '../types/mock';
import { OverallKPIs, SubjectStat } from '../types/analytics';
import { THEME_COLORS } from '../theme/colors';
import { getPerformanceStatus } from './calculations';

export function calculateOverallKPIs(mocks: MockTest[]): OverallKPIs {
  if (mocks.length === 0) {
    return {
      totalMocks: 0,
      averageScore: 0,
      bestScore: 0,
      lowestScore: 0,
      averageAccuracy: 0,
      bestAccuracy: 0,
      averagePercentile: 0,
      bestPercentile: 0,
      lowestPercentile: 0,
      totalFullLengthMocks: 0,
      fullLengthCutoffRate: 0,
      consecutiveClearanceStreak: 0,
      bestClearanceStreak: 0
    };
  }

  const scores = mocks.map(m => m.score);
  const accuracies = mocks.map(m => m.accuracy);
  const percentiles = mocks.map(m => m.percentile);

  const fullMocks = mocks.filter(m => m.mockType === 'FULL_LENGTH');
  const fullCleared = fullMocks.filter(m => m.isClearedCutoff);

  // Consecutive clearance streak (newest first)
  const sortedDesc = [...mocks].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  let streak = 0;
  for (const m of sortedDesc) {
    if (m.isClearedCutoff) streak++;
    else break;
  }

  // Best clearance streak (chronological)
  const sortedAsc = [...mocks].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let bestStreak = 0;
  let currentS = 0;
  for (const m of sortedAsc) {
    if (m.isClearedCutoff) {
      currentS++;
      if (currentS > bestStreak) bestStreak = currentS;
    } else {
      currentS = 0;
    }
  }

  return {
    totalMocks: mocks.length,
    averageScore: Number((scores.reduce((a, b) => a + b, 0) / mocks.length).toFixed(1)),
    bestScore: Number(Math.max(...scores).toFixed(1)),
    lowestScore: Number(Math.min(...scores).toFixed(1)),
    averageAccuracy: Number((accuracies.reduce((a, b) => a + b, 0) / mocks.length).toFixed(1)),
    bestAccuracy: Number(Math.max(...accuracies).toFixed(1)),
    averagePercentile: Number((percentiles.reduce((a, b) => a + b, 0) / mocks.length).toFixed(1)),
    bestPercentile: Number(Math.max(...percentiles).toFixed(1)),
    lowestPercentile: Number(Math.min(...percentiles).toFixed(1)),
    totalFullLengthMocks: fullMocks.length,
    fullLengthCutoffRate: fullMocks.length > 0 ? Number(((fullCleared.length / fullMocks.length) * 100).toFixed(0)) : 0,
    consecutiveClearanceStreak: streak,
    bestClearanceStreak: bestStreak
  };
}

export function calculateSubjectStats(mocks: MockTest[]): SubjectStat[] {
  const sectionsMap = new Map<SectionName, {
    scores: number[];
    maxMarks: number[];
    accuracies: number[];
    attemptRates: number[];
    times: number[];
    bestScore: number;
    count: number;
  }>();

  const standardSections: { name: SectionName; label: string; icon: string }[] = [
    { name: 'Quantitative Aptitude', label: 'Quantitative Aptitude', icon: '??' },
    { name: 'General Intelligence & Reasoning', label: 'Reasoning & GI', icon: '?' },
    { name: 'English Comprehension', label: 'English Comprehension', icon: '??' },
    { name: 'General Awareness', label: 'General Awareness', icon: '??' },
    { name: 'Computer Knowledge', label: 'Computer Knowledge', icon: '??' },
  ];

  for (const mock of mocks) {
    for (const sec of mock.sections) {
      const existing = sectionsMap.get(sec.sectionName) || {
        scores: [],
        maxMarks: [],
        accuracies: [],
        attemptRates: [],
        times: [],
        bestScore: 0,
        count: 0
      };

      existing.scores.push(sec.score);
      existing.maxMarks.push(sec.maxMarks);
      existing.accuracies.push(sec.accuracy);
      const attemptRate = sec.totalQuestions > 0 ? (sec.attempted / sec.totalQuestions) * 100 : 0;
      existing.attemptRates.push(attemptRate);
      existing.times.push(sec.timeTakenMinutes);
      existing.bestScore = Math.max(existing.bestScore, sec.score);
      existing.count++;

      sectionsMap.set(sec.sectionName, existing);
    }
  }

  const results: SubjectStat[] = [];

  for (const item of standardSections) {
    const data = sectionsMap.get(item.name);
    if (data && data.count > 0) {
      const avgScore = Number((data.scores.reduce((a, b) => a + b, 0) / data.count).toFixed(1));
      const avgMax = Number((data.maxMarks.reduce((a, b) => a + b, 0) / data.count).toFixed(0));
      const avgAcc = Number((data.accuracies.reduce((a, b) => a + b, 0) / data.count).toFixed(1));
      const avgAtt = Number((data.attemptRates.reduce((a, b) => a + b, 0) / data.count).toFixed(1));
      const avgTime = Number((data.times.reduce((a, b) => a + b, 0) / data.count).toFixed(1));
      const status = getPerformanceStatus(avgAcc, avgAtt);

      results.push({
        sectionName: item.name,
        label: item.label,
        averageScore: avgScore,
        maxMarks: avgMax,
        averageAccuracy: avgAcc,
        averageAttemptRate: avgAtt,
        averageTimeMinutes: avgTime,
        bestScore: data.bestScore,
        attemptsCount: data.count,
        status,
        color: THEME_COLORS.subjects[item.name] || THEME_COLORS.electricBlue,
        icon: item.icon
      });
    }
  }

  return results;
}

export function calculateScoreVariance(mocks: MockTest[]): {
  scoreVariance: number;
  scoreStdDev: number;
  percentileStdDev: number;
  stabilityIndex: number; // 0 to 100 (100 = rock solid consistent)
} {
  if (mocks.length < 2) {
    return { scoreVariance: 0, scoreStdDev: 0, percentileStdDev: 0, stabilityIndex: 100 };
  }

  const scores = mocks.map(m => m.score);
  const percentiles = mocks.map(m => m.percentile);

  const meanScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const scoreVariance = scores.reduce((sum, val) => sum + Math.pow(val - meanScore, 2), 0) / (scores.length - 1);
  const scoreStdDev = Math.sqrt(scoreVariance);

  const meanPercentile = percentiles.reduce((a, b) => a + b, 0) / percentiles.length;
  const percentileVariance = percentiles.reduce((sum, val) => sum + Math.pow(val - meanPercentile, 2), 0) / (percentiles.length - 1);
  const percentileStdDev = Math.sqrt(percentileVariance);

  // Stability index: lower std dev = higher stability (normalized)
  const stability = Math.max(0, Math.min(100, Math.round(100 - scoreStdDev * 2)));

  return {
    scoreVariance: Number(scoreVariance.toFixed(1)),
    scoreStdDev: Number(scoreStdDev.toFixed(1)),
    percentileStdDev: Number(percentileStdDev.toFixed(1)),
    stabilityIndex: stability
  };
}
