import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { 
  MockTest, 
  MockFilters, 
  SectionPerformance, 
  SubjectDefinition, 
  ChapterDefinition, 
  ChapterMasterySummary,
  AspirantGamification
} from '../types/mock';
import { OverallKPIs, SubjectStat, WeakSectionDiagnosis, PerformanceInsight } from '../types/analytics';
import { UserSettings } from '../types/settings';
import { MockRepository } from '../data/mockRepository';
import { StorageService, DEFAULT_PLATFORMS, DEFAULT_SUBJECTS_AND_CHAPTERS } from '../data/storage';
import { calculateOverallKPIs, calculateSubjectStats } from '../engine/analyticsEngine';
import { diagnoseWeakSections, generatePerformanceInsights } from '../engine/feedbackEngine';
import { audioFX } from '../utils/audioFX';
import { triggerCelebrationConfetti } from '../utils/confettiFX';

export type NavView = 'home' | 'mocks' | 'full-length' | 'sectional' | 'chapter-wise' | 'analytics' | 'percentile' | 'settings';

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

export interface OverallChapterProgress {
  totalChapters: number;
  mastered: number;
  strong: number;
  needsPractice: number;
  notStarted: number;
  totalChapterTests: number;
  avgChapterAccuracy: number;
  completionRate: number;
}

interface MockContextType {
  // State
  mocks: MockTest[];
  fullLengthMocks: MockTest[];
  sectionalMocks: MockTest[];
  chapterMocks: MockTest[];
  activeView: NavView;
  setActiveView: (view: NavView) => void;
  filters: MockFilters;
  setFilters: React.Dispatch<React.SetStateAction<MockFilters>>;
  filteredMocks: MockTest[];
  selectedMockIds: string[];
  setSelectedMockIds: React.Dispatch<React.SetStateAction<string[]>>;
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  
  // Gamification & Audio
  gamification: AspirantGamification;
  isSoundEnabled: boolean;
  toggleSound: () => void;

  // Chapter & Subject Management
  subjectsWithChapters: SubjectDefinition[];
  addCustomChapter: (subjectName: string, chapterName: string, subtopics?: string[], targetAccuracy?: number) => ChapterDefinition;
  deleteCustomChapter: (subjectName: string, chapterId: string) => void;
  addCustomSubject: (name: string, icon?: string, color?: string) => SubjectDefinition;
  deleteCustomSubject: (subjectId: string) => void;
  getChapterMasterySummary: (subjectName: string, chapterName: string) => ChapterMasterySummary;
  overallChapterMastery: OverallChapterProgress;

  // Analytics
  kpis: OverallKPIs;
  fullLengthKPIs: OverallKPIs;
  subjectStats: SubjectStat[];
  weakSections: WeakSectionDiagnosis[];
  insights: PerformanceInsight[];

  // Modals & Drawers
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  editingMock: MockTest | null;
  setEditingMock: (mock: MockTest | null) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isComparisonModalOpen: boolean;
  setIsComparisonModalOpen: (open: boolean) => void;
  viewingMockDetail: MockTest | null;
  setViewingMockDetail: (mock: MockTest | null) => void;

  // Platforms
  customPlatforms: string[];
  allPlatforms: string[];
  addCustomPlatform: (name: string) => string;
  deleteCustomPlatform: (name: string) => void;

  // Actions
  addMock: (mock: Omit<MockTest, 'id' | 'createdAt'>) => MockTest;
  editMock: (id: string, updates: Partial<MockTest>) => void;
  deleteMock: (id: string) => void;
  duplicateMock: (id: string) => void;
  toggleMockSelection: (id: string) => void;
  clearSelection: () => void;
  resetDemoData: () => void;
  clearAllData: () => void;
  exportJSON: () => void;
  exportCSV: () => void;
  importJSON: (jsonString: string) => { imported: number; errors: string[] };

  // Toast Notifications
  toasts: ToastNotification[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const defaultFilters: MockFilters = {
  search: '',
  exam: 'ALL',
  tier: 'ALL',
  mockType: 'ALL',
  cutoffStatus: 'ALL',
  dateRange: 'ALL',
  sortBy: 'date',
  sortOrder: 'desc'
};

const repository = new MockRepository();
const MockContext = createContext<MockContextType | undefined>(undefined);

export const MockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mocks, setMocks] = useState<MockTest[]>(() => repository.getAll());
  const [settings, setSettings] = useState<UserSettings>(() => StorageService.loadSettings());
  const [customPlatforms, setCustomPlatforms] = useState<string[]>(() => StorageService.loadCustomPlatforms());
  const [subjectsWithChapters, setSubjectsWithChapters] = useState<SubjectDefinition[]>(() => StorageService.loadSubjectsWithChapters());
  const [activeView, setActiveView] = useState<NavView>('home');
  const [filters, setFilters] = useState<MockFilters>(defaultFilters);
  const [selectedMockIds, setSelectedMockIds] = useState<string[]>([]);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => audioFX.getSoundEnabled());
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingMock, setEditingMock] = useState<MockTest | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState<boolean>(false);
  const [viewingMockDetail, setViewingMockDetail] = useState<MockTest | null>(null);

  // Toast
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleSound = useCallback(() => {
    setIsSoundEnabled(prev => {
      const next = !prev;
      audioFX.setSoundEnabled(next);
      if (next) audioFX.playClickSound();
      showToast(next ? 'Sound FX Enabled 🔊' : 'Sound FX Muted 🔇', 'info');
      return next;
    });
  }, [showToast]);

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      StorageService.saveSettings(updated);
      return updated;
    });
    showToast('Settings saved successfully');
  }, [showToast]);

  // Chapter & Subject Management
  const addCustomChapter = useCallback((subjectName: string, chapterName: string, subtopics: string[] = [], targetAccuracy = 85) => {
    const trimmedChapter = chapterName.trim();
    if (!trimmedChapter) throw new Error('Chapter name is required');

    const newChapter: ChapterDefinition = {
      id: `ch-custom-${Date.now()}`,
      subject: subjectName,
      chapterName: trimmedChapter,
      targetAccuracy,
      subtopics,
      isCustom: true
    };

    setSubjectsWithChapters(prev => {
      const exists = prev.find(s => s.name.toLowerCase() === subjectName.toLowerCase());
      let updated: SubjectDefinition[];
      if (exists) {
        updated = prev.map(s => {
          if (s.name.toLowerCase() === subjectName.toLowerCase()) {
            return {
              ...s,
              chapters: [...s.chapters, newChapter]
            };
          }
          return s;
        });
      } else {
        const newSub: SubjectDefinition = {
          id: `sub-custom-${Date.now()}`,
          name: subjectName,
          icon: '📚',
          color: '#10B981',
          chapters: [newChapter],
          isCustom: true
        };
        updated = [...prev, newSub];
      }
      StorageService.saveSubjectsWithChapters(updated);
      return updated;
    });

    showToast(`Chapter "${trimmedChapter}" added to ${subjectName}!`);
    return newChapter;
  }, [showToast]);

  const deleteCustomChapter = useCallback((subjectName: string, chapterId: string) => {
    setSubjectsWithChapters(prev => {
      const updated = prev.map(s => {
        if (s.name.toLowerCase() === subjectName.toLowerCase()) {
          return {
            ...s,
            chapters: s.chapters.filter(ch => ch.id !== chapterId)
          };
        }
        return s;
      });
      StorageService.saveSubjectsWithChapters(updated);
      return updated;
    });
    showToast('Chapter removed.', 'info');
  }, [showToast]);

  const addCustomSubject = useCallback((name: string, icon = '📚', color = '#10B981') => {
    const trimmed = name.trim();
    if (!trimmed) throw new Error('Subject name is required');

    const newSub: SubjectDefinition = {
      id: `sub-custom-${Date.now()}`,
      name: trimmed,
      icon,
      color,
      chapters: [],
      isCustom: true
    };

    setSubjectsWithChapters(prev => {
      if (prev.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) {
        return prev;
      }
      const updated = [...prev, newSub];
      StorageService.saveSubjectsWithChapters(updated);
      return updated;
    });

    showToast(`Subject "${trimmed}" created!`);
    return newSub;
  }, [showToast]);

  const deleteCustomSubject = useCallback((subjectId: string) => {
    setSubjectsWithChapters(prev => {
      const updated = prev.filter(s => s.id !== subjectId);
      StorageService.saveSubjectsWithChapters(updated);
      return updated;
    });
    showToast('Subject removed.', 'info');
  }, [showToast]);

  // Derived Full Length mocks
  const fullLengthMocks = useMemo(() => {
    return mocks.filter(m => m.mockType === 'FULL_LENGTH');
  }, [mocks]);

  // Derived Sectional & Subject drills
  const sectionalMocks = useMemo(() => {
    return mocks.filter(m => m.mockType === 'SECTIONAL' || m.mockType === 'SUBJECT');
  }, [mocks]);

  // Derived Chapter-Wise tests
  const chapterMocks = useMemo(() => {
    return mocks.filter(m => m.mockType === 'CHAPTER_WISE');
  }, [mocks]);

  // Computed Chapter Mastery Summary for any chapter
  const getChapterMasterySummary = useCallback((subjectName: string, chapterName: string): ChapterMasterySummary => {
    const tests = chapterMocks.filter(m => 
      (m.chapterName && m.chapterName.toLowerCase() === chapterName.toLowerCase()) ||
      (m.topicFocus && m.topicFocus.toLowerCase().includes(chapterName.toLowerCase())) ||
      (m.testName && m.testName.toLowerCase().includes(chapterName.toLowerCase()))
    );

    if (tests.length === 0) {
      return {
        subject: subjectName,
        chapterName,
        totalTests: 0,
        totalQuestions: 0,
        attempted: 0,
        correct: 0,
        wrong: 0,
        avgAccuracy: 0,
        avgScore: 0,
        avgPaceSeconds: 0,
        bestScore: 0,
        maxMarks: 0,
        masteryStatus: 'Not Started',
        recentTests: []
      };
    }

    const totalQuestions = tests.reduce((acc, t) => acc + t.totalQuestions, 0);
    const attempted = tests.reduce((acc, t) => acc + t.attempted, 0);
    const correct = tests.reduce((acc, t) => acc + t.correct, 0);
    const wrong = tests.reduce((acc, t) => acc + t.wrong, 0);
    const avgAccuracy = attempted > 0 ? (correct / attempted) * 100 : 0;
    const avgScore = tests.reduce((acc, t) => acc + t.score, 0) / tests.length;
    const bestScore = Math.max(...tests.map(t => t.score));
    const maxMarks = tests[0]?.maxMarks || 50;

    const totalTimeMinutes = tests.reduce((acc, t) => acc + t.timeTakenMinutes, 0);
    const avgPaceSeconds = attempted > 0 ? Math.round((totalTimeMinutes * 60) / attempted) : 0;

    let masteryStatus: 'Mastered' | 'Strong' | 'Needs Practice' | 'Not Started' = 'Needs Practice';
    if (avgAccuracy >= 85) masteryStatus = 'Mastered';
    else if (avgAccuracy >= 70) masteryStatus = 'Strong';

    return {
      subject: subjectName,
      chapterName,
      totalTests: tests.length,
      totalQuestions,
      attempted,
      correct,
      wrong,
      avgAccuracy: parseFloat(avgAccuracy.toFixed(1)),
      avgScore: parseFloat(avgScore.toFixed(1)),
      avgPaceSeconds,
      bestScore: parseFloat(bestScore.toFixed(1)),
      maxMarks,
      masteryStatus,
      recentTests: tests.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    };
  }, [chapterMocks]);

  // Overall Chapter Progress across all subjects
  const overallChapterMastery = useMemo<OverallChapterProgress>(() => {
    let allChaptersCount = 0;
    let masteredCount = 0;
    let strongCount = 0;
    let needsPracticeCount = 0;
    let notStartedCount = 0;

    subjectsWithChapters.forEach(sub => {
      sub.chapters.forEach(ch => {
        allChaptersCount++;
        const summary = getChapterMasterySummary(sub.name, ch.chapterName);
        if (summary.masteryStatus === 'Mastered') masteredCount++;
        else if (summary.masteryStatus === 'Strong') strongCount++;
        else if (summary.masteryStatus === 'Needs Practice') needsPracticeCount++;
        else notStartedCount++;
      });
    });

    const totalChapterTests = chapterMocks.length;
    const avgChapterAccuracy = chapterMocks.length > 0
      ? chapterMocks.reduce((acc, m) => acc + m.accuracy, 0) / chapterMocks.length
      : 0;

    const completionRate = allChaptersCount > 0
      ? ((masteredCount + strongCount) / allChaptersCount) * 100
      : 0;

    return {
      totalChapters: allChaptersCount,
      mastered: masteredCount,
      strong: strongCount,
      needsPractice: needsPracticeCount,
      notStarted: notStartedCount,
      totalChapterTests,
      avgChapterAccuracy: parseFloat(avgChapterAccuracy.toFixed(1)),
      completionRate: parseFloat(completionRate.toFixed(1))
    };
  }, [subjectsWithChapters, chapterMocks, getChapterMasterySummary]);

  // Filtered mocks list
  const filteredMocks = useMemo(() => {
    return repository.filterMocks(filters);
  }, [mocks, filters]);

  // Combined Platforms (defaults + custom + existing mocks)
  const allPlatforms = useMemo(() => {
    const set = new Set<string>(DEFAULT_PLATFORMS);
    customPlatforms.forEach(p => set.add(p));
    mocks.forEach(m => {
      if (m.testPlatform) set.add(m.testPlatform);
    });
    return Array.from(set);
  }, [customPlatforms, mocks]);

  const addCustomPlatform = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return '';
    setCustomPlatforms(prev => {
      if (prev.includes(trimmed) || DEFAULT_PLATFORMS.includes(trimmed)) return prev;
      const updated = [...prev, trimmed];
      StorageService.saveCustomPlatforms(updated);
      return updated;
    });
    showToast(`Platform "${trimmed}" added!`);
    return trimmed;
  }, [showToast]);

  const deleteCustomPlatform = useCallback((name: string) => {
    setCustomPlatforms(prev => {
      const updated = prev.filter(p => p !== name);
      StorageService.saveCustomPlatforms(updated);
      return updated;
    });
    showToast(`Platform "${name}" removed.`, 'info');
  }, [showToast]);

  // Analytics
  const kpis = useMemo(() => calculateOverallKPIs(mocks), [mocks]);
  const fullLengthKPIs = useMemo(() => calculateOverallKPIs(fullLengthMocks), [fullLengthMocks]);
  const subjectStats = useMemo(() => calculateSubjectStats(mocks), [mocks]);
  const weakSections = useMemo(() => diagnoseWeakSections(mocks), [mocks]);
  const insights = useMemo(() => generatePerformanceInsights(mocks), [mocks]);

  // Gamification Engine (XP, Level, Streak)
  const gamification = useMemo<AspirantGamification>(() => {
    const testPoints = mocks.length * 100;
    const cutoffPoints = mocks.filter(m => m.isClearedCutoff).length * 75;
    const chapterPoints = overallChapterMastery.mastered * 150;
    const totalXp = testPoints + cutoffPoints + chapterPoints;

    const level = Math.max(1, Math.floor(totalXp / 500) + 1);
    const nextLevelXp = level * 500;
    const progressPercent = Math.min(100, Math.round(((totalXp % 500) / 500) * 100));

    let levelTitle = 'Novice Cadet';
    if (level === 2) levelTitle = 'Exam Contender';
    else if (level === 3) levelTitle = 'Mock Veteran';
    else if (level === 4) levelTitle = 'Cutoff Crusher';
    else if (level === 5) levelTitle = 'Percentile Master';
    else if (level >= 6) levelTitle = 'All India Ranker ⭐';

    // Calculate mock streak
    const uniqueDates = Array.from(new Set(mocks.map(m => m.date))).sort().reverse();
    const streakDays = Math.max(1, Math.min(uniqueDates.length, mocks.length));

    return {
      totalXp,
      level,
      levelTitle,
      nextLevelXp,
      progressPercent,
      streakDays
    };
  }, [mocks, overallChapterMastery]);

  // CRUD
  const addMock = useCallback((mockData: Omit<MockTest, 'id' | 'createdAt'>) => {
    const created = repository.create(mockData);
    setMocks(repository.getAll());
    if (created.isClearedCutoff || created.accuracy >= 90) {
      audioFX.playAchievementSound();
      triggerCelebrationConfetti();
    } else {
      audioFX.playSuccessChime();
    }
    showToast(`Mock "${created.testName}" logged! +100 XP ⚡`);
    return created;
  }, [showToast]);

  const editMock = useCallback((id: string, updates: Partial<MockTest>) => {
    const updated = repository.update(id, updates);
    if (updated) {
      setMocks(repository.getAll());
      audioFX.playSuccessChime();
      showToast(`Mock "${updated.testName}" updated.`);
    }
  }, [showToast]);

  const deleteMock = useCallback((id: string) => {
    const mock = repository.getById(id);
    const name = mock?.testName || 'Mock';
    repository.delete(id);
    setMocks(repository.getAll());
    setSelectedMockIds(prev => prev.filter(item => item !== id));
    if (viewingMockDetail?.id === id) setViewingMockDetail(null);
    audioFX.playClickSound();
    showToast(`Deleted "${name}".`, 'info');
  }, [showToast, viewingMockDetail]);

  const duplicateMock = useCallback((id: string) => {
    const copy = repository.duplicate(id);
    if (copy) {
      setMocks(repository.getAll());
      audioFX.playSuccessChime();
      showToast(`Duplicated "${copy.testName}".`);
    }
  }, [showToast]);

  const toggleMockSelection = useCallback((id: string) => {
    setSelectedMockIds(prev => {
      audioFX.playClickSound();
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        if (prev.length >= 4) {
          showToast('You can compare a maximum of 4 mocks at once.', 'warning');
          return prev;
        }
        return [...prev, id];
      }
    });
  }, [showToast]);

  const clearSelection = useCallback(() => {
    setSelectedMockIds([]);
  }, []);

  const resetDemoData = useCallback(() => {
    const reset = repository.resetDemoData();
    setMocks(reset);
    setSelectedMockIds([]);
    setSubjectsWithChapters(DEFAULT_SUBJECTS_AND_CHAPTERS);
    StorageService.saveSubjectsWithChapters(DEFAULT_SUBJECTS_AND_CHAPTERS);
    audioFX.playSuccessChime();
    showToast('Reset to default sample mocks & syllabus.', 'info');
  }, [showToast]);

  const clearAllData = useCallback(() => {
    repository.clearAll();
    setMocks([]);
    setSelectedMockIds([]);
    audioFX.playClickSound();
    showToast('All mock tests cleared. Started fresh blank database.', 'warning');
  }, [showToast]);

  const exportJSON = useCallback(() => {
    const jsonStr = StorageService.exportToJSON(mocks, settings);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mock-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('JSON backup file downloaded.');
  }, [mocks, settings, showToast]);

  const exportCSV = useCallback(() => {
    const csvStr = StorageService.exportToCSV(mocks);
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mock-tracker-scores-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV export downloaded.');
  }, [mocks, showToast]);

  const importJSON = useCallback((jsonString: string) => {
    const { summary, mocks: imported } = StorageService.importFromJSON(jsonString);
    if (imported.length > 0) {
      repository.importMocks(imported, true);
      setMocks(repository.getAll());
      showToast(`Successfully imported ${imported.length} mock tests!`);
    }
    return { imported: summary.importedCount, errors: summary.errors };
  }, [showToast]);

  return (
    <MockContext.Provider
      value={{
        mocks,
        fullLengthMocks,
        sectionalMocks,
        chapterMocks,
        activeView,
        setActiveView,
        filters,
        setFilters,
        filteredMocks,
        selectedMockIds,
        setSelectedMockIds,
        settings,
        updateSettings,
        gamification,
        isSoundEnabled,
        toggleSound,
        subjectsWithChapters,
        addCustomChapter,
        deleteCustomChapter,
        addCustomSubject,
        deleteCustomSubject,
        getChapterMasterySummary,
        overallChapterMastery,
        kpis,
        fullLengthKPIs,
        subjectStats,
        weakSections,
        insights,
        isAddModalOpen,
        setIsAddModalOpen,
        editingMock,
        setEditingMock,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isComparisonModalOpen,
        setIsComparisonModalOpen,
        viewingMockDetail,
        setViewingMockDetail,
        customPlatforms,
        allPlatforms,
        addCustomPlatform,
        deleteCustomPlatform,
        addMock,
        editMock,
        deleteMock,
        duplicateMock,
        toggleMockSelection,
        clearSelection,
        resetDemoData,
        clearAllData,
        exportJSON,
        exportCSV,
        importJSON,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </MockContext.Provider>
  );
};

export const useMocks = () => {
  const context = useContext(MockContext);
  if (!context) {
    throw new Error('useMocks must be used within a MockProvider');
  }
  return context;
};
