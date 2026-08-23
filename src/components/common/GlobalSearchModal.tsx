import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, Calendar, Award, ChevronRight } from 'lucide-react';
import { useMocks } from '../../context/MockContext';
import { useTheme } from '../../theme/ThemeContext';
import { Badge } from './Badge';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchModalOpen, setIsSearchModalOpen, mocks, setViewingMockDetail, setActiveView } = useMocks();
  const { activeTheme } = useTheme();
  const [query, setQuery] = useState('');

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(!isSearchModalOpen);
      }
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, setIsSearchModalOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return mocks.slice(0, 5);
    const q = query.toLowerCase();
    return mocks.filter(m => 
      m.testName.toLowerCase().includes(q) ||
      m.exam.toLowerCase().includes(q) ||
      m.testPlatform.toLowerCase().includes(q) ||
      m.date.includes(q)
    );
  }, [mocks, query]);

  if (!isSearchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24">
      {/* Backdrop */}
      <div
        onClick={() => setIsSearchModalOpen(false)}
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
      />

      {/* Search Window */}
      <div className={`relative w-full max-w-xl rounded-2xl border shadow-2xl z-10 overflow-hidden ${
        activeTheme === 'dark' ? 'bg-darkSurface border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 light:border-slate-200">
          <Search className="w-5 h-5 text-electric-blue shrink-0 mr-3" />
          <input
            autoFocus
            type="text"
            placeholder="Search mock name, exam (SSC CGL, Banking...), or platform..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base outline-none placeholder:text-slate-400"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/10 text-slate-400 border border-white/10">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No mocks match &quot;{query}&quot;.
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {query ? `Matching Mocks (${results.length})` : 'Recent Mocks'}
              </div>
              {results.map((mock) => (
                <div
                  key={mock.id}
                  onClick={() => {
                    setViewingMockDetail(mock);
                    setIsSearchModalOpen(false);
                    if (mock.mockType === 'FULL_LENGTH') {
                      setActiveView('full-length');
                    } else {
                      setActiveView('mocks');
                    }
                  }}
                  className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/5 light:hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      mock.isClearedCutoff ? 'bg-mint/20 text-mint-dark dark:text-mint' : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      {mock.score.toFixed(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold group-hover:text-electric-blue transition-colors line-clamp-1">
                        {mock.testName}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                        <span>{mock.exam}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {mock.date}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-electric-blue">
                          {mock.percentile}%ile
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={mock.isClearedCutoff ? 'success' : 'alert'} size="sm">
                      {mock.isClearedCutoff ? 'Cleared' : 'Below Cutoff'}
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
