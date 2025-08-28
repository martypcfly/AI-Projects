-- Adding memory-focused prompts to replace generic ones
-- Clear existing prompts and add memory-focused ones
DELETE FROM prompts;

INSERT INTO prompts (prompt_text, category) VALUES
-- Childhood and Family Memories
('Tell me about a childhood memory that still makes you smile.', 'childhood'),
('Describe your childhood home. What room was your favorite?', 'childhood'),
('What was your favorite game or activity as a child?', 'childhood'),
('Tell me about your parents or grandparents. What do you remember most about them?', 'family'),
('Describe your favorite family tradition or holiday memory.', 'family'),
('What was the most meaningful gift you ever received or gave?', 'gifts'),
('What family recipe or meal brings back special memories?', 'food'),

-- Relationships and Love
('Describe your wedding day or how you met your spouse/partner.', 'celebrations'),
('Tell me about a friendship that has been important in your life.', 'relationships'),
('Describe someone who made a lasting impact on your life.', 'influences'),
('What was the best advice someone ever gave you? Who gave it to you?', 'wisdom'),

-- Career and Achievements
('What was your first job like? What do you remember most about it?', 'career'),
('Tell me about a time when you felt really proud of yourself.', 'achievements'),
('Describe a skill or talent you developed over the years.', 'achievements'),
('What was your favorite subject in school and why?', 'education'),
('Tell me about a teacher or mentor who influenced your life.', 'influences'),

-- Life Experiences and Adventures
('Describe a vacation or trip that created lasting memories.', 'travel'),
('Tell me about a place from your past that holds special meaning.', 'places'),
('What was the most adventurous thing you ever did?', 'adventures'),
('Describe a time when you tried something completely new.', 'adventures'),

-- Overcoming Challenges
('Tell me about a time when you overcame a challenge or difficulty.', 'resilience'),
('Describe a moment when you helped someone in need.', 'kindness'),
('What was a difficult decision you had to make, and how did it turn out?', 'decisions'),

-- Celebrations and Milestones
('Tell me about the birth of your children or a special family milestone.', 'celebrations'),
('Describe your graduation day or another important achievement.', 'achievements'),
('What was the happiest day of your life?', 'celebrations'),

-- Hobbies and Interests
('Tell me about a hobby or interest that brought you joy.', 'hobbies'),
('Describe your favorite book, movie, or song and why it was special.', 'culture'),
('What was your favorite way to spend a weekend?', 'leisure'),

-- Wisdom and Reflection
('What would you tell your younger self if you could?', 'wisdom'),
('Describe a lesson life taught you that you''ll never forget.', 'wisdom'),
('What are you most grateful for when you look back on your life?', 'gratitude');
