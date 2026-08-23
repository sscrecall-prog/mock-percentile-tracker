import { MockTest, SubjectDefinition, ChapterDefinition } from '../types/mock';
import { UserSettings, ImportSummary } from '../types/settings';
import { INITIAL_SAMPLE_MOCKS } from './sampleData';

const MOCKS_STORAGE_KEY = 'mocktracker_mocks_v1';
const SETTINGS_STORAGE_KEY = 'mocktracker_settings_v1';
const PLATFORMS_STORAGE_KEY = 'mocktracker_custom_platforms_v1';
const SUBJECTS_CHAPTERS_STORAGE_KEY = 'mocktracker_subjects_chapters_v1';

export const DEFAULT_PLATFORMS: string[] = [
  'Testbook',
  'Oliveboard',
  'PracticeMock',
  'Gradeup (BYJU\'S)',
  'Unacademy',
  'Careerwill',
  'RBE (Shubham Sir)',
  'Parcham Classes',
  'SuperCoaching',
  'Adda247',
  'Guidely',
  'Custom / Offline'
];

export const DEFAULT_SUBJECTS_AND_CHAPTERS: SubjectDefinition[] = [
  {
    id: 'sub-quant',
    name: 'Quantitative Aptitude',
    icon: '📐',
    color: '#10B981',
    chapters: [
      { id: 'ch-q-1', subject: 'Quantitative Aptitude', chapterName: 'Percentage & Fractional Values', targetAccuracy: 85, subtopics: ['Successive Discount', 'Income-Expenditure', 'Voting & Population'] },
      { id: 'ch-q-2', subject: 'Quantitative Aptitude', chapterName: 'Profit, Loss & Discount', targetAccuracy: 85, subtopics: ['Dishonest Dealer', 'Marked Price', 'Free Articles'] },
      { id: 'ch-q-3', subject: 'Quantitative Aptitude', chapterName: 'Simple & Compound Interest', targetAccuracy: 85, subtopics: ['Installments', 'CI-SI Difference', 'Compounded Half-Yearly'] },
      { id: 'ch-q-4', subject: 'Quantitative Aptitude', chapterName: 'Ratio, Proportion & Partnership', targetAccuracy: 85, subtopics: ['Coins Problem', 'Age Problems', 'Active Partner'] },
      { id: 'ch-q-5', subject: 'Quantitative Aptitude', chapterName: 'Time, Speed & Distance', targetAccuracy: 80, subtopics: ['Relative Speed', 'Trains & Platforms', 'Boats & Streams', 'Races'] },
      { id: 'ch-q-6', subject: 'Quantitative Aptitude', chapterName: 'Time & Work, Pipes & Cisterns', targetAccuracy: 85, subtopics: ['Efficiency Ratio', 'Alternate Days', 'Leakage Pipes'] },
      { id: 'ch-q-7', subject: 'Quantitative Aptitude', chapterName: 'Number System & Simplification', targetAccuracy: 90, subtopics: ['Unit Digit', 'Divisibility Rules', 'Remainder Theorem', 'BODMAS'] },
      { id: 'ch-q-8', subject: 'Quantitative Aptitude', chapterName: 'Algebra & Polynomials', targetAccuracy: 80, subtopics: ['Algebraic Identities', 'x + 1/x Form', 'Max/Min Value'] },
      { id: 'ch-q-9', subject: 'Quantitative Aptitude', chapterName: 'Geometry & Coordinate Geometry', targetAccuracy: 80, subtopics: ['Triangles & Centers', 'Circles & Tangents', 'Cyclic Quadrilateral'] },
      { id: 'ch-q-10', subject: 'Quantitative Aptitude', chapterName: 'Mensuration (2D & 3D)', targetAccuracy: 80, subtopics: ['Cylinder, Cone, Sphere', 'Prism & Pyramid', 'Cutting & Melting'] },
      { id: 'ch-q-11', subject: 'Quantitative Aptitude', chapterName: 'Trigonometry, Heights & Distances', targetAccuracy: 80, subtopics: ['Standard Angles', 'Maxima-Minima', 'Shadow & Elevation'] },
      { id: 'ch-q-12', subject: 'Quantitative Aptitude', chapterName: 'Data Interpretation (DI)', targetAccuracy: 90, subtopics: ['Bar & Line Charts', 'Pie Charts', 'Tabular DI'] },
    ]
  },
  {
    id: 'sub-reasoning',
    name: 'General Intelligence & Reasoning',
    icon: '🧠',
    color: '#F59E0B',
    chapters: [
      { id: 'ch-r-1', subject: 'General Intelligence & Reasoning', chapterName: 'Syllogism (Statements & Conclusions)', targetAccuracy: 90, subtopics: ['Only a few', 'Possibility Cases', 'Either-Or Cases'] },
      { id: 'ch-r-2', subject: 'General Intelligence & Reasoning', chapterName: 'Blood Relations', targetAccuracy: 90, subtopics: ['Coded Relations', 'Pointing to a Photograph', 'Family Tree'] },
      { id: 'ch-r-3', subject: 'General Intelligence & Reasoning', chapterName: 'Coding-Decoding', targetAccuracy: 90, subtopics: ['Letter Shift', 'Number Operations', 'Chinese Coding'] },
      { id: 'ch-r-4', subject: 'General Intelligence & Reasoning', chapterName: 'Direction & Distance Sense', targetAccuracy: 95, subtopics: ['Shadow Based', 'Turn Degrees', 'Shortest Pythagoras'] },
      { id: 'ch-r-5', subject: 'General Intelligence & Reasoning', chapterName: 'Analogy & Classification (Odd One Out)', targetAccuracy: 85, subtopics: ['Word Pair', 'Number Analogy', 'Letter Cluster'] },
      { id: 'ch-r-6', subject: 'General Intelligence & Reasoning', chapterName: 'Series Completion (Number & Letter)', targetAccuracy: 85, subtopics: ['Difference of Difference', 'Alternating Series', 'Alphabet Gap'] },
      { id: 'ch-r-7', subject: 'General Intelligence & Reasoning', chapterName: 'Order & Ranking, Sitting Arrangement', targetAccuracy: 85, subtopics: ['Linear Row', 'Circular Table', 'Interchanging Positions'] },
      { id: 'ch-r-8', subject: 'General Intelligence & Reasoning', chapterName: 'Non-Verbal & Visual Reasoning', targetAccuracy: 95, subtopics: ['Mirror & Water Image', 'Paper Folding & Cutting', 'Embedded Figure', 'Cube & Dice'] },
      { id: 'ch-r-9', subject: 'General Intelligence & Reasoning', chapterName: 'Mathematical Operators & Matrix', targetAccuracy: 95, subtopics: ['Sign Substitution', 'Number Matrix', 'Missing Character'] },
      { id: 'ch-r-10', subject: 'General Intelligence & Reasoning', chapterName: 'Critical Reasoning & Statement Assumptions', targetAccuracy: 80, subtopics: ['Course of Action', 'Cause & Effect', 'Strong & Weak Arguments'] },
    ]
  },
  {
    id: 'sub-english',
    name: 'English Comprehension',
    icon: '📖',
    color: '#A78BFA',
    chapters: [
      { id: 'ch-e-1', subject: 'English Comprehension', chapterName: 'Reading Comprehension (RC)', targetAccuracy: 85, subtopics: ['Central Theme', 'Tone of Author', 'Inference Based'] },
      { id: 'ch-e-2', subject: 'English Comprehension', chapterName: 'Cloze Test Passages', targetAccuracy: 85, subtopics: ['Grammar Fillers', 'Contextual Vocab', 'Collocations'] },
      { id: 'ch-e-3', subject: 'English Comprehension', chapterName: 'Spotting the Error (Grammar Rules)', targetAccuracy: 90, subtopics: ['Subject-Verb Agreement', 'Prepositions', 'Conditional Sentences', 'Tenses'] },
      { id: 'ch-e-4', subject: 'English Comprehension', chapterName: 'Sentence Improvement & Fill in the Blanks', targetAccuracy: 85, subtopics: ['Phrasal Verbs', 'Conjunctions', 'Parallelism'] },
      { id: 'ch-e-5', subject: 'English Comprehension', chapterName: 'Idioms & Phrases', targetAccuracy: 85, subtopics: ['High-Frequency Idioms', 'Action Idioms', 'Proverbs'] },
      { id: 'ch-e-6', subject: 'English Comprehension', chapterName: 'One Word Substitution (OWS)', targetAccuracy: 90, subtopics: ['Root Words (phobia, mania, cide)', 'Govt Types', 'Professions'] },
      { id: 'ch-e-7', subject: 'English Comprehension', chapterName: 'Synonyms & Antonyms', targetAccuracy: 80, subtopics: ['Contextual Vocabulary', 'Prefix/Suffix Clues'] },
      { id: 'ch-e-8', subject: 'English Comprehension', chapterName: 'Spelling Correction / Misspelt Words', targetAccuracy: 95, subtopics: ['Double Letters', 'Silent Letters', 'ei/ie Rules'] },
      { id: 'ch-e-9', subject: 'English Comprehension', chapterName: 'Active & Passive Voice', targetAccuracy: 95, subtopics: ['Imperative Sentences', 'Interrogative Voice', 'Modal Verbs'] },
      { id: 'ch-e-10', subject: 'English Comprehension', chapterName: 'Direct & Indirect Speech (Narration)', targetAccuracy: 95, subtopics: ['Tense Conversion Rules', 'Exclamatory Sentences', 'Universal Truths'] },
    ]
  },
  {
    id: 'sub-ga',
    name: 'General Awareness',
    icon: '🌍',
    color: '#38BDF8',
    chapters: [
      { id: 'ch-g-1', subject: 'General Awareness', chapterName: 'Indian Polity & Constitution', targetAccuracy: 85, subtopics: ['Articles & Schedules', 'Fundamental Rights', 'President & Parliament', 'Amendments'] },
      { id: 'ch-g-2', subject: 'General Awareness', chapterName: 'History (Modern, Medieval, Ancient)', targetAccuracy: 80, subtopics: ['Freedom Movement (1857-1947)', 'Mughals & Delhi Sultanate', 'Indus Valley & Mauryas'] },
      { id: 'ch-g-3', subject: 'General Awareness', chapterName: 'Geography (Indian & World)', targetAccuracy: 80, subtopics: ['Rivers & Dams', 'National Parks', 'Atmosphere & Solar System', 'Soils & Minerals'] },
      { id: 'ch-g-4', subject: 'General Awareness', chapterName: 'Indian Economy & Financial Schemes', targetAccuracy: 75, subtopics: ['Monetary Policy (RBI)', 'National Income (GDP)', 'Union Budget', 'Govt Welfare Schemes'] },
      { id: 'ch-g-5', subject: 'General Awareness', chapterName: 'General Science (Physics, Chem, Bio)', targetAccuracy: 80, subtopics: ['Human Anatomy & Diseases', 'Vitamins & Nutrition', 'Periodic Table & Acids', 'Optics & Mechanics'] },
      { id: 'ch-g-6', subject: 'General Awareness', chapterName: 'Static GK (Dance, Music, Books, Awards)', targetAccuracy: 75, subtopics: ['Classical & Folk Dances', 'Musical Instruments', 'Nobel & Bharat Ratna', 'Sports Terminology'] },
      { id: 'ch-g-7', subject: 'General Awareness', chapterName: 'Current Affairs & Govt Initiatives', targetAccuracy: 80, subtopics: ['Appointments & Summits', 'Military Exercises', 'Indices & Reports', 'Sports Tournaments'] },
    ]
  },
  {
    id: 'sub-computer',
    name: 'Computer Knowledge',
    icon: '💻',
    color: '#34D399',
    chapters: [
      { id: 'ch-c-1', subject: 'Computer Knowledge', chapterName: 'Computer Basics, Memory & CPU Architecture', targetAccuracy: 90, subtopics: ['RAM/ROM & Cache', 'Input/Output Devices', 'Generations & CPU Registers'] },
      { id: 'ch-c-2', subject: 'Computer Knowledge', chapterName: 'MS Office (Word, Excel & PowerPoint)', targetAccuracy: 90, subtopics: ['Excel Formulas & Functions', 'Word Layout & Formatting', 'PowerPoint Slide Shortcuts'] },
      { id: 'ch-c-3', subject: 'Computer Knowledge', chapterName: 'Networking, OSI Layers & Internet Protocols', targetAccuracy: 85, subtopics: ['TCP/IP, HTTP/HTTPS, FTP', 'LAN, WAN, Topologies', 'DNS & IP Addressing'] },
      { id: 'ch-c-4', subject: 'Computer Knowledge', chapterName: 'Cyber Security, Malware & Antivirus', targetAccuracy: 90, subtopics: ['Phishing & Ransomware', 'Firewall & Encryption', 'Trojan Horse & Worms'] },
      { id: 'ch-c-5', subject: 'Computer Knowledge', chapterName: 'Keyboard Shortcuts & File Extensions', targetAccuracy: 95, subtopics: ['Windows Key Shortcuts', 'Browser Shortcuts', 'File Format Extensions'] },
    ]
  }
];

export const DEFAULT_SETTINGS: UserSettings = {
  selectedExam: 'SSC CGL',
  targetPercentile: 98.0,
  targetScore: 165.0,
  theme: 'dark',
  enable3D: true,
  reducedMotion: false,
  defaultTimeLimitMinutes: 60,
  defaultNegativeMarkRatio: 0.25,
};

export const StorageService = {
  loadSubjectsWithChapters(): SubjectDefinition[] {
    try {
      const data = localStorage.getItem(SUBJECTS_CHAPTERS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(SUBJECTS_CHAPTERS_STORAGE_KEY, JSON.stringify(DEFAULT_SUBJECTS_AND_CHAPTERS));
        return DEFAULT_SUBJECTS_AND_CHAPTERS;
      }
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SUBJECTS_AND_CHAPTERS;
    } catch (err) {
      console.error('Failed to load subjects and chapters:', err);
      return DEFAULT_SUBJECTS_AND_CHAPTERS;
    }
  },

  saveSubjectsWithChapters(subjects: SubjectDefinition[]): void {
    try {
      localStorage.setItem(SUBJECTS_CHAPTERS_STORAGE_KEY, JSON.stringify(subjects));
    } catch (err) {
      console.error('Failed to save subjects and chapters:', err);
    }
  },

  loadCustomPlatforms(): string[] {
    try {
      const data = localStorage.getItem(PLATFORMS_STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('Failed to load custom platforms:', err);
      return [];
    }
  },

  saveCustomPlatforms(platforms: string[]): void {
    try {
      localStorage.setItem(PLATFORMS_STORAGE_KEY, JSON.stringify(platforms));
    } catch (err) {
      console.error('Failed to save custom platforms:', err);
    }
  },
  loadMocks(): MockTest[] {
    try {
      const data = localStorage.getItem(MOCKS_STORAGE_KEY);
      if (!data) {
        // Initialize with sample demo data
        localStorage.setItem(MOCKS_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_MOCKS));
        return INITIAL_SAMPLE_MOCKS;
      }
      return JSON.parse(data);
    } catch (err) {
      console.error('Failed to load mocks from storage:', err);
      return INITIAL_SAMPLE_MOCKS;
    }
  },

  saveMocks(mocks: MockTest[]): void {
    try {
      localStorage.setItem(MOCKS_STORAGE_KEY, JSON.stringify(mocks));
    } catch (err) {
      console.error('Failed to save mocks to storage:', err);
    }
  },

  loadSettings(): UserSettings {
    try {
      const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!data) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch (err) {
      console.error('Failed to load settings:', err);
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  },

  exportToJSON(mocks: MockTest[], settings: UserSettings): string {
    return JSON.stringify({
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings,
      mocks
    }, null, 2);
  },

  exportToCSV(mocks: MockTest[]): string {
    const headers = [
      'ID', 'Test Name', 'Exam', 'Tier', 'Mock Type', 'Platform', 'Date',
      'Score', 'Max Marks', 'Accuracy %', 'Attempt Rate %', 'Time (min)',
      'Percentile', 'Rank', 'Total Students', 'Cutoff Marks', 'Cleared Cutoff'
    ];

    const rows = mocks.map(m => [
      `"${m.id}"`,
      `"${m.testName.replace(/"/g, '""')}"`,
      `"${m.exam}"`,
      `"${m.tier}"`,
      `"${m.mockType}"`,
      `"${m.testPlatform}"`,
      `"${m.date}"`,
      m.score,
      m.maxMarks,
      m.accuracy,
      m.attemptRate,
      m.timeTakenMinutes,
      m.percentile,
      m.rank || '',
      m.totalStudents || '',
      m.cutoffMarks,
      m.isClearedCutoff ? 'Yes' : 'No'
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  },

  importFromJSON(jsonString: string): { summary: ImportSummary; mocks: MockTest[] } {
    const errors: string[] = [];
    let importedMocks: MockTest[] = [];

    try {
      const parsed = JSON.parse(jsonString);
      const rawList = Array.isArray(parsed) ? parsed : (parsed.mocks || []);

      if (!Array.isArray(rawList)) {
        throw new Error('Invalid JSON format: expected an array of mock tests.');
      }

      for (let i = 0; i < rawList.length; i++) {
        const item = rawList[i];
        if (!item.testName || typeof item.score !== 'number') {
          errors.push(`Item #${i + 1} skipped: missing test name or score.`);
          continue;
        }

        const validItem: MockTest = {
          id: item.id || `mock-${Date.now()}-${i}`,
          testName: item.testName,
          exam: item.exam || 'SSC CGL',
          tier: item.tier || 'Tier 1',
          mockType: item.mockType || 'FULL_LENGTH',
          testPlatform: item.testPlatform || 'Custom',
          date: item.date || new Date().toISOString().split('T')[0],
          createdAt: item.createdAt || Date.now(),
          totalQuestions: item.totalQuestions || 100,
          maxMarks: item.maxMarks || 200,
          totalTimeMinutes: item.totalTimeMinutes || 60,
          timeTakenMinutes: item.timeTakenMinutes || 60,
          attempted: item.attempted || 0,
          correct: item.correct || 0,
          wrong: item.wrong || 0,
          unattempted: item.unattempted ?? (item.totalQuestions - item.attempted),
          score: item.score,
          negativeMarks: item.negativeMarks || 0,
          accuracy: item.accuracy || (item.attempted > 0 ? (item.correct / item.attempted) * 100 : 0),
          attemptRate: item.attemptRate || (item.totalQuestions > 0 ? (item.attempted / item.totalQuestions) * 100 : 0),
          percentile: item.percentile || 0,
          rank: item.rank,
          totalStudents: item.totalStudents,
          cutoffMarks: item.cutoffMarks || 135,
          isClearedCutoff: item.score >= (item.cutoffMarks || 135),
          sections: Array.isArray(item.sections) ? item.sections : [],
          weakAreas: Array.isArray(item.weakAreas) ? item.weakAreas : [],
          analysisNotes: item.analysisNotes,
          isDemo: false
        };

        importedMocks.push(validItem);
      }
    } catch (e: any) {
      errors.push(`Failed to parse file: ${e.message}`);
    }

    return {
      summary: {
        totalFound: importedMocks.length + errors.length,
        importedCount: importedMocks.length,
        skippedCount: errors.length,
        errors
      },
      mocks: importedMocks
    };
  }
};
