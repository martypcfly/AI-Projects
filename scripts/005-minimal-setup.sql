-- Create tables for memory journal app
CREATE TABLE IF NOT EXISTS prompts (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS journal_entries (
  id SERIAL PRIMARY KEY,
  title TEXT,
  content TEXT,
  audio_url TEXT,
  audio_duration INTEGER,
  prompt_id INTEGER REFERENCES prompts(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert memory-focused prompts
INSERT INTO prompts (text, category) VALUES
('Tell me about your favorite childhood memory. What made it so special?', 'childhood'),
('Describe a person who has had a significant impact on your life. How did they influence you?', 'relationships'),
('What is your proudest achievement? How did you accomplish it?', 'achievements'),
('Share a memory of a family tradition or holiday celebration that was meaningful to you.', 'family'),
('Tell me about a place that holds special meaning for you. What memories do you have there?', 'places'),
('Describe your first job or a memorable work experience. What did you learn?', 'career'),
('What is a skill or hobby you enjoyed? How did you get started with it?', 'hobbies'),
('Tell me about a time when you helped someone or someone helped you.', 'kindness'),
('Describe a memorable trip or adventure you took. What made it unforgettable?', 'travel'),
('Share a memory of a pet or animal that was important to you.', 'pets'),
('Tell me about a teacher, mentor, or friend who made a difference in your life.', 'mentors'),
('What is a family recipe or meal that brings back good memories?', 'food'),
('Describe a challenge you overcame. How did you get through it?', 'challenges'),
('Tell me about a book, movie, or song that has stayed with you over the years.', 'culture'),
('Share a memory of celebrating a special milestone or achievement.', 'celebrations');

-- Create function to get random prompt
CREATE OR REPLACE FUNCTION get_random_prompt()
RETURNS TABLE(id INTEGER, text TEXT, category TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.text, p.category
  FROM prompts p
  ORDER BY RANDOM()
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;
