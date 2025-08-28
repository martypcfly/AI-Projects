-- Complete setup script for memory journal app
-- This combines table creation, sample data, and functions

-- Create tables for the memory journal app

-- Table for storing daily journal prompts
CREATE TABLE IF NOT EXISTS prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_text TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for storing journal entries
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_id UUID REFERENCES prompts(id),
  title VARCHAR(255),
  content TEXT,
  audio_url TEXT, -- URL to audio file in blob storage
  audio_duration INTEGER, -- Duration in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some default prompts for memory journaling
INSERT INTO prompts (prompt_text, category) VALUES
  ('What is your favorite memory from this week?', 'recent'),
  ('Describe a person who has been important in your life.', 'relationships'),
  ('What was your favorite meal today and who did you share it with?', 'daily'),
  ('Tell me about a place that makes you feel peaceful.', 'places'),
  ('What made you smile today?', 'emotions'),
  ('Describe your morning routine.', 'daily'),
  ('What is something you are grateful for right now?', 'gratitude'),
  ('Tell me about a hobby or activity you enjoy.', 'interests'),
  ('What was the weather like today and how did it make you feel?', 'daily'),
  ('Describe a family tradition that is meaningful to you.', 'family'),
  ('What is your favorite season and why?', 'preferences'),
  ('Tell me about a song that brings back good memories.', 'memories'),
  ('What did you learn something new about recently?', 'learning'),
  ('Describe your ideal way to spend a quiet afternoon.', 'preferences'),
  ('What is something kind someone did for you recently?', 'relationships');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON journal_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_category ON prompts(category);

-- Create a function to get a random prompt
CREATE OR REPLACE FUNCTION get_random_prompt()
RETURNS TABLE(id UUID, prompt_text TEXT, category VARCHAR(50))
LANGUAGE sql
AS $$
  SELECT p.id, p.prompt_text, p.category
  FROM prompts p
  ORDER BY RANDOM()
  LIMIT 1;
$$;
