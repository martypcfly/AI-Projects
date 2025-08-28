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
