import React from 'react';
import { 
  Calendar, 
  Clock, 
  Award, 
  Target, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sparkles,
  Tag,
  Edit3
} from 'lucide-react';
import { MockTest } from '../../types/mock';
import { useMocks } from '../../context/MockContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';

interface SectionalDrillAnalysisModalProps {
  mock: MockTest | null;
  onClose: () => void;
}

export const SectionalDrillAnalysisModal: React.FC<SectionalDrillAnalysisModalProps> = ({ mock, onClose }) => {
  const { setEditingMock, setIsAddModalOpen } = useMocks();

  if (!mock) return null;

  const subject = mock.subjectName || mock.sections[0]?.sectionName || 'Quantitative Aptitude';
  const paceSeconds = mock.attempted > 0 
    ? Number(((mock.timeTakenMinutes * 60) / mock.attempted).toFixed(0)) 
    : 0;

  // Algorithmic Speed vs Accuracy Assessment
  const getPaceAccuracyVerdict = () => {
    if (mock.accuracy >= 90 && paceSeconds <= 45) {
      return {
        title: 'Elite Speed-Accuracy Balance 🚀',
        desc: 'Exceptional mastery. You maintained top-tier accuracy while answering questions well under the 45-second benchmark.',
        type: 'success'
      };
    }
    if (mock.accuracy < 75 && paceSeconds <= 40) {
      return {
        title: 'Rush Penalty Warning ⚠️',
        desc: `High attempt speed (${paceSeconds}s/Q) caused ${mock.wrong} avoidable negative mistakes (-${mock.negativeMarks} marks). Slow down by 8–10 seconds on tricky questions to double-check steps.`,
        type: 'alert'
      };
    }
    if (mock.accuracy >= 90 && paceSeconds > 55) {
      return {
        title: 'Accuracy High, Pace Bottleneck ⏱️',
        desc: `Great precision (${mock.accuracy}%), but time per question (${paceSeconds}s/Q) is high. Practice daily 15-minute speed drills to trim 12 seconds per question.`,
        type: 'warning'
      };
    }
    return {
      title: 'Solid Sectional Foundation 🎯',
      desc: 'Consistent effort. Focus on converting 2-3 doubtful questions into high-probability answers to cross the 40+ marks threshold.',
      type: 'primary'
    };
  };

  const verdict = getPaceAccuracyVerdict();

  return (
    <Modal
      isOpen={Boolean(mock)}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md text-xs font-black bg-mint/20 text-mint-dark dark:text-mint border border-mint/30">
            {subject}
          </span>
          <span className="truncate">{mock.testName} (Drill Analysis)</span>
        </div>
      }
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        
        {/* Top Header Card */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-darkElevated border border-slate-200 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <span className="font-bold text-sky-700 dark:text-electric-blue">{mock.testPlatform}</span>
              <span>•</span>
              <span>{mock.exam} ({mock.tier})</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {mock.date}
              </span>
            </div>

            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                {mock.score}
              </span>
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                / {mock.maxMarks} Marks
              </span>
              <span className="text-xl font-black text-emerald-700 dark:text-mint ml-2">
                {mock.accuracy}% Accuracy
              </span>
            </div>

            {mock.topicFocus && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <Tag className="w-3.5 h-3.5 text-sky-600 dark:text-electric-blue shrink-0" />
                <span>Chapter Focus: <b className="text-slate-900 dark:text-white">{mock.topicFocus}</b></span>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setEditingMock(mock);
              onClose();
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-electric-blue text-darkBg font-bold text-xs hover:opacity-90 transition-all self-start md:self-auto shadow-glow-blue flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Drill</span>
          </button>
        </div>

        {/* 1. Algorithmic Speed vs Accuracy Diagnosis */}
        <div className="p-5 rounded-2xl bg-emerald-50/80 dark:bg-mint/10 border border-emerald-300 dark:border-mint/30 space-y-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-mint">
            <Sparkles className="w-4 h-4" />
            <span>Sectional Intelligence & Pace Diagnosis</span>
          </div>

          <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
            {verdict.title}
          </h4>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {verdict.desc}
          </p>
        </div>

        {/* 2. Key Drill Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-darkContainer/50 border border-slate-200 dark:border-white/5">
            <div className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase">Pace Speed</div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{paceSeconds}s <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/ Q</span></div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{mock.timeTakenMinutes}m spent total</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-darkContainer/50 border border-slate-200 dark:border-white/5">
            <div className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase">Negative Drain</div>
            <div className="text-xl font-black text-alert-red mt-0.5">-{mock.negativeMarks} M</div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{mock.wrong} wrong penalties</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-darkContainer/50 border border-slate-200 dark:border-white/5">
            <div className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase">Attempt Coverage</div>
            <div className="text-xl font-black text-sky-700 dark:text-electric-blue mt-0.5">{mock.attemptRate}%</div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{mock.attempted} / {mock.totalQuestions} Qs</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-darkContainer/50 border border-slate-200 dark:border-white/5">
            <div className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase">Percentile</div>
            <div className="text-xl font-black text-purple-700 dark:text-lavender mt-0.5">{mock.percentile}%ile</div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Rank #{mock.rank || 'N/A'}</p>
          </div>
        </div>

        {/* 3. Question Distribution Bar */}
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-darkContainer/30 border border-slate-200 dark:border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700 dark:text-slate-400 uppercase tracking-wider">Question Accuracy Distribution</span>
            <span className="text-slate-900 dark:text-white font-bold">{mock.totalQuestions} Questions</span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-300 dark:bg-darkBg overflow-hidden flex">
            <div
              style={{ width: `${(mock.correct / (mock.totalQuestions || 1)) * 100}%` }}
              className="h-full bg-emerald-600 dark:bg-mint"
              title={`Correct: ${mock.correct}`}
            />
            <div
              style={{ width: `${(mock.wrong / (mock.totalQuestions || 1)) * 100}%` }}
              className="h-full bg-alert-red"
              title={`Wrong: ${mock.wrong}`}
            />
            <div
              style={{ width: `${(mock.unattempted / (mock.totalQuestions || 1)) * 100}%` }}
              className="h-full bg-slate-400 dark:bg-slate-600"
              title={`Unattempted: ${mock.unattempted}`}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-mint font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{mock.correct} Correct (+{(mock.correct * (mock.maxMarks / (mock.totalQuestions || 1))).toFixed(1)} M)</span>
            </div>
            <div className="flex items-center gap-1.5 text-alert-red font-bold">
              <XCircle className="w-3.5 h-3.5" />
              <span>{mock.wrong} Wrong (-{mock.negativeMarks} M)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-medium">
              <span>{mock.unattempted} Skipped</span>
            </div>
          </div>
        </div>

        {/* 4. Self Reflection Notes */}
        {mock.analysisNotes && (
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-darkContainer/40 border border-slate-200 dark:border-white/5 space-y-1.5">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-300">
              Aspirant Reflection & Mistakes Log
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-medium">
              {mock.analysisNotes}
            </p>
          </div>
        )}

      </div>
    </Modal>
  );
};
