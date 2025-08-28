-- Add user_id column to journal_entries table
ALTER TABLE journal_entries ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Create index for better performance
CREATE INDEX idx_journal_entries_user_id ON journal_entries(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own entries
CREATE POLICY "Users can only see their own journal entries" ON journal_entries
    FOR ALL USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own entries
CREATE POLICY "Users can insert their own journal entries" ON journal_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own entries
CREATE POLICY "Users can update their own journal entries" ON journal_entries
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own entries
CREATE POLICY "Users can delete their own journal entries" ON journal_entries
    FOR DELETE USING (auth.uid() = user_id);
