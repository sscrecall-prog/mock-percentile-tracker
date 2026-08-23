import React, { useState } from 'react';
import { useMocks } from '../context/MockContext';
import { FullLengthDashboard } from '../components/full-length/FullLengthDashboard';
import { FullLengthTrendSection } from '../components/full-length/FullLengthTrendSection';
import { FullSubjectStatsGrid } from '../components/full-length/FullSubjectStatsGrid';
import { MockCard } from '../components/mocks/MockCard';
import { EmptyState } from '../components/common/EmptyState';
import { FullMockAnalysisView } from '../components/full-length/FullMockAnalysisView';
import { MockTest } from '../types/mock';
import { Target, Plus } from 'lucide-react';

export const FullLengthView: React.FC = () => {
  const { fullLengthMocks, setIsAddModalOpen, setEditingMock } = useMocks();
  const [selectedFullMock, setSelectedFullMock] = useState<MockTest | null>(null);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Full Length Dedicated Dashboard Header */}
      <FullLengthDashboard />

      {/* 2. Full Length Trend Progression Chart */}
      <FullLengthTrendSection />

      {/* 3. Subject-wise Aggregate Matrix */}
      <FullSubjectStatsGrid />

      {/* 4. Complete Full Length Mocks Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              All Full Length Mock Tests ({fullLengthMocks.length})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any mock card to open its deep section-by-section analysis and time verdict
            </p>
          </div>

          <button
            onClick={() => {
              setEditingMock(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-electric-blue text-darkBg font-bold text-xs shadow-glow-blue hover:opacity-90 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Full Mock</span>
          </button>
        </div>

        {fullLengthMocks.length === 0 ? (
          <EmptyState
            title="No Full Length Mocks Yet"
            description="Attempt and log your first complete 100-question mock test to activate full exam simulations."
            actionText="Log Full Length Mock"
            onAction={() => {
              setEditingMock(null);
              setIsAddModalOpen(true);
            }}
            icon="🎯"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fullLengthMocks.map((mock) => (
              <div 
                key={mock.id} 
                onClick={() => setSelectedFullMock(mock)}
                className="cursor-pointer"
              >
                <MockCard mock={mock} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Deep Individual Full Length Mock Modal */}
      {selectedFullMock && (
        <FullMockAnalysisView
          mock={selectedFullMock}
          onClose={() => setSelectedFullMock(null)}
        />
      )}
    </div>
  );
};
