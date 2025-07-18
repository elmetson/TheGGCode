// src/utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL!;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export interface RaceSearch {
  user_id: string | null;
  country: string;
  venue: string;
  date: string;
  time: string;
  user_timezone: string;
  race_timezone: string;
  search_query: string;
  api_response: any | null;
  llm_input: string | null;
  llm_output: any | null;
  api_status: string;
  rate_limit_remaining: number | null;
  rate_limit_reset: number | null;
  data_quality: string;
  error_message: string | null;
  llm_brave_config: { 
    llm_model: string; 
    brave_endpoint: string; 
    prompt_version: string;
  };
  timestamp: string;
}

export const saveRaceSearch = async (data: RaceSearch): Promise<void> => {
  try {
    console.log('Supabase: Saving race search data...');
    
    const { error } = await supabase
      .from('race_searches')
      .insert([data]);
    
    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }
    
    console.log('Supabase: Race search saved successfully');
  } catch (error: any) {
    console.error('Supabase error:', error.message);
    // Don't throw here to prevent UI errors - log and continue
  }
};

export const getRaceSearchHistory = async (): Promise<RaceSearch[]> => {
  try {
    const { data, error } = await supabase
      .from('race_searches')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50);
    
    if (error) {
      console.error('Supabase select error:', error);
      throw error;
    }
    
    return data || [];
  } catch (error: any) {
    console.error('Supabase fetch error:', error.message);
    return [];
  }
};

// Helper function to check Supabase connection
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('race_searches')
      .select('id')
      .limit(1);
    
    return !error;
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return false;
  }
};