import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RaceInput, ValidationErrors } from '../types';
import { COUNTRIES, VENUES } from '../utils/constants';
import { getUserTimezone, getCountryTimezone, getUserLocation, formatTimeWithTimezone, getTodayDateString } from '../utils/timezone';
import { validateForm } from '../utils/validation';

interface RaceInputFormProps {
  onSubmit: (raceInput: RaceInput) => void;
}

const RaceInputForm: React.FC<RaceInputFormProps> = ({ onSubmit }) => {
  const [country, setCountry] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [userTimezone, setUserTimezone] = useState('');
  const [raceTimezone, setRaceTimezone] = useState('');
  const [timezoneNote, setTimezoneNote] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  
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
  };

  const handleVenueSelect = (selectedVenue: string) => {
    setVenue(selectedVenue);
    setVenueFilter(selectedVenue);
    setShowVenueDropdown(false);
    setErrors(prev => ({ ...prev, venue: undefined }));
  };

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    const formErrors = validateForm(country, venue, date, time);
    setErrors(formErrors);
    
    if (Object.keys(formErrors).length === 0) {
      console.log('Submit button clicked - Race Input:', { country, venue, date, time });
      console.log('User timezone:', userTimezone);
      console.log('Race timezone:', raceTimezone);
      console.log('No API connected - this is Phase 1 UI only');
      
      onSubmit({ country, venue, date, time });
    }
  }, [country, venue, date, time, userTimezone, raceTimezone, onSubmit]);

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
          />
          {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
          
          {showCountryDropdown && filteredCountries.length > 0 && (
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
          />
          {errors.venue && <p className="text-red-500 text-sm mt-1">{errors.venue}</p>}
          
          {showVenueDropdown && filteredVenues.length > 0 && venueFilter && (
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
          />
          {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
          {timezoneNote && (
            <p className="text-sm text-gray-600 mt-1">{timezoneNote}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Start Analysis
        </button>
      </form>
    </div>
  );
};

export default RaceInputForm;