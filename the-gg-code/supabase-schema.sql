-- The GG Code - Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor to create the required table

-- Create race_searches table
CREATE TABLE IF NOT EXISTS race_searches (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT,
    country TEXT NOT NULL,
    venue TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    user_timezone TEXT NOT NULL,
    race_timezone TEXT NOT NULL,
    search_query TEXT NOT NULL,
    api_response JSONB,
    llm_input TEXT,
    llm_output JSONB,
    api_status TEXT NOT NULL,
    rate_limit_remaining INTEGER,
    rate_limit_reset INTEGER,
    data_quality TEXT NOT NULL,
    error_message TEXT,
    llm_brave_config JSONB NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_race_searches_timestamp ON race_searches(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_race_searches_country ON race_searches(country);
CREATE INDEX IF NOT EXISTS idx_race_searches_venue ON race_searches(venue);
CREATE INDEX IF NOT EXISTS idx_race_searches_date ON race_searches(date);
CREATE INDEX IF NOT EXISTS idx_race_searches_api_status ON race_searches(api_status);
CREATE INDEX IF NOT EXISTS idx_race_searches_data_quality ON race_searches(data_quality);

-- Enable Row Level Security (RLS)
ALTER TABLE race_searches ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now (modify as needed)
CREATE POLICY "Enable all operations for race_searches" ON race_searches
    FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Add comments for documentation
COMMENT ON TABLE race_searches IS 'Stores all race search requests and responses from The GG Code application';
COMMENT ON COLUMN race_searches.id IS 'Auto-incrementing primary key';
COMMENT ON COLUMN race_searches.user_id IS 'User identifier (nullable for single user in Phase 2)';
COMMENT ON COLUMN race_searches.country IS 'Country code for the race (e.g., US, UK, AU)';
COMMENT ON COLUMN race_searches.venue IS 'Race venue name (e.g., Ascot, Churchill Downs)';
COMMENT ON COLUMN race_searches.date IS 'Race date in DD/MM/YYYY format';
COMMENT ON COLUMN race_searches.time IS 'Race time in HH:MM format (user local time)';
COMMENT ON COLUMN race_searches.user_timezone IS 'User timezone (e.g., Europe/London)';
COMMENT ON COLUMN race_searches.race_timezone IS 'Race venue timezone (e.g., America/New_York)';
COMMENT ON COLUMN race_searches.search_query IS 'Search query sent to Brave Search API';
COMMENT ON COLUMN race_searches.api_response IS 'Raw JSON response from Brave Search API';
COMMENT ON COLUMN race_searches.llm_input IS 'Input prompt sent to Llama-3.3-70B-Instruct';
COMMENT ON COLUMN race_searches.llm_output IS 'Structured JSON response from LLM';
COMMENT ON COLUMN race_searches.api_status IS 'HTTP status or error indicator';
COMMENT ON COLUMN race_searches.rate_limit_remaining IS 'Brave API rate limit remaining calls';
COMMENT ON COLUMN race_searches.rate_limit_reset IS 'Brave API rate limit reset timestamp';
COMMENT ON COLUMN race_searches.data_quality IS 'Assessment of retrieved data quality (High/Medium/Low/N/A)';
COMMENT ON COLUMN race_searches.error_message IS 'Error details if search failed';
COMMENT ON COLUMN race_searches.llm_brave_config IS 'JSON config object storing LLM and API settings';
COMMENT ON COLUMN race_searches.timestamp IS 'Search execution timestamp';

-- Example query to view recent searches
-- SELECT 
--     id,
--     country,
--     venue,
--     date,
--     time,
--     api_status,
--     data_quality,
--     ARRAY_LENGTH(CASE WHEN llm_output ? 'horses' THEN llm_output->'horses' ELSE llm_output END, 1) as horse_count,
--     timestamp
-- FROM race_searches 
-- ORDER BY timestamp DESC 
-- LIMIT 10;