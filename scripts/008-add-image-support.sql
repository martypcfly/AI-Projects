-- Add image support to journal entries
ALTER TABLE journal_entries ADD COLUMN image_url TEXT;

-- Add comment for clarity
COMMENT ON COLUMN journal_entries.image_url IS 'URL to uploaded image associated with the journal entry';
