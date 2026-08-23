import React, { useState, useMemo } from 'react';
import { useMocks } from '../context/MockContext';
import { SectionalDashboard } from '../components/sectional/SectionalDashboard';
import { SectionalSubjectFilterTabs } from '../components/sectional/SectionalSubjectFilterTabs';
import { SectionalTrendChart } from '../components/sectional/SectionalTrendChart';
import { SectionalMockCard } from '../components/sectional/SectionalMockCard';
import { SectionalDrillAnalysisModal } from '../components/sectional/SectionalDrillAnalysisModal';
import { EmptyState } from '../components/common/EmptyState';
import { MockTest, SectionName } from '../types/mock';
import { Plus } from 'lucide-react';

const isMockMatchingSubject = (m: MockTest, subject: SectionName) => {
  if (m.subjectName === subject) return true;
  if (m.sections && m.sections.some(s => s.sectionName === subject)) return true;
  
  const name = m.testName.toLowerCase();
  if (subject === 'Quantitative Aptitude' && (name.includes('quant') || name.includes('math'))) return true;
  if (subject === 'General Intelligence & Reasoning' && (name.includes('reason') || name.includes('reasoning') || name.includes('intelligence'))) return true;
  if (subject === 'English Comprehension' && (name.includes('english') || name.includes('comprehension') || name.includes('vocab'))) return true;
  if (subject === 'General Awareness' && (name.includes('awareness') || name.includes('gk') || name.includes('gs') || name.includes('current affairs'))) return true;
  if (subject === 'Computer Knowledge' && name.includes('computer')) return true;
  
  return false;
};

export const SectionalView: React.FC = () => {
  const { sectionalMocks, setIsAddModalOpen, setEditingMock } = useMocks();
  const [selectedSubject, setSelectedSubject] = useState<SectionName | 'ALL'>('ALL');
  const [analyzingMock, setAnalyzingMock] = useState<MockTest | null>(null);

  // Filter sectional mocks by selected subject tab
  const filteredDrills = useMemo(() => {
    if (selectedSubject === 'ALL') return sectionalMocks;
    return sectionalMocks.filter(m => isMockMatchingSubject(m, selectedSubject));
  }, [sectionalMocks, selectedSubject]);

  // Counts for tabs
  const subjectCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'ALL': sectionalMocks.length,
      'Quantitative Aptitude': 0,
      'General Intelligence & Reasoning': 0,
      'English Comprehension': 0,
      'General Awareness': 0,
      'Computer Knowledge': 0
    };

    sectionalMocks.forEach(m => {
      if (isMockMatchingSubject(m, 'Quantitative Aptitude')) counts['Quantitative Aptitude']++;
      if (isMockMatchingSubject(m, 'General Intelligence & Reasoning')) counts['General Intelligence & Reasoning']++;
      if (isMockMatchingSubject(m, 'English Comprehension')) counts['English Comprehension']++;
      if (isMockMatchingSubject(m, 'General Awareness')) counts['General Awareness']++;
      if (isMockMatchingSubject(m, 'Computer Knowledge')) counts['Computer Knowledge']++;
    });

    return counts;
  }, [sectionalMocks]);

  const subjectTitle = selectedSubject === 'ALL' ? 'All Subjects' : selectedSubject;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Sectional Dedicated Dashboard Header with interactive subject buttons & filtered KPIs */}
      <SectionalDashboard
        selectedSubject={selectedSubject}
        onSelectSubject={setSelectedSubject}
        allSectionalMocks={sectionalMocks}
        activeMocks={filteredDrills}
      />

      {/* 2. Subject Filter Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Subject Focus Filter
          </h3>
          <span className="text-xs text-slate-400">
            Showing {filteredDrills.length} Drills
          </span>
        </div>

        <SectionalSubjectFilterTabs
          selectedSubject={selectedSubject}
          onSelectSubject={setSelectedSubject}
          counts={subjectCounts}
        />
      </div>

      {/* 3. Sectional Progression Trend Chart */}
      <SectionalTrendChart
        mocks={filteredDrills}
        subjectTitle={subjectTitle}
      />

      {/* 4. Sectional Mock Drills Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {subjectTitle} Practice Tests ({filteredDrills.length})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any drill card to open its single-subject pace diagnosis and error analysis
            </p>
          </div>

          <button
            onClick={() => {
              setEditingMock(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-mint to-mint-dark dark:from-mint dark:to-mint text-darkBg font-extrabold text-xs shadow-glow-mint hover:opacity-90 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Sectional Drill</span>
          </button>
        </div>

        {filteredDrills.length === 0 ? (
          <EmptyState
            title={`No ${subjectTitle} Drills Yet`}
            description={`Log your first 25-question ${subjectTitle} speed drill to activate single-subject pacing intelligence.`}
            actionText={`Log ${subjectTitle} Drill`}
            onAction={() => {
              setEditingMock(null);
              setIsAddModalOpen(true);
            }}
            icon="⚡"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDrills.map((mock) => (
              <SectionalMockCard
                key={mock.id}
                mock={mock}
                onOpenAnalysis={(m) => setAnalyzingMock(m)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Deep Sectional Drill Modal */}
      {analyzingMock && (
        <SectionalDrillAnalysisModal
          mock={analyzingMock}
          onClose={() => setAnalyzingMock(null)}
        />
      )}
    </div>
  );
};
