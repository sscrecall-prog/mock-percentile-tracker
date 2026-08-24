import { MockTest } from '../types/mock';
import { getSupabase } from './supabaseClient';

// Helper to convert frontend MockTest object to DB Row
export const mockToDbRow = (mock: MockTest, userId: string) => {
  return {
    id: mock.id,
    user_id: userId,
    test_name: mock.testName,
    test_platform: mock.testPlatform,
    exam_type: mock.exam,
    mock_type: mock.mockType,
    tier: mock.tier,
    date: mock.date,
    total_questions: mock.totalQuestions,
    max_marks: mock.maxMarks,
    time_limit_minutes: mock.totalTimeMinutes,
    time_taken_minutes: mock.timeTakenMinutes,
    attempted: mock.attempted,
    correct: mock.correct,
    wrong: mock.wrong,
    unattempted: mock.unattempted,
    score: mock.score,
    negative_marks: mock.negativeMarks,
    accuracy: mock.accuracy,
    attempt_rate: mock.attemptRate,
    percentile: mock.percentile,
    rank: mock.rank || null,
    total_students: mock.totalStudents || null,
    cutoff_marks: mock.cutoffMarks,
    is_cleared_cutoff: mock.isClearedCutoff,
    subject_name: mock.subjectName || null,
    topic_focus: mock.topicFocus || null,
    chapter_name: mock.chapterName || null,
    difficulty: mock.difficulty || 'Moderate',
    sections: mock.sections || [],
    weak_areas: mock.weakAreas || [],
    analysis_notes: mock.analysisNotes || null,
    is_demo: Boolean(mock.isDemo),
    updated_at: new Date().toISOString()
  };
};

// Helper to convert DB Row to frontend MockTest object
export const dbRowToMock = (row: any): MockTest => {
  return {
    id: row.id,
    testName: row.test_name,
    testPlatform: row.test_platform,
    exam: row.exam_type || 'SSC CGL',
    mockType: row.mock_type || 'FULL_LENGTH',
    tier: row.tier || 'Tier 1',
    date: row.date,
    totalQuestions: Number(row.total_questions),
    maxMarks: Number(row.max_marks),
    totalTimeMinutes: Number(row.time_limit_minutes),
    timeTakenMinutes: Number(row.time_taken_minutes),
    attempted: Number(row.attempted),
    correct: Number(row.correct),
    wrong: Number(row.wrong),
    unattempted: Number(row.unattempted),
    score: Number(row.score),
    negativeMarks: Number(row.negative_marks),
    accuracy: Number(row.accuracy),
    attemptRate: Number(row.attempt_rate),
    percentile: Number(row.percentile),
    rank: row.rank ? Number(row.rank) : undefined,
    totalStudents: row.total_students ? Number(row.total_students) : undefined,
    cutoffMarks: Number(row.cutoff_marks),
    isClearedCutoff: Boolean(row.is_cleared_cutoff),
    subjectName: row.subject_name || undefined,
    topicFocus: row.topic_focus || undefined,
    chapterName: row.chapter_name || undefined,
    difficulty: row.difficulty || 'Moderate',
    sections: Array.isArray(row.sections) ? row.sections : [],
    weakAreas: Array.isArray(row.weak_areas) ? row.weak_areas : [],
    analysisNotes: row.analysis_notes || undefined,
    isDemo: Boolean(row.is_demo),
    createdAt: typeof row.created_at === 'string' ? new Date(row.created_at).getTime() : Date.now()
  };
};

export const CloudSyncService = {
  // 1. Fetch all mocks for authenticated user
  async fetchCloudMocks(userId: string): Promise<MockTest[]> {
    const supabase = getSupabase();
    if (!supabase || !userId) return [];

    try {
      const { data, error } = await supabase
        .from('mock_tests')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw error;
      return (data || []).map(dbRowToMock);
    } catch (err) {
      console.error('Error fetching mocks from cloud:', err);
      return [];
    }
  },

  // 2. Upload / Upsert a mock to cloud
  async upsertMock(mock: MockTest, userId: string): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase || !userId) return false;

    try {
      const row = mockToDbRow(mock, userId);
      const { error } = await supabase
        .from('mock_tests')
        .upsert(row, { onConflict: 'id' });

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error upserting mock to cloud:', err);
      return false;
    }
  },

  // 3. Batch upload multiple mocks (migration from local storage)
  async batchUploadMocks(mocks: MockTest[], userId: string): Promise<number> {
    const supabase = getSupabase();
    if (!supabase || !userId || mocks.length === 0) return 0;

    try {
      const rows = mocks.map(m => mockToDbRow(m, userId));
      const { error } = await supabase
        .from('mock_tests')
        .upsert(rows, { onConflict: 'id' });

      if (error) throw error;
      return mocks.length;
    } catch (err) {
      console.error('Error batch uploading mocks:', err);
      return 0;
    }
  },

  // 4. Delete mock from cloud
  async deleteMock(mockId: string, userId: string): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase || !userId) return false;

    try {
      const { error } = await supabase
        .from('mock_tests')
        .delete()
        .eq('id', mockId)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error deleting mock from cloud:', err);
      return false;
    }
  }
};
