import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Award, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sparkles,
  Zap,
  ArrowRight,
  Flame
} from 'lucide-react';
import { MockTest } from '../../types/mock';
import { useMocks } from '../../context/MockContext';
import { generateIndividualMockVerdict } from '../../engine/feedbackEngine';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';

interface FullMockAnalysisViewProps {
  mock: MockTest | null;
  onClose: () => void;
}

export const FullMockAnalysisView: React.FC<FullMockAnalysisViewProps> = ({ mock, onClose }) => {
  const { mocks, setEditingMock, setIsAddModalOpen } = useMocks();

  if (!mock) return null;

  const verdict = generateIndividualMockVerdict(mock, mocks);
  const cutoffBuffer = mock.score - mock.cutoffMarks;

  // Time Analysis
  const sortedSectionsByTime = [...mock.sections].sort((a, b) => b.timeTakenMinutes - a.timeTakenMinutes);
  const slowestSec = sortedSectionsByTime[0];
  const fastestSec = sortedSectionsByTime[sortedSectionsByTime.length - 1];
  const avgSecondsPerQuestion = mock.attempted > 0 
    ? ((mock.timeTakenMinutes * 60) / mock.attempted).toFixed(0) 
    : '0';

  return (
    <Modal
      isOpen={Boolean(mock)}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Badge variant={mock.isClearedCutoff ? 'success' : 'alert'} size="sm">
            {mock.isClearedCutoff ? 'Cutoff Cleared ✓' : 'Below Cutoff ✗'}
          </Badge>
          <span className="truncate">{mock.testName} (Full Analysis)</span>
        </div>
      }
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        
        {/* Top Header Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-darkElevated via-darkSurface to-darkContainer light:from-slate-50 light:via-white light:to-sky-50 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
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
              <span className="text-3xl sm:text-4xl font-black text-white light:text-slate-900">
                {mock.score}
              </span>
              <span className="text-sm font-semibold text-slate-400">
                / {mock.maxMarks} Marks
              </span>
              <span className="text-xl font-black text-lavender ml-2">
                {mock.percentile}%ile
              </span>
            </div>

            <div className="mt-2 flex items-center gap-3 text-xs">
              <span className={`font-bold ${cutoffBuffer >= 0 ? 'text-mint-dark dark:text-mint' : 'text-alert-red'}`}>
                {cutoffBuffer >= 0 ? `+${cutoffBuffer.toFixed(1)} Marks Above Cutoff` : `${cutoffBuffer.toFixed(1)} Below Cutoff`}
              </span>
              {mock.rank && (
                <>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-300 font-semibold">AIR Rank #{mock.rank} of {mock.totalStudents || '15k+'}</span>
                </>
              )}
            </div>
          </div>

          {/* Quick Edit */}
          <button
            onClick={() => {
              setEditingMock(mock);
              onClose();
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-electric-blue text-darkBg font-bold text-xs hover:opacity-90 transition-all self-start md:self-auto shadow-glow-blue"
          >
            Edit Record
          </button>
        </div>

        {/* 1. Algorithmic Performance Verdict */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-electric-blue/10 via-darkContainer to-mint/10 border border-electric-blue/30 space-y-3">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-electric-blue">
            <Sparkles className="w-4 h-4 fill-electric-blue" />
            <span>Automated Performance Intelligence Verdict</span>
          </div>

          <p className="text-sm sm:text-base font-semibold text-white light:text-slate-900 leading-relaxed">
            &quot;{verdict.summary}&quot;
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-darkSurface/60 light:bg-white border border-mint/20 space-y-1">
              <div className="font-bold text-mint-dark dark:text-mint flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Key Pillars & Strengths</span>
              </div>
              <ul className="list-disc list-inside text-slate-300 light:text-slate-700 text-[11px] space-y-0.5">
                {verdict.keyStrengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-darkSurface/60 light:bg-white border border-alert-red/20 space-y-1">
              <div className="font-bold text-alert-red flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Areas Requiring Focus</span>
              </div>
              <ul className="list-disc list-inside text-slate-300 light:text-slate-700 text-[11px] space-y-0.5">
                {verdict.criticalWeaknesses.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 2. Section Performance Cards */}
        {mock.sections.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Section-by-Section Examination Breakdown
              </h4>
              <span className="text-xs text-slate-400">{mock.sections.length} Sections</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mock.sections.map((sec) => (
                <div
                  key={sec.id}
                  className="p-4 rounded-xl bg-darkContainer/50 light:bg-slate-50 border border-white/5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white light:text-slate-900 line-clamp-1">
                      {sec.sectionName}
                    </span>
                    <Badge
                      variant={sec.accuracy >= 85 ? 'success' : sec.accuracy >= 70 ? 'primary' : 'alert'}
                      size="sm"
                    >
                      {sec.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-darkSurface light:bg-white border border-white/5">
                      <div className="text-[10px] text-slate-400">Score</div>
                      <div className="font-extrabold text-electric-blue mt-0.5">
                        {sec.score} <span className="text-[9px] text-slate-400">/{sec.maxMarks}</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-darkSurface light:bg-white border border-white/5">
                      <div className="text-[10px] text-slate-400">Accuracy</div>
                      <div className="font-extrabold text-mint-dark dark:text-mint mt-0.5">
                        {sec.accuracy}%
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-darkSurface light:bg-white border border-white/5">
                      <div className="text-[10px] text-slate-400">Time</div>
                      <div className="font-extrabold text-white light:text-slate-900 mt-0.5">
                        {sec.timeTakenMinutes}m
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                    <span>{sec.correct} correct • {sec.wrong} wrong • {sec.unattempted} skipped</span>
                    <span className="font-bold text-slate-300">
                      {sec.totalQuestions > 0 ? ((sec.attempted / sec.totalQuestions) * 100).toFixed(0) : 0}% Attempted
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Time Management Analysis */}
        <div className="p-5 rounded-2xl bg-darkContainer/40 light:bg-slate-50 border border-white/5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Clock className="w-4 h-4 text-electric-blue" />
            <span>Time Management & Efficiency</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-darkSurface light:bg-white border border-white/5">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Average Pace</div>
              <div className="text-base font-black text-white light:text-slate-900 mt-1">
                {avgSecondsPerQuestion} seconds
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">per attempted question</p>
            </div>

            {slowestSec && (
              <div className="p-3 rounded-xl bg-darkSurface light:bg-white border border-white/5">
                <div className="text-slate-400 text-[10px] uppercase font-semibold">Slowest Section</div>
                <div className="text-sm font-black text-amberAccent mt-1 truncate">
                  {slowestSec.sectionName}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{slowestSec.timeTakenMinutes}m spent total</p>
              </div>
            )}

            {fastestSec && (
              <div className="p-3 rounded-xl bg-darkSurface light:bg-white border border-white/5">
                <div className="text-slate-400 text-[10px] uppercase font-semibold">Fastest Section</div>
                <div className="text-sm font-black text-mint-dark dark:text-mint mt-1 truncate">
                  {fastestSec.sectionName}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{fastestSec.timeTakenMinutes}m spent total</p>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400 italic">
            Verdict: {verdict.paceVerdict}
          </p>
        </div>

      </div>
    </Modal>
  );
};
