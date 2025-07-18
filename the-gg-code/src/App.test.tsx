import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders The GG Code header', () => {
  render(<App />);
  const headerElement = screen.getByText(/The GG Code/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders race input form', () => {
  render(<App />);
  const countryLabel = screen.getByText(/Country/i);
  const venueLabel = screen.getByText(/Venue/i);
  const dateLabel = screen.getByText(/Date/i);
  const timeLabel = screen.getByText(/Time/i);
  
  expect(countryLabel).toBeInTheDocument();
  expect(venueLabel).toBeInTheDocument();
  expect(dateLabel).toBeInTheDocument();
  expect(timeLabel).toBeInTheDocument();
});

test('renders start analysis button', () => {
  render(<App />);
  const submitButton = screen.getByRole('button', { name: /Start Analysis/i });
  expect(submitButton).toBeInTheDocument();
});

test('renders race analysis placeholder', () => {
  render(<App />);
  const analysisText = screen.getByText(/Enter race details and click "Start Analysis"/i);
  expect(analysisText).toBeInTheDocument();
});
