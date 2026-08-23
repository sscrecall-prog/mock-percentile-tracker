import { MockTest } from '../types/mock';
import { UserSettings, ImportSummary } from '../types/settings';
import { INITIAL_SAMPLE_MOCKS } from './sampleData';

const MOCKS_STORAGE_KEY = 'mocktracker_mocks_v1';
const SETTINGS_STORAGE_KEY = 'mocktracker_settings_v1';
const PLATFORMS_STORAGE_KEY = 'mocktracker_custom_platforms_v1';

export const DEFAULT_PLATFORMS: string[] = [
  'Testbook',
  'Oliveboard',
  'PracticeMock',
  'Gradeup (BYJU\'S)',
  'Unacademy',
  'Careerwill',
  'RBE (Shubham Sir)',
  'Parcham Classes',
  'SuperCoaching',
  'Adda247',
  'Guidely',
  'Custom / Offline'
];

export const DEFAULT_SETTINGS: UserSettings = {
  selectedExam: 'SSC CGL',
  targetPercentile: 98.0,
  targetScore: 165.0,
  theme: 'dark',
  enable3D: true,
  reducedMotion: false,
  defaultTimeLimitMinutes: 60,
  defaultNegativeMarkRatio: 0.25,
};

export const StorageService = {
  loadCustomPlatforms(): string[] {
    try {
      const data = localStorage.getItem(PLATFORMS_STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('Failed to load custom platforms:', err);
      return [];
    }
  },

  saveCustomPlatforms(platforms: string[]): void {
    try {
      localStorage.setItem(PLATFORMS_STORAGE_KEY, JSON.stringify(platforms));
    } catch (err) {
      console.error('Failed to save custom platforms:', err);
    }
  },
  loadMocks(): MockTest[] {
    try {
      const data = localStorage.getItem(MOCKS_STORAGE_KEY);
      if (!data) {
        // Initialize with sample demo data
        localStorage.setItem(MOCKS_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_MOCKS));
        return INITIAL_SAMPLE_MOCKS;
      }
      return JSON.parse(data);
    } catch (err) {
      console.error('Failed to load mocks from storage:', err);
      return INITIAL_SAMPLE_MOCKS;
    }
  },

  saveMocks(mocks: MockTest[]): void {
    try {
      localStorage.setItem(MOCKS_STORAGE_KEY, JSON.stringify(mocks));
    } catch (err) {
      console.error('Failed to save mocks to storage:', err);
    }
  },

  loadSettings(): UserSettings {
    try {
      const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!data) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch (err) {
      console.error('Failed to load settings:', err);
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  },

  exportToJSON(mocks: MockTest[], settings: UserSettings): string {
    return JSON.stringify({
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings,
      mocks
    }, null, 2);
  },

  exportToCSV(mocks: MockTest[]): string {
    const headers = [
      'ID', 'Test Name', 'Exam', 'Tier', 'Mock Type', 'Platform', 'Date',
      'Score', 'Max Marks', 'Accuracy %', 'Attempt Rate %', 'Time (min)',
      'Percentile', 'Rank', 'Total Students', 'Cutoff Marks', 'Cleared Cutoff'
    ];

    const rows = mocks.map(m => [
      `"${m.id}"`,
      `"${m.testName.replace(/"/g, '""')}"`,
      `"${m.exam}"`,
      `"${m.tier}"`,
      `"${m.mockType}"`,
      `"${m.testPlatform}"`,
      `"${m.date}"`,
      m.score,
      m.maxMarks,
      m.accuracy,
      m.attemptRate,
      m.timeTakenMinutes,
      m.percentile,
      m.rank || '',
      m.totalStudents || '',
      m.cutoffMarks,
      m.isClearedCutoff ? 'Yes' : 'No'
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  },

  importFromJSON(jsonString: string): { summary: ImportSummary; mocks: MockTest[] } {
    const errors: string[] = [];
    let importedMocks: MockTest[] = [];

    try {
      const parsed = JSON.parse(jsonString);
      const rawList = Array.isArray(parsed) ? parsed : (parsed.mocks || []);

      if (!Array.isArray(rawList)) {
        throw new Error('Invalid JSON format: expected an array of mock tests.');
      }

      for (let i = 0; i < rawList.length; i++) {
        const item = rawList[i];
        if (!item.testName || typeof item.score !== 'number') {
          errors.push(`Item #${i + 1} skipped: missing test name or score.`);
          continue;
        }

        const validItem: MockTest = {
          id: item.id || `mock-${Date.now()}-${i}`,
          testName: item.testName,
          exam: item.exam || 'SSC CGL',
          tier: item.tier || 'Tier 1',
          mockType: item.mockType || 'FULL_LENGTH',
          testPlatform: item.testPlatform || 'Custom',
          date: item.date || new Date().toISOString().split('T')[0],
          createdAt: item.createdAt || Date.now(),
          totalQuestions: item.totalQuestions || 100,
          maxMarks: item.maxMarks || 200,
          totalTimeMinutes: item.totalTimeMinutes || 60,
          timeTakenMinutes: item.timeTakenMinutes || 60,
          attempted: item.attempted || 0,
          correct: item.correct || 0,
          wrong: item.wrong || 0,
          unattempted: item.unattempted ?? (item.totalQuestions - item.attempted),
          score: item.score,
          negativeMarks: item.negativeMarks || 0,
          accuracy: item.accuracy || (item.attempted > 0 ? (item.correct / item.attempted) * 100 : 0),
          attemptRate: item.attemptRate || (item.totalQuestions > 0 ? (item.attempted / item.totalQuestions) * 100 : 0),
          percentile: item.percentile || 0,
          rank: item.rank,
          totalStudents: item.totalStudents,
          cutoffMarks: item.cutoffMarks || 135,
          isClearedCutoff: item.score >= (item.cutoffMarks || 135),
          sections: Array.isArray(item.sections) ? item.sections : [],
          weakAreas: Array.isArray(item.weakAreas) ? item.weakAreas : [],
          analysisNotes: item.analysisNotes,
          isDemo: false
        };

        importedMocks.push(validItem);
      }
    } catch (e: any) {
      errors.push(`Failed to parse file: ${e.message}`);
    }

    return {
      summary: {
        totalFound: importedMocks.length + errors.length,
        importedCount: importedMocks.length,
        skippedCount: errors.length,
        errors
      },
      mocks: importedMocks
    };
  }
};
