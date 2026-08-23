import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Layers, 
  Filter, 
  BookOpen, 
  Sparkles,
  Trophy,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useMocks } from '../context/MockContext';
import { ChapterWiseDashboard } from '../components/chapter-wise/ChapterWiseDashboard';
import { SubjectChapterNavTabs } from '../components/chapter-wise/SubjectChapterNavTabs';
import { ChapterCard } from '../components/chapter-wise/ChapterCard';
import { AddChapterModal } from '../components/chapter-wise/AddChapterModal';
import { ChapterDetailAnalysisModal } from '../components/chapter-wise/ChapterDetailAnalysisModal';
import { Modal } from '../components/common/Modal';

export const ChapterWiseView: React.FC = () => {
  const { 
    subjectsWithChapters, 
    getChapterMasterySummary, 
    addCustomSubject,
    setEditingMock,
    setIsAddModalOpen 
  } = useMocks();

  const [selectedSubject, setSelectedSubject] = useState<string>(
    subjectsWithChapters[0]?.name || 'Quantitative Aptitude'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Mastered' | 'Strong' | 'Needs Practice' | 'Not Started'>('ALL');

  // Modals
  const [isAddChapterModalOpen, setIsAddChapterModalOpen] = useState(false);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectIcon, setNewSubjectIcon] = useState('📚');
  const [analyzingChapter, setAnalyzingChapter] = useState<string | null>(null);

  // Active Subject
  const activeSubjectObj = useMemo(() => {
    return subjectsWithChapters.find(
      s => s.name.toLowerCase() === selectedSubject.toLowerCase()
    ) || subjectsWithChapters[0];
  }, [subjectsWithChapters, selectedSubject]);

  // Filtered Chapters in Active Subject
  const chaptersWithSummaries = useMemo(() => {
    if (!activeSubjectObj) return [];
    
    return activeSubjectObj.chapters.map(ch => ({
      chapter: ch,
      summary: getChapterMasterySummary(activeSubjectObj.name, ch.chapterName)
    }));
  }, [activeSubjectObj, getChapterMasterySummary]);

  const filteredChapters = useMemo(() => {
    return chaptersWithSummaries.filter(({ chapter, summary }) => {
      // Search
      const matchesSearch = 
        chapter.chapterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chapter.subtopics?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // Status
      if (statusFilter !== 'ALL' && summary.masteryStatus !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [chaptersWithSummaries, searchQuery, statusFilter]);

  const handleLogTestForChapter = (subjectName: string, chapterName: string) => {
    setEditingMock(null);
    setIsAddModalOpen(true);
  };

  const handleAddSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubjectName.trim()) {
      const created = addCustomSubject(newSubjectName.trim(), newSubjectIcon);
      setSelectedSubject(created.name);
      setNewSubjectName('');
      setIsAddSubjectModalOpen(false);
    }
  };

  const activeChapterSummary = useMemo(() => {
    if (!analyzingChapter || !activeSubjectObj) return null;
    return getChapterMasterySummary(activeSubjectObj.name, analyzingChapter);
  }, [analyzingChapter, activeSubjectObj, getChapterMasterySummary]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header & Syllabus Overview KPIs */}
      <ChapterWiseDashboard 
        onAddChapterClick={() => setIsAddChapterModalOpen(true)}
      />

      {/* 2. Subject Filter Navigation Tabs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>{activeSubjectObj?.icon}</span>
            <span>{activeSubjectObj?.name} Chapters</span>
            <span className="text-xs font-bold text-slate-500">
              ({activeSubjectObj?.chapters.length} Chapters)
            </span>
          </h2>

          <button
            onClick={() => setIsAddChapterModalOpen(true)}
            className="text-xs font-black text-emerald-700 dark:text-mint hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Chapter to this Subject</span>
          </button>
        </div>

        <SubjectChapterNavTabs
          selectedSubject={selectedSubject}
          onSelectSubject={setSelectedSubject}
          onAddSubjectClick={() => setIsAddSubjectModalOpen(true)}
        />
      </div>

      {/* 3. Search & Mastery Status Filter Controls */}
      <div className="p-4 rounded-2xl bg-white dark:bg-darkSurface border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chapters or subtopics (e.g. Percentage, Tangents, Syllogism)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-darkContainer border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-emerald-500 outline-none"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'Mastered', 'Strong', 'Needs Practice', 'Not Started'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                statusFilter === status
                  ? 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-darkBg shadow-sm'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {status === 'ALL' ? 'All Chapters' : status}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Chapters Grid */}
      {filteredChapters.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-darkSurface border border-slate-200 dark:border-white/10 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No chapters found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'ALL'
              ? 'Try changing your search keywords or filter criteria.'
              : 'No chapters added to this subject yet. Click below to add your first chapter!'}
          </p>
          <button
            onClick={() => setIsAddChapterModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm hover:opacity-90"
          >
            + Add First Chapter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredChapters.map(({ chapter, summary }) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              summary={summary}
              onOpenAnalysis={(chName) => setAnalyzingChapter(chName)}
              onLogTestForChapter={handleLogTestForChapter}
            />
          ))}
        </div>
      )}

      {/* Add Chapter Modal */}
      <AddChapterModal
        isOpen={isAddChapterModalOpen}
        onClose={() => setIsAddChapterModalOpen(false)}
        defaultSubject={selectedSubject}
      />

      {/* Add Custom Subject Modal */}
      <Modal
        isOpen={isAddSubjectModalOpen}
        onClose={() => setIsAddSubjectModalOpen(false)}
        title="Add Custom Subject"
        maxWidth="max-w-sm"
      >
        <form onSubmit={handleAddSubjectSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Subject Name *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              placeholder="e.g. Hindi Language, Banking Awareness..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-darkContainer border border-slate-300 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:border-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Subject Icon Emoji
            </label>
            <div className="flex items-center gap-2">
              {['📚', '⚡', '🎯', '🏛️', '💼', '🧪', '⚖️'].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setNewSubjectIcon(emoji)}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border transition-all ${
                    newSubjectIcon === emoji
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/20'
                      : 'border-slate-200 dark:border-white/10'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-white/10">
            <button
              type="button"
              onClick={() => setIsAddSubjectModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-glow-blue"
            >
              Create Subject
            </button>
          </div>
        </form>
      </Modal>

      {/* Chapter Detail Analysis Modal */}
      <ChapterDetailAnalysisModal
        summary={activeChapterSummary}
        onClose={() => setAnalyzingChapter(null)}
        onLogTestForChapter={handleLogTestForChapter}
      />
    </div>
  );
};
