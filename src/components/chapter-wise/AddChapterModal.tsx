import React, { useState } from 'react';
import { Layers, Plus, X, Tag } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useMocks } from '../../context/MockContext';

interface AddChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject?: string;
}

export const AddChapterModal: React.FC<AddChapterModalProps> = ({
  isOpen,
  onClose,
  defaultSubject
}) => {
  const { subjectsWithChapters, addCustomChapter } = useMocks();

  const [subject, setSubject] = useState(defaultSubject || subjectsWithChapters[0]?.name || 'Quantitative Aptitude');
  const [chapterName, setChapterName] = useState('');
  const [targetAccuracy, setTargetAccuracy] = useState(85);
  const [subtopicsInput, setSubtopicsInput] = useState('');
  const [error, setError] = useState('');

  // Update default subject if prop changes
  React.useEffect(() => {
    if (defaultSubject) setSubject(defaultSubject);
  }, [defaultSubject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapterName.trim()) {
      setError('Chapter name is required');
      return;
    }

    const subtopics = subtopicsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    addCustomChapter(subject, chapterName.trim(), subtopics, targetAccuracy);
    setChapterName('');
    setSubtopicsInput('');
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-slate-900 dark:text-white">
          <Layers className="w-5 h-5 text-emerald-600 dark:text-mint" />
          <span>Add Custom Chapter / Topic</span>
        </div>
      }
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-alert-red/10 border border-alert-red/30 text-alert-red text-xs font-bold">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Select Subject *
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-darkContainer border border-slate-300 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white focus:border-emerald-500 outline-none"
          >
            {subjectsWithChapters.map((s) => (
              <option key={s.id} value={s.name}>
                {s.icon} {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Chapter / Topic Title *
          </label>
          <input
            type="text"
            required
            autoFocus
            value={chapterName}
            onChange={(e) => setChapterName(e.target.value)}
            placeholder="e.g. Permutation & Combination, Circle Incenter..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-darkContainer border border-slate-300 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:border-emerald-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Tested Subtopics / Key Concepts (Comma Separated)
          </label>
          <input
            type="text"
            value={subtopicsInput}
            onChange={(e) => setSubtopicsInput(e.target.value)}
            placeholder="e.g. Circular Arrangement, Repetition Rules, Word Formation"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-darkContainer border border-slate-300 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:border-emerald-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Target Mastery Accuracy Benchmark (%): {targetAccuracy}%
          </label>
          <input
            type="range"
            min="60"
            max="100"
            step="5"
            value={targetAccuracy}
            onChange={(e) => setTargetAccuracy(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white dark:text-darkBg font-black text-xs shadow-glow-blue transition-all"
          >
            Add Chapter
          </button>
        </div>
      </form>
    </Modal>
  );
};
