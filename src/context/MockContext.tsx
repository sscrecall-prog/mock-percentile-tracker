import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { MockTest, MockFilters, SectionPerformance } from '../types/mock';
import { OverallKPIs, SubjectStat, WeakSectionDiagnosis, PerformanceInsight } from '../types/analytics';
import { UserSettings } from '../types/settings';
import { MockRepository } from '../data/mockRepository';
import { StorageService, DEFAULT_PLATFORMS } from '../data/storage';
import { calculateOverallKPIs, calculateSubjectStats } from '../engine/analyticsEngine';
import { diagnoseWeakSections, generatePerformanceInsights } from '../engine/feedbackEngine';

export type NavView = 'home' | 'mocks' | 'full-length' | 'sectional' | 'analytics' | 'percentile' | 'settings';

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface MockContextType {
  // State
  mocks: MockTest[];
  fullLengthMocks: MockTest[];
  sectionalMocks: MockTest[];
  activeView: NavView;
  setActiveView: (view: NavView) => void;
  filters: MockFilters;
  setFilters: React.Dispatch<React.SetStateAction<MockFilters>>;
  filteredMocks: MockTest[];
  selectedMockIds: string[];
  setSelectedMockIds: React.Dispatch<React.SetStateAction<string[]>>;
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  
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
  const [activeView, setActiveView] = useState<NavView>('home');
  const [filters, setFilters] = useState<MockFilters>(defaultFilters);
  const [selectedMockIds, setSelectedMockIds] = useState<string[]>([]);
  
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

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      StorageService.saveSettings(updated);
      return updated;
    });
    showToast('Settings saved successfully');
  }, [showToast]);

  // Derived Full Length mocks
  const fullLengthMocks = useMemo(() => {
    return mocks.filter(m => m.mockType === 'FULL_LENGTH');
  }, [mocks]);

  // Derived Sectional & Subject drills
  const sectionalMocks = useMemo(() => {
    return mocks.filter(m => m.mockType === 'SECTIONAL' || m.mockType === 'SUBJECT');
  }, [mocks]);

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

  // CRUD
  const addMock = useCallback((mockData: Omit<MockTest, 'id' | 'createdAt'>) => {
    const created = repository.create(mockData);
    setMocks(repository.getAll());
    showToast(`Mock "${created.testName}" logged successfully!`);
    return created;
  }, [showToast]);

  const editMock = useCallback((id: string, updates: Partial<MockTest>) => {
    const updated = repository.update(id, updates);
    if (updated) {
      setMocks(repository.getAll());
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
    showToast(`Deleted "${name}".`, 'info');
  }, [showToast, viewingMockDetail]);

  const duplicateMock = useCallback((id: string) => {
    const copy = repository.duplicate(id);
    if (copy) {
      setMocks(repository.getAll());
      showToast(`Duplicated "${copy.testName}".`);
    }
  }, [showToast]);

  const toggleMockSelection = useCallback((id: string) => {
    setSelectedMockIds(prev => {
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
    showToast('Reset to default 10 sample mocks.', 'info');
  }, [showToast]);

  const clearAllData = useCallback(() => {
    repository.clearAll();
    setMocks([]);
    setSelectedMockIds([]);
    showToast('All mock tests deleted.', 'warning');
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
        activeView,
        setActiveView,
        filters,
        setFilters,
        filteredMocks,
        selectedMockIds,
        setSelectedMockIds,
        settings,
        updateSettings,
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
