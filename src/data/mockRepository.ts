import { MockTest, MockFilters } from '../types/mock';
import { StorageService } from './storage';

export class MockRepository {
  private mocks: MockTest[] = [];

  constructor() {
    this.mocks = StorageService.loadMocks();
  }

  getAll(): MockTest[] {
    return [...this.mocks];
  }

  getById(id: string): MockTest | undefined {
    return this.mocks.find(m => m.id === id);
  }

  create(mock: Omit<MockTest, 'id' | 'createdAt'>): MockTest {
    const newMock: MockTest = {
      ...mock,
      id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: Date.now(),
    };
    this.mocks = [newMock, ...this.mocks];
    StorageService.saveMocks(this.mocks);
    return newMock;
  }

  update(id: string, updates: Partial<MockTest>): MockTest | undefined {
    const index = this.mocks.findIndex(m => m.id === id);
    if (index === -1) return undefined;

    const updated = { ...this.mocks[index], ...updates };
    this.mocks[index] = updated;
    StorageService.saveMocks(this.mocks);
    return updated;
  }

  delete(id: string): boolean {
    const initialLen = this.mocks.length;
    this.mocks = this.mocks.filter(m => m.id !== id);
    const deleted = this.mocks.length < initialLen;
    if (deleted) {
      StorageService.saveMocks(this.mocks);
    }
    return deleted;
  }

  duplicate(id: string): MockTest | undefined {
    const original = this.getById(id);
    if (!original) return undefined;

    const copy: MockTest = {
      ...original,
      id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      testName: `${original.testName} (Copy)`,
      createdAt: Date.now(),
      date: new Date().toISOString().split('T')[0],
      isDemo: false
    };

    this.mocks = [copy, ...this.mocks];
    StorageService.saveMocks(this.mocks);
    return copy;
  }

  resetDemoData(): MockTest[] {
    localStorage.removeItem('mocktracker_mocks_v1');
    this.mocks = StorageService.loadMocks();
    return [...this.mocks];
  }

  clearAll(): void {
    this.mocks = [];
    StorageService.saveMocks(this.mocks);
  }

  importMocks(newMocks: MockTest[], merge: boolean = true): void {
    if (merge) {
      // Merge unique by name or ID
      const existingIds = new Set(this.mocks.map(m => m.id));
      const filtered = newMocks.filter(m => !existingIds.has(m.id));
      this.mocks = [...filtered, ...this.mocks];
    } else {
      this.mocks = newMocks;
    }
    StorageService.saveMocks(this.mocks);
  }

  filterMocks(filters: MockFilters): MockTest[] {
    return this.mocks.filter(m => {
      // Search
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesName = m.testName.toLowerCase().includes(query);
        const matchesExam = m.exam.toLowerCase().includes(query);
        const matchesPlatform = m.testPlatform.toLowerCase().includes(query);
        if (!matchesName && !matchesExam && !matchesPlatform) return false;
      }

      // Exam
      if (filters.exam !== 'ALL' && m.exam !== filters.exam) return false;

      // Platform
      if (filters.platform && filters.platform !== 'ALL' && m.testPlatform !== filters.platform) return false;

      // Tier
      if (filters.tier !== 'ALL' && m.tier !== filters.tier) return false;

      // Mock Type
      if (filters.mockType !== 'ALL' && m.mockType !== filters.mockType) return false;

      // Cutoff
      if (filters.cutoffStatus === 'CLEARED' && !m.isClearedCutoff) return false;
      if (filters.cutoffStatus === 'NOT_CLEARED' && m.isClearedCutoff) return false;

      // Date Range
      if (filters.dateRange !== 'ALL') {
        const mockTime = new Date(m.date).getTime();
        const now = Date.now();
        const days = filters.dateRange === '7_DAYS' ? 7 : filters.dateRange === '30_DAYS' ? 30 : 90;
        if (now - mockTime > days * 24 * 60 * 60 * 1000) return false;
      }

      return true;
    }).sort((a, b) => {
      let comp = 0;
      if (filters.sortBy === 'date') {
        comp = new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (filters.sortBy === 'score') {
        comp = b.score - a.score;
      } else if (filters.sortBy === 'percentile') {
        comp = b.percentile - a.percentile;
      } else if (filters.sortBy === 'accuracy') {
        comp = b.accuracy - a.accuracy;
      } else if (filters.sortBy === 'time') {
        comp = b.timeTakenMinutes - a.timeTakenMinutes;
      }
      return filters.sortOrder === 'asc' ? -comp : comp;
    });
  }
}
