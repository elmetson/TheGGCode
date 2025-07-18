// src/utils/apiClient.ts
import axios, { AxiosResponse } from 'axios';
import moment from 'moment-timezone';

interface BraveSearchResponse {
  query: string;
  web?: { 
    results: Array<{ 
      title: string; 
      url: string; 
      description: string; 
      extra_snippets?: string[]; 
      age?: string;
    }> 
  };
  news?: { 
    results: Array<{ 
      title: string; 
      url: string; 
      description: string; 
      extra_snippets?: string[]; 
      age?: string;
    }> 
  };
}

export interface RaceData {
  horse_name: string;
  odds: string;
  runner_number: string | null;
  jockey: string | null;
  trainer: string | null;
  owner: string | null;
  confidence_score: number;
  track_suitability: number;
  tipster_influence: string;
  price_analysis: number;
}

const BRAVE_API_KEY = process.env.REACT_APP_BRAVE_API_KEY!;
const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY!;
const BRAVE_API_URL = 'https://api.search.brave.com/res/v1/web/search';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Brave Search API Client
export const braveSearch = async (
  query: string,
  country: string,
  freshness: string = 'pm',
  count: number = 20
): Promise<AxiosResponse<BraveSearchResponse>> => {
  try {
    console.log(`Brave Search: Searching for "${query}" in ${country}`);
    
    const response = await axios.get<BraveSearchResponse>(BRAVE_API_URL, {
      headers: {
        'X-Subscription-Token': BRAVE_API_KEY,
        'Accept': 'application/json',
      },
      params: {
        q: query,
        country: country.toLowerCase(),
        search_lang: 'en',
        freshness,
        count,
        result_filter: 'web',
      },
    });
    
    console.log(`Brave Search: Found ${response.data.web?.results?.length || 0} results`);
    return response;
  } catch (error: any) {
    console.error('Brave Search API error:', error.response?.data || error.message);
    throw new Error(`Brave Search API error: ${error.response?.status || error.message}`);
  }
};

// OpenRouter API Client with Llama-3.3-70B-Instruct:free
export const callLlamaInstruct = async (
  userInput: { 
    country: string; 
    venue: string; 
    date: string; 
    time: string; 
    user_timezone: string; 
    race_timezone: string 
  },
  searchResults: any[]
): Promise<RaceData[]> => {
  const { country, venue, date, time, user_timezone, race_timezone } = userInput;

  // Convert user time to race timezone
  const userDateTime = moment.tz(`${date} ${time}`, 'DD/MM/YYYY HH:mm', user_timezone);
  const raceDateTime = userDateTime.clone().tz(race_timezone);

  // System prompt for Llama Instruct
  const systemPrompt = `You are an AI assistant specialized in extracting horse racing data from web search results.
Given search results about a horse race, extract and return a JSON array of runners with the following format:

[
  {
    "horse_name": "string",
    "odds": "string (e.g., '3/1', '5/2', 'Evens')",
    "runner_number": "string or null",
    "jockey": "string or null",
    "trainer": "string or null", 
    "owner": "string or null",
    "confidence_score": 75,
    "track_suitability": 70,
    "tipster_influence": "Strong/Moderate/Weak/N/A",
    "price_analysis": 7
  }
]

Requirements:
- Extract at least horse names and odds if available
- Include runner number, jockey, trainer, owner when found
- For missing data, use null (not "N/A" string)
- Confidence scores should range 50-90
- Track suitability should range 45-85
- Price analysis should range 1-10
- Return valid JSON only, no additional text
- If no clear race data found, return empty array []`;

  const userPrompt = `Race Details:
- Country: ${country}
- Venue: ${venue}
- Date: ${date}
- Time: ${time}
- Race DateTime: ${raceDateTime.format('YYYY-MM-DD HH:mm')} (${race_timezone})

Search Results to analyze:
${JSON.stringify(searchResults.slice(0, 10), null, 2)}

Extract the horse racing data and return as JSON array.`;

  try {
    console.log('LLM: Calling Llama-3.3-70B-Instruct to parse search results');
    
    const llmResponse = await axios.post(OPENROUTER_API_URL, {
      model: 'meta-llama/llama-3.3-70b-instruct:free',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 2000,
      temperature: 0.3,
      top_p: 0.9,
    }, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'The GG Code - Horse Racing Analysis'
      },
    });

    const content = llmResponse.data.choices[0]?.message?.content;
    console.log('LLM Response:', content);
    
    if (!content) {
      throw new Error('No response from LLM');
    }

    // Try to extract JSON from the response
    let raceData: RaceData[];
    try {
      // Look for JSON array in the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        raceData = JSON.parse(jsonMatch[0]);
      } else {
        raceData = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Failed to parse LLM response as JSON:', parseError);
      throw new Error('Invalid JSON response from LLM');
    }

    // Validate and sanitize the data
    if (!Array.isArray(raceData)) {
      throw new Error('LLM response is not an array');
    }

    // Filter and validate each race entry
    const validatedData = raceData
      .filter(horse => horse.horse_name && typeof horse.horse_name === 'string')
      .map(horse => ({
        horse_name: horse.horse_name,
        odds: horse.odds || 'N/A',
        runner_number: horse.runner_number || null,
        jockey: horse.jockey || null,
        trainer: horse.trainer || null,
        owner: horse.owner || null,
        confidence_score: Math.min(90, Math.max(50, horse.confidence_score || 70)),
        track_suitability: Math.min(85, Math.max(45, horse.track_suitability || 65)),
        tipster_influence: horse.tipster_influence || 'N/A',
        price_analysis: Math.min(10, Math.max(1, horse.price_analysis || 5))
      }));

    console.log(`LLM: Extracted ${validatedData.length} valid horses`);
    return validatedData;

  } catch (error: any) {
    console.error('LLM API error:', error.response?.data || error.message);
    throw new Error(`LLM API error: ${error.response?.status || error.message}`);
  }
};

// Main function to get race data
export const getRaceData = async (
  userInput: { 
    country: string; 
    venue: string; 
    date: string; 
    time: string; 
    user_timezone: string; 
    race_timezone: string 
  }
): Promise<{ raceData: RaceData[], searchResponse: AxiosResponse<BraveSearchResponse> }> => {
  const { country, venue, date, time, race_timezone } = userInput;
  
  // Convert date for search query
  const userDateTime = moment.tz(`${date} ${time}`, 'DD/MM/YYYY HH:mm', userInput.user_timezone);
  const raceDateTime = userDateTime.clone().tz(race_timezone);
  const searchDate = raceDateTime.format('YYYY-MM-DD');
  
  // Step 1: Broad search
  let query = `horse racing ${venue} ${searchDate} race card runners odds`;
  console.log(`Starting race data search with query: ${query}`);
  
  let response = await braveSearch(query, country);
  let results = response.data.web?.results || [];

  // Step 2: Filter for trusted racing sources
  const trustedSources = ['racingpost.co.uk', 'timeform.com', 'racing.com', 'attheraces.com', 'sporting.life'];
  let filteredResults = results.filter(result =>
    trustedSources.some(source => result.url.includes(source))
  );

  // Step 3: Retry with more specific query if insufficient results
  if (filteredResults.length < 3) {
    console.log('Insufficient results from trusted sources, trying refined search...');
    const refinedQuery = `"${venue}" horse racing ${searchDate} runners jockeys odds site:racingpost.co.uk OR site:timeform.com`;
    response = await braveSearch(refinedQuery, country);
    filteredResults = response.data.web?.results || [];
  }

  // Step 4: Fallback to general results if still insufficient
  if (filteredResults.length < 2) {
    console.log('Using general search results as fallback...');
    filteredResults = results.slice(0, 10);
  }

  // Step 5: Call LLM to parse results
  const raceData = await callLlamaInstruct(userInput, filteredResults);
  
  return { raceData, searchResponse: response };
};