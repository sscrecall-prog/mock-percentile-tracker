import React from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  X, 
  GitCompare, 
  Plus, 
  Layers 
} from 'lucide-react';
import { useMocks } from '../../context/MockContext';
import { ExamType, ExamTier, MockTestType } from '../../types/mock';

export const MockFiltersBar: React.FC = () => {
  const { 
    filters, 
    setFilters, 
    selectedMockIds, 
    clearSelection, 
    setIsComparisonModalOpen, 
    filteredMocks,
    setIsAddModalOpen,
    setEditingMock,
    allPlatforms
  } = useMocks();

  const handleResetFilters = () => {
    setFilters({
      search: '',
      exam: 'ALL',
      platform: 'ALL',
      tier: 'ALL',
      mockType: 'ALL',
      cutoffStatus: 'ALL',
      dateRange: 'ALL',
      sortBy: 'date',
      sortOrder: 'desc'
    });
  };

  const hasActiveFilters = 
    filters.search !== '' ||
    filters.exam !== 'ALL' ||
    (filters.platform && filters.platform !== 'ALL') ||
    filters.tier !== 'ALL' ||
    filters.mockType !== 'ALL' ||
    filters.cutoffStatus !== 'ALL' ||
    filters.dateRange !== 'ALL';

  return (
    <div className="space-y-3 p-4 sm:p-5 rounded-2xl border border-white/5 light:border-slate-200 bg-darkSurface light:bg-white shadow-3d-dark">
      
      {/* Top Row: Search Input, Compare Action & Add Mock CTA */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search mock title, exam name, platform..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-darkContainer light:bg-slate-50 border border-white/10 light:border-slate-200 text-xs sm:text-sm focus:border-electric-blue outline-none placeholder:text-slate-500"
          />
          {filters.search && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Comparison Mode Trigger */}
          {selectedMockIds.length > 0 && (
            <div className="flex items-center gap-2 animate-fadeIn">
              <button
                onClick={() => setIsComparisonModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-electric-blue to-mint text-darkBg font-extrabold text-xs shadow-glow-blue hover:opacity-95 transition-all"
              >
                <GitCompare className="w-4 h-4" />
                <span>Compare ({selectedMockIds.length})</span>
              </button>
              <button
                onClick={clearSelection}
                className="p-2 rounded-xl border border-white/10 text-slate-400 hover:text-white text-xs"
                title="Clear selection"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Add Mock */}
          <button
            onClick={() => {
              setEditingMock(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-electric-blue text-darkBg font-extrabold text-xs hover:opacity-90 shadow-glow-blue transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Mock</span>
          </button>
        </div>

      </div>

      {/* Filter Selectors Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5 light:border-slate-100 text-xs">
        
        {/* Exam */}
        <select
          value={filters.exam}
          onChange={(e) => setFilters(prev => ({ ...prev, exam: e.target.value as ExamType | 'ALL' }))}
          className="px-2.5 py-1.5 rounded-lg bg-darkContainer light:bg-slate-100 border border-white/10 light:border-slate-200 text-slate-300 light:text-slate-800 outline-none"
        >
          <option value="ALL">All Exams</option>
          <option value="SSC CGL">SSC CGL</option>
          <option value="SSC CHSL">SSC CHSL</option>
          <option value="SSC MTS">SSC MTS</option>
          <option value="RRB NTPC">RRB NTPC</option>
          <option value="IBPS PO">IBPS PO</option>
          <option value="SBI PO">SBI PO</option>
        </select>

        {/* Platform Filter */}
        <select
          value={filters.platform || 'ALL'}
          onChange={(e) => setFilters(prev => ({ ...prev, platform: e.target.value }))}
          className="px-2.5 py-1.5 rounded-lg bg-darkContainer light:bg-slate-100 border border-white/10 light:border-slate-200 text-slate-300 light:text-slate-800 outline-none"
        >
          <option value="ALL">All Platforms</option>
          {allPlatforms.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        {/* Mock Type */}
        <select
          value={filters.mockType}
          onChange={(e) => setFilters(prev => ({ ...prev, mockType: e.target.value as MockTestType | 'ALL' }))}
          className="px-2.5 py-1.5 rounded-lg bg-darkContainer light:bg-slate-100 border border-white/10 light:border-slate-200 text-slate-300 light:text-slate-800 outline-none"
        >
          <option value="ALL">All Types</option>
          <option value="FULL_LENGTH">Full Length</option>
          <option value="SECTIONAL">Sectional</option>
          <option value="SUBJECT">Subject Test</option>
          <option value="PYQ">PYQ Benchmark</option>
        </select>

        {/* Cutoff Status */}
        <select
          value={filters.cutoffStatus}
          onChange={(e) => setFilters(prev => ({ ...prev, cutoffStatus: e.target.value as 'ALL' | 'CLEARED' | 'NOT_CLEARED' }))}
          className="px-2.5 py-1.5 rounded-lg bg-darkContainer light:bg-slate-100 border border-white/10 light:border-slate-200 text-slate-300 light:text-slate-800 outline-none"
        >
          <option value="ALL">Cutoff: Any</option>
          <option value="CLEARED">Cleared Only ✓</option>
          <option value="NOT_CLEARED">Below Cutoff ✗</option>
        </select>

        {/* Date Range */}
        <select
          value={filters.dateRange}
          onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as 'ALL' | '7_DAYS' | '30_DAYS' | '90_DAYS' }))}
          className="px-2.5 py-1.5 rounded-lg bg-darkContainer light:bg-slate-100 border border-white/10 light:border-slate-200 text-slate-300 light:text-slate-800 outline-none"
        >
          <option value="ALL">All Dates</option>
          <option value="7_DAYS">Last 7 Days</option>
          <option value="30_DAYS">Last 30 Days</option>
          <option value="90_DAYS">Last 90 Days</option>
        </select>

        {/* Sort Field */}
        <div className="flex items-center gap-1 ml-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
            className="px-2 py-1.5 rounded-lg bg-darkContainer light:bg-slate-100 border border-white/10 light:border-slate-200 text-slate-300 light:text-slate-800 outline-none"
          >
            <option value="date">Date</option>
            <option value="score">Score</option>
            <option value="percentile">Percentile</option>
            <option value="accuracy">Accuracy</option>
            <option value="time">Time</option>
          </select>

          <button
            onClick={() => setFilters(prev => ({ ...prev, sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' }))}
            className="px-2 py-1.5 rounded-lg bg-darkContainer light:bg-slate-100 border border-white/10 text-slate-300 light:text-slate-800 font-bold"
          >
            {filters.sortOrder === 'desc' ? '↓ High-Low' : '↑ Low-High'}
          </button>
        </div>

        {/* Reset */}
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="text-[11px] font-bold text-electric-blue hover:underline px-2 py-1"
          >
            Reset Filters ↺
          </button>
        )}

      </div>

      {/* Match Result Stats */}
      <div className="text-[11px] text-slate-400">
        Showing <span className="font-bold text-white light:text-slate-900">{filteredMocks.length}</span> matching mock tests
      </div>

    </div>
  );
};
