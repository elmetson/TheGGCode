import moment from 'moment-timezone';
import { COUNTRIES } from './constants';

export const getUserTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.log('Error detecting timezone, falling back to UTC:', error);
    return 'UTC';
  }
};

export const getCountryTimezone = (countryCode: string): string => {
  const country = COUNTRIES.find(c => c.code === countryCode);
  return country?.timezone || 'UTC';
};

export const getUserLocation = (): Promise<string> => {
  return new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // For simplicity, we'll just default to US for now
          // In a real app, you'd use a geolocation service to convert coords to country
          resolve('US');
        },
        (error) => {
          console.log('Geolocation error, defaulting to US:', error);
          resolve('US');
        }
      );
    } else {
      resolve('US');
    }
  });
};

export const formatTimeWithTimezone = (time: string, userTz: string, raceTz: string): string => {
  if (userTz === raceTz) {
    return `Race time: ${time} (${moment.tz(raceTz).format('z')})`;
  }
  
  const userTzName = moment.tz(userTz).format('z');
  const raceTzName = moment.tz(raceTz).format('z');
  
  return `Race time in your local time (${userTzName}). Converted to ${raceTzName} for race venue.`;
};

export const getTodayDateString = (): string => {
  return moment().format('DD/MM/YYYY');
};