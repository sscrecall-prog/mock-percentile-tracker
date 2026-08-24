-- =========================================================
-- MOCKTRACKER 3D PRO - SUPABASE DATABASE SCHEMA & RLS SETUP
-- =========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Mock Tests Table
CREATE TABLE IF NOT EXISTS public.mock_tests (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    test_name TEXT NOT NULL,
    test_platform TEXT NOT NULL,
    exam_type TEXT NOT NULL,
    mock_type TEXT NOT NULL DEFAULT 'FULL_LENGTH',
    tier TEXT NOT NULL DEFAULT 'TIER_1',
    date DATE NOT NULL,
    total_questions INTEGER NOT NULL DEFAULT 100,
    max_marks NUMERIC NOT NULL DEFAULT 200,
    time_limit_minutes INTEGER NOT NULL DEFAULT 60,
    time_taken_minutes INTEGER NOT NULL DEFAULT 0,
    attempted INTEGER NOT NULL DEFAULT 0,
    correct INTEGER NOT NULL DEFAULT 0,
    wrong INTEGER NOT NULL DEFAULT 0,
    unattempted INTEGER NOT NULL DEFAULT 0,
    score NUMERIC NOT NULL DEFAULT 0,
    negative_marks NUMERIC NOT NULL DEFAULT 0,
    accuracy NUMERIC NOT NULL DEFAULT 0,
    attempt_rate NUMERIC NOT NULL DEFAULT 0,
    percentile NUMERIC NOT NULL DEFAULT 0,
    rank INTEGER,
    total_students INTEGER,
    cutoff_marks NUMERIC NOT NULL DEFAULT 130,
    is_cleared_cutoff BOOLEAN NOT NULL DEFAULT FALSE,
    subject_name TEXT,
    topic_focus TEXT,
    chapter_name TEXT,
    difficulty TEXT DEFAULT 'Moderate',
    sections JSONB DEFAULT '[]'::jsonb,
    weak_areas JSONB DEFAULT '[]'::jsonb,
    analysis_notes TEXT,
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Custom Subjects & Chapters Table
CREATE TABLE IF NOT EXISTS public.user_syllabus (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subjects_and_chapters JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. User Preferences Table
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures each user can ONLY access and modify their OWN data
-- =========================================================

-- Enable RLS
ALTER TABLE public.mock_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_syllabus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Mock Tests Policies
CREATE POLICY "Users can view own mocks" ON public.mock_tests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mocks" ON public.mock_tests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mocks" ON public.mock_tests
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own mocks" ON public.mock_tests
    FOR DELETE USING (auth.uid() = user_id);

-- User Syllabus Policies
CREATE POLICY "Users can manage own syllabus" ON public.user_syllabus
    FOR ALL USING (auth.uid() = user_id);

-- User Preferences Policies
CREATE POLICY "Users can manage own preferences" ON public.user_preferences
    FOR ALL USING (auth.uid() = user_id);

-- =========================================================
-- REALTIME ENABLEMENT
-- Allows instant live sync across PC and Mobile via WebSockets
-- =========================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.mock_tests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_syllabus;
