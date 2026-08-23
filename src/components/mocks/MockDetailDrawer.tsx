import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Edit3, 
  Copy, 
  Trash2, 
  Award, 
  Target, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  FileText
} from 'lucide-react';
import { useMocks } from '../../context/MockContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';

export const MockDetailDrawer: React.FC = () => {
  const { 
    viewingMockDetail, 
    setViewingMockDetail, 
    setEditingMock, 
    setIsAddModalOpen, 
    duplicateMock, 
    deleteMock 
  } = useMocks();

  if (!viewingMockDetail) return null;

  const mock = viewingMockDetail;
  const cutoffDiff = mock.score - mock.cutoffMarks;

  return (
    <Modal
      isOpen={Boolean(viewingMockDetail)}
      onClose={() => setViewingMockDetail(null)}
      title={
        <div className="flex items-center gap-2">
          <Badge variant={mock.isClearedCutoff ? 'success' : 'alert'} size="sm">
            {mock.isClearedCutoff ? 'Cutoff Cleared ✓' : 'Below Cutoff ✗'}
          </Badge>
          <span className="truncate">{mock.testName}</span>
        </div>
      }
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        
        {/* Top Header Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-electric-blue/10 via-darkContainer to-mint/10 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-bold text-electric-blue">{mock.testPlatform}</span>
              <span>•</span>
              <span>{mock.exam} ({mock.tier})</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {mock.date}
              </span>
            </div>

            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-3xl font-black text-white light:text-slate-900">
                {mock.score}
              </span>
              <span className="text-sm font-semibold text-slate-400">
                / {mock.maxMarks} Marks
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                mock.isClearedCutoff ? 'bg-mint/20 text-mint-dark dark:text-mint' : 'bg-alert-red/20 text-alert-red'
              }`}>
                {cutoffDiff >= 0 ? `+${cutoffDiff.toFixed(1)} Cutoff Buffer` : `${cutoffDiff.toFixed(1)} Below Cutoff`}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingMock(mock);
                setViewingMockDetail(null);
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/15 transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>

            <button
              onClick={() => {
                duplicateMock(mock.id);
                setViewingMockDetail(null);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/15 transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Duplicate</span>
            </button>

            <button
              onClick={() => {
                if (confirm(`Delete mock "${mock.testName}"?`)) {
                  deleteMock(mock.id);
                  setViewingMockDetail(null);
                }
              }}
              className="p-2 rounded-xl bg-alert-red/10 text-alert-red hover:bg-alert-red/20 transition-all"
              title="Delete mock"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 6 Key Analytics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-xl bg-darkContainer/50 light:bg-slate-50 border border-white/5 text-center">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Percentile</div>
            <div className="text-lg font-black text-lavender mt-0.5">{mock.percentile}%ile</div>
          </div>

          <div className="p-3.5 rounded-xl bg-darkContainer/50 light:bg-slate-50 border border-white/5 text-center">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Accuracy</div>
            <div className="text-lg font-black text-mint-dark dark:text-mint mt-0.5">{mock.accuracy}%</div>
          </div>

          <div className="p-3.5 rounded-xl bg-darkContainer/50 light:bg-slate-50 border border-white/5 text-center">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Attempt Rate</div>
            <div className="text-lg font-black text-electric-blue mt-0.5">{mock.attemptRate}%</div>
          </div>

          <div className="p-3.5 rounded-xl bg-darkContainer/50 light:bg-slate-50 border border-white/5 text-center">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Time Taken</div>
            <div className="text-lg font-black text-white light:text-slate-900 mt-0.5">{mock.timeTakenMinutes} / {mock.totalTimeMinutes}m</div>
          </div>

          <div className="p-3.5 rounded-xl bg-darkContainer/50 light:bg-slate-50 border border-white/5 text-center">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Negative Drain</div>
            <div className="text-lg font-black text-alert-red mt-0.5">-{mock.negativeMarks} M</div>
          </div>

          <div className="p-3.5 rounded-xl bg-darkContainer/50 light:bg-slate-50 border border-white/5 text-center">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">AIR Rank</div>
            <div className="text-lg font-black text-white light:text-slate-900 mt-0.5">
              {mock.rank ? `#${mock.rank}` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Question Breakdown Strip */}
        <div className="p-4 rounded-xl bg-darkContainer/30 light:bg-slate-50 border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-400 uppercase tracking-wider">Question Distribution</span>
            <span>{mock.totalQuestions} Total Questions</span>
          </div>

          {/* Layered Progress Bar */}
          <div className="w-full h-3 rounded-full bg-darkBg overflow-hidden flex">
            <div
              style={{ width: `${(mock.correct / mock.totalQuestions) * 100}%` }}
              className="h-full bg-mint-dark dark:bg-mint"
              title={`Correct: ${mock.correct}`}
            />
            <div
              style={{ width: `${(mock.wrong / mock.totalQuestions) * 100}%` }}
              className="h-full bg-alert-red"
              title={`Wrong: ${mock.wrong}`}
            />
            <div
              style={{ width: `${(mock.unattempted / mock.totalQuestions) * 100}%` }}
              className="h-full bg-slate-600"
              title={`Unattempted: ${mock.unattempted}`}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-1.5 text-mint-dark dark:text-mint font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{mock.correct} Correct</span>
            </div>
            <div className="flex items-center gap-1.5 text-alert-red font-bold">
              <XCircle className="w-3.5 h-3.5" />
              <span>{mock.wrong} Wrong (-{mock.negativeMarks} marks)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 font-medium">
              <span>{mock.unattempted} Unattempted</span>
            </div>
          </div>
        </div>

        {/* Section-Wise Breakdown Table */}
        {mock.sections.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Section Breakdown ({mock.sections.length} Sections)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mock.sections.map((sec) => (
                <div
                  key={sec.id}
                  className="p-4 rounded-xl bg-darkContainer/50 light:bg-slate-50 border border-white/5 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white light:text-slate-900">
                      {sec.sectionName}
                    </span>
                    <Badge 
                      variant={sec.accuracy >= 85 ? 'success' : sec.accuracy >= 70 ? 'primary' : 'alert'}
                      size="sm"
                    >
                      {sec.status}
                    </Badge>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-lg font-black text-electric-blue">
                        {sec.score} <span className="text-xs text-slate-400 font-normal">/ {sec.maxMarks} M</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {sec.correct} correct, {sec.wrong} wrong, {sec.unattempted} skipped
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-extrabold text-mint-dark dark:text-mint">
                        {sec.accuracy}% Acc
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" />
                        <span>{sec.timeTakenMinutes}m spent</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Self Reflection & Notes */}
        {mock.analysisNotes && (
          <div className="p-4 rounded-xl bg-darkContainer/30 light:bg-slate-50 border border-white/5 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-electric-blue">
              <FileText className="w-3.5 h-3.5" />
              <span>Aspirant Self Reflection & Notes</span>
            </div>
            <p className="text-xs text-slate-300 light:text-slate-700 whitespace-pre-wrap leading-relaxed">
              {mock.analysisNotes}
            </p>
          </div>
        )}

      </div>
    </Modal>
  );
};
