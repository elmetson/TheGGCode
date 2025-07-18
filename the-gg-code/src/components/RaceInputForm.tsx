import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RaceInput, ValidationErrors } from '../types';
import { COUNTRIES, VENUES } from '../utils/constants';
import { getUserTimezone, getCountryTimezone, getUserLocation, formatTimeWithTimezone, getTodayDateString } from '../utils/timezone';
import { validateForm } from '../utils/validation';
import { getRaceData, RaceData } from '../utils/apiClient';
import { saveRaceSearch, RaceSearch } from '../utils/supabaseClient';

interface RaceInputFormProps {
  onSubmit: (raceInput: RaceInput) => void;
  setRaceData: (data: RaceData[]) => void;
  setApiStatus: (status: { 
    health: string; 
    rateLimitRemaining: number | null; 
    rateLimitReset: number | null; 
    dataQuality: string 
  }) => void;
}

const RaceInputForm: React.FC<RaceInputFormProps> = ({ onSubmit, setRaceData, setApiStatus }) => {
  const [country, setCountry] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [userTimezone, setUserTimezone] = useState('');
  const [raceTimezone, setRaceTimezone] = useState('');
  const [timezoneNote, setTimezoneNote] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [countryFilter, setCountryFilter] = useState('');
  const [venueFilter, setVenueFilter] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showVenueDropdown, setShowVenueDropdown] = useState(false);

  const countryRef = useRef<HTMLDivElement>(null);
  const venueRef = useRef<HTMLDivElement>(null);

  // Initialize user location and timezone
  useEffect(() => {
    const initializeForm = async () => {
      const userTz = getUserTimezone();
      setUserTimezone(userTz);
      
      const userLocation = await getUserLocation();
      const defaultCountry = COUNTRIES.find(c => c.code === userLocation);
      if (defaultCountry) {
        setCountry(defaultCountry.code);
        setCountryFilter(defaultCountry.name);
        const raceTz = getCountryTimezone(defaultCountry.code);
        setRaceTimezone(raceTz);
      }
      
      setDate(getTodayDateString());
    };
    
    initializeForm();
  }, []);

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
      if (venueRef.current && !venueRef.current.contains(event.target as Node)) {
        setShowVenueDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update timezone note when country or time changes
  useEffect(() => {
    if (country && time && userTimezone) {
      const raceTz = getCountryTimezone(country);
      setRaceTimezone(raceTz);
      const note = formatTimeWithTimezone(time, userTimezone, raceTz);
      setTimezoneNote(note);
    }
  }, [country, time, userTimezone]);

  const filteredCountries = COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(countryFilter.toLowerCase())
  );

  const filteredVenues = VENUES.filter(v => 
    v.toLowerCase().includes(venueFilter.toLowerCase())
  );

  const handleCountrySelect = (selectedCountry: typeof COUNTRIES[0]) => {
    setCountry(selectedCountry.code);
    setCountryFilter(selectedCountry.name);
    setShowCountryDropdown(false);
    setErrors(prev => ({ ...prev, country: undefined }));
    
    // Update race timezone when country changes
    const raceTz = getCountryTimezone(selectedCountry.code);
    setRaceTimezone(raceTz);
  };

  const handleVenueSelect = (selectedVenue: string) => {
    setVenue(selectedVenue);
    setVenueFilter(selectedVenue);
    setShowVenueDropdown(false);
    setErrors(prev => ({ ...prev, venue: undefined }));
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formErrors = validateForm(country, venue, date, time);
    setErrors(formErrors);
    
    if (Object.keys(formErrors).length > 0) {
      return;
    }

    setLoading(true);
    setError(null);
    
    console.log('Starting race analysis...');
    console.log('Form data:', { country, venue, date, time, userTimezone, raceTimezone });

    const raceInput = { country, venue, date, time };
    onSubmit(raceInput);

    try {
      // Prepare search input
      const searchInput = {
        country,
        venue,
        date,
        time,
        user_timezone: userTimezone,
        race_timezone: raceTimezone
      };

      // Get race data from APIs
      const { raceData, searchResponse } = await getRaceData(searchInput);
      
      console.log(`Successfully retrieved ${raceData.length} horses`);
      
      // Update UI with race data
      setRaceData(raceData);
      
      // Update API status
      const apiStatus = {
        health: searchResponse.status === 200 ? 'Connected' : 'Error',
        rateLimitRemaining: searchResponse.headers['x-ratelimit-remaining'] 
          ? Number(searchResponse.headers['x-ratelimit-remaining']) 
          : null,
        rateLimitReset: searchResponse.headers['x-ratelimit-reset'] 
          ? Number(searchResponse.headers['x-ratelimit-reset']) 
          : null,
        dataQuality: raceData.length >= 5 ? 'High' : raceData.length >= 3 ? 'Medium' : 'Low'
      };
      setApiStatus(apiStatus);

      // Prepare data for Supabase
      const raceSearchData: RaceSearch = {
        user_id: null, // Single user for Phase 2
        country,
        venue,
        date,
        time,
        user_timezone: userTimezone,
        race_timezone: raceTimezone,
        search_query: `horse racing ${venue} ${date} race card runners odds`,
        api_response: searchResponse.data,
        llm_input: JSON.stringify({
          system: 'Extract horse racing data from web search results',
          user: `Race: ${venue}, ${date}, ${time} (${country})`
        }),
        llm_output: raceData,
        api_status: searchResponse.status.toString(),
        rate_limit_remaining: apiStatus.rateLimitRemaining,
        rate_limit_reset: apiStatus.rateLimitReset,
        data_quality: apiStatus.dataQuality,
        error_message: null,
        llm_brave_config: {
          llm_model: 'meta-llama/llama-3.3-70b-instruct:free',
          brave_endpoint: 'web',
          prompt_version: '2.0'
        },
        timestamp: new Date().toISOString()
      };

      // Save to Supabase (non-blocking)
      await saveRaceSearch(raceSearchData);

    } catch (apiError: any) {
      console.error('API Error:', apiError.message);
      setError(apiError.message);
      
      // Update API status to show error
      setApiStatus({
        health: 'Error',
        rateLimitRemaining: null,
        rateLimitReset: null,
        dataQuality: 'N/A'
      });

      // Save error to Supabase (non-blocking)
      try {
        const errorRaceSearchData: RaceSearch = {
          user_id: null,
          country,
          venue,
          date,
          time,
          user_timezone: userTimezone,
          race_timezone: raceTimezone,
          search_query: `horse racing ${venue} ${date} race card runners odds`,
          api_response: null,
          llm_input: null,
          llm_output: null,
          api_status: 'Error',
          rate_limit_remaining: null,
          rate_limit_reset: null,
          data_quality: 'N/A',
          error_message: apiError.message,
          llm_brave_config: {
            llm_model: 'meta-llama/llama-3.3-70b-instruct:free',
            brave_endpoint: 'web',
            prompt_version: '2.0'
          },
          timestamp: new Date().toISOString()
        };
        
        await saveRaceSearch(errorRaceSearchData);
      } catch (supabaseError) {
        console.error('Failed to save error to Supabase:', supabaseError);
      }
    } finally {
      setLoading(false);
    }
  }, [country, venue, date, time, userTimezone, raceTimezone, onSubmit, setRaceData, setApiStatus]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Race Details</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Country Input */}
        <div className="relative" ref={countryRef}>
          <label className="block text-sm font-medium mb-1">Country</label>
          <input
            type="text"
            value={countryFilter}
            onChange={(e) => {
              setCountryFilter(e.target.value);
              setShowCountryDropdown(true);
            }}
            onFocus={() => setShowCountryDropdown(true)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Select country..."
            disabled={loading}
          />
          {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
          
          {showCountryDropdown && filteredCountries.length > 0 && !loading && (
            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto">
              {filteredCountries.map((c) => (
                <div
                  key={c.code}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleCountrySelect(c)}
                >
                  {c.name} ({c.code})
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Venue Input */}
        <div className="relative" ref={venueRef}>
          <label className="block text-sm font-medium mb-1">Venue</label>
          <input
            type="text"
            value={venueFilter}
            onChange={(e) => {
              setVenueFilter(e.target.value);
              setVenue(e.target.value);
              setShowVenueDropdown(true);
            }}
            onFocus={() => setShowVenueDropdown(true)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter venue..."
            disabled={loading}
          />
          {errors.venue && <p className="text-red-500 text-sm mt-1">{errors.venue}</p>}
          
          {showVenueDropdown && filteredVenues.length > 0 && venueFilter && !loading && (
            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto">
              {filteredVenues.map((v) => (
                <div
                  key={v}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleVenueSelect(v)}
                >
                  {v}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Date Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Date (DD/MM/YYYY)</label>
          <input
            type="text"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setErrors(prev => ({ ...prev, date: undefined }));
            }}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="19/07/2025"
            disabled={loading}
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
        </div>

        {/* Time Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Time (HH:MM)</label>
          <input
            type="text"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
              setErrors(prev => ({ ...prev, time: undefined }));
            }}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="14:30"
            disabled={loading}
          />
          {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
          {timezoneNote && (
            <p className="text-sm text-gray-600 mt-1">{timezoneNote}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            loading 
              ? 'bg-gray-400 text-white cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {loading ? 'Analyzing Race...' : 'Start Analysis'}
        </button>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-red-600 text-sm">{error}</p>
            <p className="text-xs text-gray-500 mt-1">
              Check console for detailed error information.
            </p>
          </div>
        )}

        {/* Loading Status */}
        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-blue-600 text-sm">
              🔍 Searching for race data...
            </p>
            <p className="text-xs text-gray-500 mt-1">
              This may take 10-30 seconds depending on data availability.
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default RaceInputForm;