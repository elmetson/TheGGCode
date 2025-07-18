import React, { useState } from 'react';
import './App.css';
import RaceInputForm from './components/RaceInputForm';
import RaceCard from './components/RaceCard';
import DeveloperPanel, { DeveloperIndicators } from './components/DeveloperPanel';
import { RaceInput } from './types';
import { RaceData } from './utils/apiClient';

function App() {
  const [raceData, setRaceData] = useState<RaceData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Developer indicators with real API status
  const [devIndicators, setDevIndicators] = useState<DeveloperIndicators>({
    apiHealth: 'Not Connected',
    rateLimitRemaining: null,
    rateLimitReset: null,
    dataQuality: 'N/A'
  });

  const handleRaceSubmit = (raceInput: RaceInput) => {
    console.log('App - Processing race input:', raceInput);
    setIsLoading(true);
    setHasError(false);
  };

  const handleRaceData = (data: RaceData[]) => {
    console.log('App - Received race data:', data);
    setRaceData(data);
    setIsLoading(false);
    setHasError(data.length === 0);
  };

  const handleApiStatus = (status: {
    health: string;
    rateLimitRemaining: number | null;
    rateLimitReset: number | null;
    dataQuality: string;
  }) => {
    console.log('App - API status update:', status);
    // Map the status to match DeveloperIndicators interface
    setDevIndicators({
      apiHealth: status.health,
      rateLimitRemaining: status.rateLimitRemaining,
      rateLimitReset: status.rateLimitReset,
      dataQuality: status.dataQuality
    });
    setIsLoading(false);
  };

  const handleRetry = () => {
    console.log('App - Retry clicked (functionality to be implemented)');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">The GG Code</h1>
          <p className="text-sm text-gray-600 mt-1">
            AI-Powered Horse Racing Analysis Platform - Phase 2
          </p>
          <div className="mt-2 flex space-x-4 text-xs text-gray-500">
            <span>🔍 Brave Search API</span>
            <span>🤖 Llama-3.3-70B-Instruct</span>
            <span>💾 Supabase Database</span>
          </div>
        </div>
      </header>

      {/* Main Content - Two Panel Layout */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Input Form */}
          <div className="space-y-6">
            <RaceInputForm 
              onSubmit={handleRaceSubmit}
              setRaceData={handleRaceData}
              setApiStatus={handleApiStatus}
            />
          </div>

          {/* Right Panel - Race Card Display */}
          <div className="space-y-6">
            <RaceCard 
              raceData={raceData}
              hasError={hasError}
              onRetry={handleRetry}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>

      {/* Environment Variables Status */}
      {process.env.NODE_ENV === 'development' && (
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
            <p className="font-medium text-yellow-800 mb-1">Development Environment Check:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                Brave API: {process.env.REACT_APP_BRAVE_API_KEY ? '✅ Configured' : '❌ Missing'}
              </div>
              <div>
                OpenRouter API: {process.env.REACT_APP_OPENROUTER_API_KEY ? '✅ Configured' : '❌ Missing'}
              </div>
              <div>
                Supabase URL: {process.env.REACT_APP_SUPABASE_URL ? '✅ Configured' : '❌ Missing'}
              </div>
              <div>
                Supabase Key: {process.env.REACT_APP_SUPABASE_KEY ? '✅ Configured' : '❌ Missing'}
              </div>
            </div>
          </div>
        </div>
      )}

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
