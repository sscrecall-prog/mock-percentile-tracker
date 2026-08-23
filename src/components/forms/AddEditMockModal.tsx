import React, { useState, useEffect } from 'react';
import { Calculator, Save, AlertCircle, HelpCircle, Plus, X, Check, Target, Zap, Clock, ShieldCheck, FileText } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useMocks } from '../../context/MockContext';
import { MockTest, ExamType, ExamTier, MockTestType, SectionPerformance, SectionName } from '../../types/mock';
import { DEFAULT_PLATFORMS } from '../../data/storage';
import { validateMockTestData, calculateSectionMetrics } from '../../engine/calculations';

interface SectionDraft {
  sectionName: SectionName;
  customName?: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  timeTakenMinutes: number;
  maxMarks: number;
  score: number;
}

const DEFAULT_SSC_SECTIONS: SectionDraft[] = [
  { sectionName: 'General Intelligence & Reasoning', totalQuestions: 25, attempted: 25, correct: 24, wrong: 1, timeTakenMinutes: 14, maxMarks: 50, score: 47.5 },
  { sectionName: 'General Awareness', totalQuestions: 25, attempted: 18, correct: 13, wrong: 5, timeTakenMinutes: 7, maxMarks: 50, score: 23.5 },
  { sectionName: 'Quantitative Aptitude', totalQuestions: 25, attempted: 20, correct: 17, wrong: 3, timeTakenMinutes: 26, maxMarks: 50, score: 32.5 },
  { sectionName: 'English Comprehension', totalQuestions: 25, attempted: 22, correct: 20, wrong: 2, timeTakenMinutes: 12, maxMarks: 50, score: 39.0 }
];

export const AddEditMockModal: React.FC = () => {
  const { 
    isAddModalOpen, 
    setIsAddModalOpen, 
    editingMock, 
    setEditingMock, 
    addMock, 
    editMock,
    customPlatforms,
    addCustomPlatform
  } = useMocks();

  const [testName, setTestName] = useState('');
  const [exam, setExam] = useState<ExamType>('SSC CGL');
  const [tier, setTier] = useState<ExamTier>('Tier 1');
  const [mockType, setMockType] = useState<MockTestType>('FULL_LENGTH');
  const [subjectName, setSubjectName] = useState<SectionName>('Quantitative Aptitude');
  const [topicFocus, setTopicFocus] = useState('');
  const [testPlatform, setTestPlatform] = useState('Testbook');
  const [isAddingCustomPlatform, setIsAddingCustomPlatform] = useState(false);
  const [customPlatformInput, setCustomPlatformInput] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const [totalQuestions, setTotalQuestions] = useState(100);
  const [maxMarks, setMaxMarks] = useState(200);
  const [totalTimeMinutes, setTotalTimeMinutes] = useState(60);
  const [timeTakenMinutes, setTimeTakenMinutes] = useState(58);

  const [attempted, setAttempted] = useState(85);
  const [correct, setCorrect] = useState(74);
  const [wrong, setWrong] = useState(11);
  const [percentile, setPercentile] = useState(92.4);
  const [rank, setRank] = useState<number | undefined>(1450);
  const [totalStudents, setTotalStudents] = useState<number | undefined>(18000);
  const [cutoffMarks, setCutoffMarks] = useState(135);
  const [analysisNotes, setAnalysisNotes] = useState('');

  const [sections, setSections] = useState<SectionDraft[]>(DEFAULT_SSC_SECTIONS);
  const [activeTab, setActiveTab] = useState<'basics' | 'sections' | 'notes'>('basics');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const isSectional = mockType === 'SECTIONAL' || mockType === 'SUBJECT';

  const handleMockTypeSwitch = (type: MockTestType) => {
    setMockType(type);
    if (type === 'SECTIONAL' || type === 'SUBJECT') {
      setTotalQuestions(25);
      setMaxMarks(50);
      setTotalTimeMinutes(20);
      setTimeTakenMinutes(16);
      setAttempted(22);
      setCorrect(19);
      setWrong(3);
      setCutoffMarks(34);
      setPercentile(91.5);
      if (!editingMock) {
        setTestName(`${subjectName} Sectional Drill #${Math.floor(Math.random() * 90 + 10)}`);
      }
    } else if (type === 'FULL_LENGTH') {
      setTotalQuestions(100);
      setMaxMarks(200);
      setTotalTimeMinutes(60);
      setTimeTakenMinutes(58);
      setAttempted(85);
      setCorrect(74);
      setWrong(11);
      setCutoffMarks(135);
      setPercentile(92.5);
      if (!editingMock) {
        setTestName(`SSC CGL Live Mock #${Math.floor(Math.random() * 90 + 10)}`);
      }
    }
  };

  useEffect(() => {
    if (editingMock) {
      setTestName(editingMock.testName);
      setExam(editingMock.exam);
      setTier(editingMock.tier);
      setMockType(editingMock.mockType);
      setSubjectName(editingMock.subjectName || (editingMock.sections[0]?.sectionName as SectionName) || 'Quantitative Aptitude');
      setTopicFocus(editingMock.topicFocus || editingMock.weakAreas?.join(', ') || '');
      setTestPlatform(editingMock.testPlatform);
      setDate(editingMock.date);
      setTotalQuestions(editingMock.totalQuestions);
      setMaxMarks(editingMock.maxMarks);
      setTotalTimeMinutes(editingMock.totalTimeMinutes);
      setTimeTakenMinutes(editingMock.timeTakenMinutes);
      setAttempted(editingMock.attempted);
      setCorrect(editingMock.correct);
      setWrong(editingMock.wrong);
      setPercentile(editingMock.percentile);
      setRank(editingMock.rank);
      setTotalStudents(editingMock.totalStudents);
      setCutoffMarks(editingMock.cutoffMarks);
      setAnalysisNotes(editingMock.analysisNotes || '');

      if (editingMock.sections && editingMock.sections.length > 0) {
        setSections(editingMock.sections.map(s => ({
          sectionName: s.sectionName,
          customName: s.customName,
          totalQuestions: s.totalQuestions,
          attempted: s.attempted,
          correct: s.correct,
          wrong: s.wrong,
          timeTakenMinutes: s.timeTakenMinutes,
          maxMarks: s.maxMarks,
          score: s.score
        })));
      }
    } else {
      setTestName(`SSC CGL Live Mock #${Math.floor(Math.random() * 90 + 10)}`);
      setExam('SSC CGL');
      setTier('Tier 1');
      setMockType('FULL_LENGTH');
      setSubjectName('Quantitative Aptitude');
      setTopicFocus('');
      setTestPlatform('Testbook');
      setDate(new Date().toISOString().split('T')[0]);
      setTotalQuestions(100);
      setMaxMarks(200);
      setTotalTimeMinutes(60);
      setTimeTakenMinutes(58);
      setAttempted(85);
      setCorrect(74);
      setWrong(11);
      setPercentile(92.5);
      setRank(1520);
      setTotalStudents(19000);
      setCutoffMarks(135);
      setAnalysisNotes('');
      setSections(DEFAULT_SSC_SECTIONS);
    }
    setValidationErrors([]);
    setActiveTab('basics');
  }, [editingMock, isAddModalOpen]);

  const unattempted = Math.max(0, totalQuestions - attempted);
  const accuracy = attempted > 0 ? Number(((correct / attempted) * 100).toFixed(1)) : 0;
  const attemptRate = totalQuestions > 0 ? Number(((attempted / totalQuestions) * 100).toFixed(1)) : 0;
  const marksPerQuestion = maxMarks / (totalQuestions || 1);
  const negativeDeductionPerWrong = marksPerQuestion * 0.25;
  const calculatedNegativeMarks = Number((wrong * negativeDeductionPerWrong).toFixed(2));
  const calculatedScore = Number(Math.max(-maxMarks, (correct * marksPerQuestion - calculatedNegativeMarks)).toFixed(2));

  const syncFromSections = () => {
    const sumTotalQ = sections.reduce((a, s) => a + s.totalQuestions, 0);
    const sumAtt = sections.reduce((a, s) => a + s.attempted, 0);
    const sumCorr = sections.reduce((a, s) => a + s.correct, 0);
    const sumWrong = sections.reduce((a, s) => a + s.wrong, 0);
    const sumMax = sections.reduce((a, s) => a + s.maxMarks, 0);
    const sumTime = sections.reduce((a, s) => a + s.timeTakenMinutes, 0);

    setTotalQuestions(sumTotalQ);
    setAttempted(sumAtt);
    setCorrect(sumCorr);
    setWrong(sumWrong);
    setMaxMarks(sumMax);
    setTimeTakenMinutes(sumTime);
  };

  const handleSectionChange = (index: number, field: keyof SectionDraft, value: any) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: value };

    const marksPerQ = updated[index].totalQuestions > 0 ? updated[index].maxMarks / updated[index].totalQuestions : 2;
    const metrics = calculateSectionMetrics(
      updated[index].totalQuestions,
      updated[index].correct,
      updated[index].wrong,
      marksPerQ,
      marksPerQ * 0.25,
      updated[index].timeTakenMinutes
    );

    updated[index].score = metrics.score;
    setSections(updated);
  };

  const handleAddSection = () => {
    setSections(prev => [
      ...prev,
      {
        sectionName: 'Custom',
        customName: `Custom Module ${prev.length + 1}`,
        totalQuestions: 25,
        attempted: 20,
        correct: 18,
        wrong: 2,
        timeTakenMinutes: 15,
        maxMarks: 50,
        score: 35.0
      }
    ]);
  };

  const handleRemoveSection = (index: number) => {
    if (sections.length <= 1) return;
    setSections(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    let formattedSections: SectionPerformance[] = [];

    if (isSectional) {
      // Single-section drill: create 1 section directly matching subject
      formattedSections = [{
        id: `sec-${Date.now()}-1`,
        mockId: editingMock ? editingMock.id : 'temp',
        sectionName: subjectName,
        customName: subjectName === 'Custom' ? 'Custom Subject' : undefined,
        totalQuestions,
        attempted,
        correct,
        wrong,
        unattempted,
        maxMarks,
        score: calculatedScore,
        accuracy,
        timeTakenMinutes,
        status: accuracy >= 90 ? 'Mastered' : accuracy >= 75 ? 'Strong' : accuracy >= 60 ? 'Average' : 'Needs Improvement'
      }];
    } else {
      // Full Length: use section breakdown
      formattedSections = sections.map((s, idx) => {
        const marksPerQ = s.totalQuestions > 0 ? s.maxMarks / s.totalQuestions : 2;
        const metrics = calculateSectionMetrics(
          s.totalQuestions,
          s.correct,
          s.wrong,
          marksPerQ,
          marksPerQ * 0.25,
          s.timeTakenMinutes
        );

        return {
          id: `sec-${Date.now()}-${idx}`,
          mockId: editingMock ? editingMock.id : 'temp',
          sectionName: s.sectionName,
          customName: s.customName,
          totalQuestions: s.totalQuestions,
          attempted: s.attempted,
          correct: s.correct,
          wrong: s.wrong,
          unattempted: Math.max(0, s.totalQuestions - s.attempted),
          maxMarks: s.maxMarks,
          score: metrics.score,
          accuracy: metrics.accuracy,
          timeTakenMinutes: s.timeTakenMinutes,
          status: metrics.accuracy >= 90 ? 'Mastered' : metrics.accuracy >= 75 ? 'Strong' : metrics.accuracy >= 60 ? 'Average' : 'Needs Improvement'
        };
      });
    }

    const mockPayload: Omit<MockTest, 'id' | 'createdAt'> = {
      testName: testName.trim(),
      exam,
      tier,
      mockType,
      subjectName: isSectional ? subjectName : undefined,
      topicFocus: topicFocus.trim() || undefined,
      testPlatform,
      date,
      totalQuestions,
      maxMarks,
      totalTimeMinutes,
      timeTakenMinutes,
      attempted,
      correct,
      wrong,
      unattempted,
      score: calculatedScore,
      negativeMarks: calculatedNegativeMarks,
      accuracy,
      attemptRate,
      percentile,
      rank: rank ? Number(rank) : undefined,
      totalStudents: totalStudents ? Number(totalStudents) : undefined,
      cutoffMarks,
      isClearedCutoff: calculatedScore >= cutoffMarks,
      sections: formattedSections,
      weakAreas: isSectional 
        ? (topicFocus ? [topicFocus] : [])
        : formattedSections.filter(s => s.accuracy < 75).map(s => `${s.sectionName} Accuracy`),
      analysisNotes
    };

    const validation = validateMockTestData(mockPayload);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    if (editingMock) {
      editMock(editingMock.id, mockPayload);
    } else {
      addMock(mockPayload);
    }

    setIsAddModalOpen(false);
    setEditingMock(null);
  };

  const handleSaveCustomPlatform = () => {
    if (customPlatformInput.trim()) {
      const added = addCustomPlatform(customPlatformInput.trim());
      if (added) {
        setTestPlatform(added);
        setIsAddingCustomPlatform(false);
        setCustomPlatformInput('');
      }
    }
  };

  return (
    <Modal
      isOpen={isAddModalOpen}
      onClose={() => {
        setIsAddModalOpen(false);
        setEditingMock(null);
      }}
      title={
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-electric-blue" />
          <span>{editingMock ? 'Edit Mock Test Result' : 'Log New Mock Test Result'}</span>
        </div>
      }
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* 1. Primary Mock Type Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 dark:bg-darkContainer/70 border border-slate-200 dark:border-white/10">
          <button
            type="button"
            onClick={() => handleMockTypeSwitch('FULL_LENGTH')}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
              !isSectional
                ? 'bg-electric-blue text-darkBg shadow-glow-blue'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Full Length Mock (100 Qs)</span>
          </button>

          <button
            type="button"
            onClick={() => handleMockTypeSwitch('SECTIONAL')}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
              isSectional
                ? 'bg-mint-dark dark:bg-mint text-darkBg shadow-glow-mint'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Sectional / Subject Drill (25 Qs)</span>
          </button>
        </div>

        {/* 2. Full Length Tabs (HIDDEN IN SECTIONAL MODE) */}
        {!isSectional && (
          <div className="flex border-b border-slate-200 dark:border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('basics')}
              className={`flex-1 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                activeTab === 'basics'
                  ? 'border-electric-blue text-sky-700 dark:text-electric-blue bg-sky-50 dark:bg-electric-blue/5'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              1. Basic Information
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sections')}
              className={`flex-1 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                activeTab === 'sections'
                  ? 'border-electric-blue text-sky-700 dark:text-electric-blue bg-sky-50 dark:bg-electric-blue/5'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              2. Section Breakdown ({sections.length} Sections)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                activeTab === 'notes'
                  ? 'border-electric-blue text-sky-700 dark:text-electric-blue bg-sky-50 dark:bg-electric-blue/5'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              3. Self Notes & Analysis
            </button>
          </div>
        )}

        {/* Validation Errors alert */}
        {validationErrors.length > 0 && (
          <div className="p-4 rounded-xl bg-alert-red/10 border border-alert-red/30 text-alert-red space-y-1 text-xs">
            <div className="font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Please review the following inputs:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5">
              {validationErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* SECTIONAL MODE: STREAMLINED SINGLE-PAGE FORM */}
        {isSectional && (
          <div className="space-y-5 animate-fadeIn">
            {/* Subject Selection & Topic Focus */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Subject / Section *
                </label>
                <select
                  value={subjectName}
                  onChange={(e) => {
                    const val = e.target.value as SectionName;
                    setSubjectName(val);
                    if (!editingMock) {
                      setTestName(`${val} Sectional Drill #${Math.floor(Math.random() * 90 + 10)}`);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-darkContainer light:bg-slate-50 border border-electric-blue text-sm font-bold text-electric-blue focus:outline-none"
                >
                  <option value="Quantitative Aptitude">📐 Quantitative Aptitude (Maths)</option>
                  <option value="General Intelligence & Reasoning">🧠 General Intelligence & Reasoning</option>
                  <option value="English Comprehension">📖 English Comprehension & Grammar</option>
                  <option value="General Awareness">🌍 General Awareness (GK / GS / Current Affairs)</option>
                  <option value="Computer Knowledge">💻 Computer Knowledge Module</option>
                  <option value="Custom">Custom Subject</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Topic Focus / Tested Chapters
                </label>
                <input
                  type="text"
                  value={topicFocus}
                  onChange={(e) => setTopicFocus(e.target.value)}
                  placeholder="e.g. Time & Work, Algebra, Syllogism, Vocab..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-darkContainer light:bg-slate-50 border border-white/10 light:border-slate-300 text-sm focus:border-electric-blue outline-none"
                />
              </div>
            </div>

            {/* Test Title & Platform */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Drill Title *
                </label>
                <input
                  type="text"
                  required
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="e.g. Quant Speed Drill #12"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-darkContainer light:bg-slate-50 border border-white/10 light:border-slate-300 text-sm focus:border-electric-blue outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Platform *
                  </label>
                  {!isAddingCustomPlatform && (
                    <button
                      type="button"
                      onClick={() => setIsAddingCustomPlatform(true)}
                      className="text-[11px] font-bold text-electric-blue hover:underline flex items-center gap-0.5"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Custom</span>
                    </button>
                  )}
                </div>

                {isAddingCustomPlatform ? (
                  <div className="flex items-center gap-1.5 animate-fadeIn">
                    <input
                      type="text"
                      autoFocus
                      value={customPlatformInput}
                      onChange={(e) => setCustomPlatformInput(e.target.value)}
                      placeholder="Platform name..."
                      className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-darkContainer light:bg-slate-50 border border-electric-blue text-xs focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSaveCustomPlatform();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleSaveCustomPlatform}
                      className="px-2.5 py-2 rounded-xl bg-electric-blue text-darkBg text-xs font-extrabold shadow-glow-blue hover:opacity-90 transition-all shrink-0"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCustomPlatform(false);
                        setCustomPlatformInput('');
                      }}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <select
                    value={testPlatform}
                    onChange={(e) => {
                      if (e.target.value === '__NEW_CUSTOM__') {
                        setIsAddingCustomPlatform(true);
                      } else {
                        setTestPlatform(e.target.value);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-darkContainer light:bg-slate-50 border border-white/10 light:border-slate-300 text-sm focus:border-electric-blue outline-none"
                  >
                    <optgroup label="Popular Platforms">
                      {DEFAULT_PLATFORMS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </optgroup>
                    {customPlatforms.length > 0 && (
                      <optgroup label="Your Custom Platforms">
                        {customPlatforms.map((p) => (
                          <option key={p} value={p}>⭐ {p}</option>
                        ))}
                      </optgroup>
                    )}
                    <option value="__NEW_CUSTOM__" className="font-bold text-electric-blue">
                      ➕ + Add Custom Platform...
                    </option>
                  </select>
                )}
              </div>
            </div>

            {/* Exam, Tier, Date */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Exam
                </label>
                <select
                  value={exam}
                  onChange={(e) => setExam(e.target.value as ExamType)}
                  className="w-full px-3 py-2 rounded-xl bg-darkContainer light:bg-slate-50 border border-white/10 text-xs sm:text-sm focus:border-electric-blue outline-none"
                >
                  <option value="SSC CGL">SSC CGL</option>
                  <option value="SSC CHSL">SSC CHSL</option>
                  <option value="SSC MTS">SSC MTS</option>
                  <option value="RRB NTPC">RRB NTPC</option>
                  <option value="IBPS PO">IBPS PO</option>
                  <option value="SBI PO">SBI PO</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Stage / Tier
                </label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value as ExamTier)}
                  className="w-full px-3 py-2 rounded-xl bg-darkContainer light:bg-slate-50 border border-white/10 text-xs sm:text-sm focus:border-electric-blue outline-none"
                >
                  <option value="Tier 1">Tier 1</option>
                  <option value="Tier 2">Tier 2</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Test Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-darkContainer light:bg-slate-50 border border-white/10 text-xs sm:text-sm focus:border-electric-blue outline-none"
                />
              </div>
            </div>

            {/* Questions & Performance Metrics */}
            <div className="p-4 rounded-2xl bg-darkContainer/40 light:bg-slate-50 border border-white/5 space-y-4">
              <div className="text-xs font-bold text-slate-300 light:text-slate-800 uppercase tracking-wider flex items-center justify-between">
                <span>Drill Performance Inputs</span>
                <span className="text-electric-blue font-extrabold">{totalQuestions} Total Questions • {maxMarks} Marks</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Attempted Qs</label>
                  <input
                    type="number"
                    min="0"
                    max={totalQuestions}
                    value={attempted}
                    onChange={(e) => setAttempted(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-darkSurface light:bg-white border border-white/10 text-sm font-bold focus:border-electric-blue outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-mint-dark dark:text-mint mb-1">Correct Qs</label>
                  <input
                    type="number"
                    min="0"
                    max={attempted}
                    value={correct}
                    onChange={(e) => setCorrect(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-darkSurface light:bg-white border border-mint/30 text-sm font-bold text-mint-dark dark:text-mint focus:border-mint outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-alert-red mb-1">Wrong Qs</label>
                  <input
                    type="number"
                    min="0"
                    max={attempted - correct}
                    value={wrong}
                    onChange={(e) => setWrong(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-darkSurface light:bg-white border border-alert-red/30 text-sm font-bold text-alert-red focus:border-alert-red outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Time Taken (min)</label>
                  <input
                    type="number"
                    min="1"
                    max={120}
                    value={timeTakenMinutes}
                    onChange={(e) => setTimeTakenMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-darkSurface light:bg-white border border-white/10 text-sm font-bold focus:border-electric-blue outline-none"
                  />
                </div>
              </div>

              {/* Instant Calculated Score Banner */}
              <div className="p-3.5 rounded-xl bg-darkSurface light:bg-white border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-400">Score: </span>
                  <span className="text-base font-black text-electric-blue">{calculatedScore}</span>
                  <span className="text-slate-400"> / {maxMarks} Marks</span>
                </div>

                <div>
                  <span className="text-slate-400">Accuracy: </span>
                  <span className="text-sm font-black text-mint-dark dark:text-mint">{accuracy}%</span>
                </div>

                <div>
                  <span className="text-slate-400">Negative Loss: </span>
                  <span className="text-sm font-black text-alert-red">-{calculatedNegativeMarks} M</span>
                </div>

                <div>
                  <span className="text-slate-400">Speed: </span>
                  <span className="text-sm font-black text-white light:text-slate-900">
                    {attempted > 0 ? ((timeTakenMinutes * 60) / attempted).toFixed(0) : 0}s / Q
                  </span>
                </div>
              </div>
            </div>

            {/* Percentile, Cutoff & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Sectional Percentile (%ile)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={percentile}
                  onChange={(e) => setPercentile(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-darkContainer light:bg-slate-50 border border-white/10 text-sm font-bold text-lavender focus:border-lavender outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Target / Cutoff Benchmark (Marks)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={cutoffMarks}
                  onChange={(e) => setCutoffMarks(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-darkContainer light:bg-slate-50 border border-white/10 text-sm font-bold focus:border-electric-blue outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Self Notes & Weak Area Log
              </label>
              <textarea
                rows={2}
                value={analysisNotes}
                onChange={(e) => setAnalysisNotes(e.target.value)}
                placeholder="What mistakes occurred? e.g. Calculation error in compound interest, skipped geometry question..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-darkContainer light:bg-slate-50 border border-white/10 text-xs sm:text-sm focus:border-electric-blue outline-none resize-none"
              />
            </div>
          </div>
        )}

        {/* FULL LENGTH MODE: TABBED EXPERIENCE */}
        {!isSectional && activeTab === 'basics' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Mock Test Title *
                </label>
                <input
                  type="text"
                  required
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="e.g. SSC CGL Tier 1 All India Live Mock #12"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-darkContainer light:bg-slate-50 border border-white/10 light:border-slate-300 text-sm focus:border-electric-blue outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Platform *
                  </label>
                  {!isAddingCustomPlatform && (
                    <button
                      type="button"
                      onClick={() => setIsAddingCustomPlatform(true)}
                      className="text-[11px] font-bold text-electric-blue hover:underline flex items-center gap-0.5"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Custom</span>
                    </button>
                  )}
                </div>

                {isAddingCustomPlatform ? (
                  <div className="flex items-center gap-1.5 animate-fadeIn">
                    <input
                      type="text"
                      autoFocus
                      value={customPlatformInput}
                      onChange={(e) => setCustomPlatformInput(e.target.value)}
                      placeholder="e.g. TestSeries247, Coaching X..."
                      className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-darkContainer light:bg-slate-50 border border-electric-blue text-xs focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSaveCustomPlatform();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleSaveCustomPlatform}
                      className="px-2.5 py-2 rounded-xl bg-electric-blue text-darkBg text-xs font-extrabold shadow-glow-blue hover:opacity-90 transition-all shrink-0"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCustomPlatform(false);
                        setCustomPlatformInput('');
                      }}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <select
                    value={testPlatform}
                    onChange={(e) => {
                      if (e.target.value === '__NEW_CUSTOM__') {
                        setIsAddingCustomPlatform(true);
                      } else {
                        setTestPlatform(e.target.value);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-darkContainer light:bg-slate-50 border border-white/10 light:border-slate-300 text-sm focus:border-electric-blue outline-none"
                  >
                    <optgroup label="Popular Platforms">
                      {DEFAULT_PLATFORMS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </optgroup>
                    {customPlatforms.length > 0 && (
                      <optgroup label="Your Custom Platforms">
                        {customPlatforms.map((p) => (
                          <option key={p} value={p}>⭐ {p}</option>
                        ))}
                      </optgroup>
                    )}
                    <option value="__NEW_CUSTOM__" className="font-bold text-electric-blue">
                      ➕ + Add Custom Platform...
                    </option>
                  </select>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Exam
                </label>
                <select
                  value={exam}
                  onChange={(e) => setExam(e.target.value as ExamType)}
                  className="w-full px-3 py-2 rounded-xl bg-darkContainer light:bg-slate-50 border border-white/10 text-xs sm:text-sm focus:border-electric-blue outline-none"
                >
                  <option value="SSC CGL">SSC CGL</option>
                  <option value="SSC CHSL">SSC CHSL</option>
                  <option value="SSC MTS">SSC MTS</option>
                  <option value="RRB NTPC">RRB NTPC</option>
                  <option value="IBPS PO">IBPS PO</option>
                  <option value="SBI PO">SBI PO</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Stage / Tier
                </label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value as ExamTier)}
                  className="w-full px-3 py-2 rounded-xl bg-darkContainer light:bg-slate-50 border border-white/10 text-xs sm:text-sm focus:border-electric-blue outline-none"
                >
                  <option value="Tier 1">Tier 1</option>
                  <option value="Tier 2">Tier 2</option>
                  <option value="Prelims">Prelims</option>
                  <option value="Mains">Mains</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Test Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-darkContainer light:bg-slate-50 border border-white/10 text-xs sm:text-sm focus:border-electric-blue outline-none"
                />
              </div>
            </div>

            {/* Overall Summary Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-darkContainer/50 light:bg-slate-50 border border-white/5">
              <div>
                <label className="block text-xs text-slate-400 font-semibold mb-1">Attempted Qs</label>
                <input
                  type="number"
                  value={attempted}
                  onChange={(e) => setAttempted(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-darkSurface light:bg-white border border-white/10 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs text-mint-dark dark:text-mint font-semibold mb-1">Correct Qs</label>
                <input
                  type="number"
                  value={correct}
                  onChange={(e) => setCorrect(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-darkSurface light:bg-white border border-mint/30 text-sm font-bold text-mint-dark dark:text-mint"
                />
              </div>

              <div>
                <label className="block text-xs text-alert-red font-semibold mb-1">Wrong Qs</label>
                <input
                  type="number"
                  value={wrong}
                  onChange={(e) => setWrong(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-darkSurface light:bg-white border border-alert-red/30 text-sm font-bold text-alert-red"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-semibold mb-1">Time Taken (min)</label>
                <input
                  type="number"
                  value={timeTakenMinutes}
                  onChange={(e) => setTimeTakenMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-darkSurface light:bg-white border border-white/10 text-sm font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Percentile (%ile)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={percentile}
                  onChange={(e) => setPercentile(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-darkContainer light:bg-slate-50 border border-white/10 text-sm font-bold text-lavender"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Cutoff Benchmark (Marks)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={cutoffMarks}
                  onChange={(e) => setCutoffMarks(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-darkContainer light:bg-slate-50 border border-white/10 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  AIR Rank (Optional)
                </label>
                <input
                  type="number"
                  value={rank || ''}
                  onChange={(e) => setRank(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="e.g. 1450"
                  className="w-full px-3 py-2 rounded-xl bg-darkContainer light:bg-slate-50 border border-white/10 text-sm font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* FULL LENGTH MODE: TAB 2 - SECTION BREAKDOWN */}
        {!isSectional && activeTab === 'sections' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Section-wise Performance Breakdown
                </h4>
                <p className="text-[11px] text-slate-400">
                  Individual scores auto-calculate accuracy, time, and summation.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={syncFromSections}
                  className="text-xs font-bold text-electric-blue hover:underline px-2.5 py-1 rounded-lg bg-electric-blue/10"
                >
                  ⚡ Sync to Total
                </button>
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="text-xs font-bold text-white bg-white/10 hover:bg-white/15 px-2.5 py-1 rounded-lg"
                >
                  + Add Section
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {sections.map((sec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-darkContainer/50 light:bg-slate-50 border border-white/5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white light:text-slate-900">
                      {sec.sectionName}
                    </span>
                    {sections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(idx)}
                        className="text-[11px] text-alert-red hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1">Total Qs</span>
                      <input
                        type="number"
                        value={sec.totalQuestions}
                        onChange={(e) => handleSectionChange(idx, 'totalQuestions', Number(e.target.value))}
                        className="w-full p-2 rounded-lg bg-darkSurface light:bg-white border border-white/10 font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1">Attempted</span>
                      <input
                        type="number"
                        value={sec.attempted}
                        onChange={(e) => handleSectionChange(idx, 'attempted', Number(e.target.value))}
                        className="w-full p-2 rounded-lg bg-darkSurface light:bg-white border border-white/10 font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-mint-dark font-semibold block mb-1">Correct</span>
                      <input
                        type="number"
                        value={sec.correct}
                        onChange={(e) => handleSectionChange(idx, 'correct', Number(e.target.value))}
                        className="w-full p-2 rounded-lg bg-darkSurface light:bg-white border border-mint/30 font-bold text-mint-dark"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-alert-red font-semibold block mb-1">Wrong</span>
                      <input
                        type="number"
                        value={sec.wrong}
                        onChange={(e) => handleSectionChange(idx, 'wrong', Number(e.target.value))}
                        className="w-full p-2 rounded-lg bg-darkSurface light:bg-white border border-alert-red/30 font-bold text-alert-red"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1">Time (min)</span>
                      <input
                        type="number"
                        value={sec.timeTakenMinutes}
                        onChange={(e) => handleSectionChange(idx, 'timeTakenMinutes', Number(e.target.value))}
                        className="w-full p-2 rounded-lg bg-darkSurface light:bg-white border border-white/10 font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/5">
                    <span>Score: <b className="text-electric-blue">{sec.score}</b> / {sec.maxMarks} M</span>
                    <span>Acc: <b className="text-mint-dark">{sec.attempted > 0 ? ((sec.correct / sec.attempted) * 100).toFixed(1) : 0}%</b></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FULL LENGTH MODE: TAB 3 - NOTES */}
        {!isSectional && activeTab === 'notes' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Self Reflection & Strategy Notes
              </label>
              <textarea
                rows={4}
                value={analysisNotes}
                onChange={(e) => setAnalysisNotes(e.target.value)}
                placeholder="Log question traps, silly mistakes, exam pressure notes, time distribution reflections..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-darkContainer light:bg-slate-50 border border-white/10 text-xs sm:text-sm focus:border-electric-blue outline-none resize-none"
              />
            </div>
          </div>
        )}

        {/* Modal Bottom Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 light:border-slate-200">
          <button
            type="button"
            onClick={() => {
              setIsAddModalOpen(false);
              setEditingMock(null);
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-electric-blue to-mint text-darkBg font-extrabold text-xs shadow-glow-blue hover:opacity-95 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{editingMock ? 'Update Mock Test' : isSectional ? 'Save Sectional Drill' : 'Save Full Mock'}</span>
          </button>
        </div>

      </form>
    </Modal>
  );
};
