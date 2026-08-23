import React from 'react';
import { useMocks } from '../context/MockContext';
import { MockFiltersBar } from '../components/mocks/MockFiltersBar';
import { MockCard } from '../components/mocks/MockCard';
import { EmptyState } from '../components/common/EmptyState';
import { MockDetailDrawer } from '../components/mocks/MockDetailDrawer';
import { MockComparisonModal } from '../components/mocks/MockComparisonModal';

export const MocksView: React.FC = () => {
  const { filteredMocks, setIsAddModalOpen, setEditingMock } = useMocks();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Title & Count Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Mock Test Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Search, filter, compare, and log all sectional and full length practice attempts
        </p>
      </div>

      {/* Filter Toolbar */}
      <MockFiltersBar />

      {/* Mocks Grid */}
      {filteredMocks.length === 0 ? (
        <EmptyState
          title="No Matching Mock Tests"
          description="Try adjusting your active search keyword, exam filter, or log a new mock test to begin tracking."
          actionText="Log New Mock"
          onAction={() => {
            setEditingMock(null);
            setIsAddModalOpen(true);
          }}
          icon="📝"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMocks.map((mock) => (
            <MockCard key={mock.id} mock={mock} />
          ))}
        </div>
      )}

      {/* Modals & Detail Drawers */}
      <MockDetailDrawer />
      <MockComparisonModal />
    </div>
  );
};
