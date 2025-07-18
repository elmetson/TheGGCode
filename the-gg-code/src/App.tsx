import React, { useState } from 'react';
import './App.css';
import RaceInputForm from './components/RaceInputForm';
import RaceCard from './components/RaceCard';
import DeveloperPanel from './components/DeveloperPanel';
import { RaceInput, RaceCard as RaceCardType, DeveloperIndicators } from './types';
import { createDummyRaceCard } from './utils/dummyData';

function App() {
  const [raceCard, setRaceCard] = useState<RaceCardType | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Developer indicators with placeholder values as specified
  const devIndicators: DeveloperIndicators = {
    apiHealth: 'Not Connected',
    rateLimitRemaining: 'N/A',
    rateLimitReset: 'N/A',
    dataQuality: 'N/A'
  };

  const handleRaceSubmit = (raceInput: RaceInput) => {
    console.log('App - Processing race input:', raceInput);
    
    // Simulate loading dummy data
    setTimeout(() => {
      const dummyCard = createDummyRaceCard();
      setRaceCard(dummyCard);
      setHasSubmitted(true);
      console.log('App - Dummy race card loaded:', dummyCard);
    }, 500);
  };

  const handleRetry = () => {
    console.log('App - Retry clicked (disabled in Phase 1)');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">The GG Code</h1>
          <p className="text-sm text-gray-600 mt-1">
            AI-Powered Horse Racing Analysis Platform - Phase 1
          </p>
        </div>
      </header>

      {/* Main Content - Two Panel Layout */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Input Form */}
          <div className="space-y-6">
            <RaceInputForm onSubmit={handleRaceSubmit} />
          </div>

          {/* Right Panel - Race Card Display */}
          <div className="space-y-6">
            {!hasSubmitted ? (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Race Analysis</h2>
                <p className="text-gray-600 text-center py-8">
                  Enter race details and click "Start Analysis" to view the race card.
                </p>
              </div>
            ) : raceCard ? (
              <RaceCard 
                raceCard={raceCard} 
                onRetry={handleRetry}
              />
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-center">
                  <p className="text-gray-600">Loading race analysis...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Responsive Note */}
      <div className="lg:hidden fixed top-4 left-4 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
        Mobile View
      </div>

      {/* Developer Panel */}
      <DeveloperPanel indicators={devIndicators} />
    </div>
  );
}

export default App;
