import { ValidationErrors } from '../types';

export const validateTimeFormat = (time: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
  return timeRegex.test(time);
};

export const validateDateFormat = (date: string): boolean => {
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!dateRegex.test(date)) return false;
  
  const [, day, month, year] = date.match(dateRegex)!;
  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);
  
  if (monthNum < 1 || monthNum > 12) return false;
  if (dayNum < 1 || dayNum > 31) return false;
  if (yearNum < 2024 || yearNum > 2030) return false;
  
  return true;
};

export const validateForm = (country: string, venue: string, date: string, time: string): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  if (!country.trim()) {
    errors.country = 'Country is required';
  }
  
  if (!venue.trim()) {
    errors.venue = 'Venue is required';
  }
  
  if (!date.trim()) {
    errors.date = 'Date is required';
  } else if (!validateDateFormat(date)) {
    errors.date = 'Invalid date format. Use DD/MM/YYYY';
  }
  
  if (!time.trim()) {
    errors.time = 'Time is required';
  } else if (!validateTimeFormat(time)) {
    errors.time = 'Invalid time format. Use HH:MM';
  }
  
  return errors;
};