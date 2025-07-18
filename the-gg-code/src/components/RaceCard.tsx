import React from 'react';
import { RaceData } from '../utils/apiClient';

interface RaceCardProps {
  raceData: RaceData[];
  hasError?: boolean;
  onRetry?: () => void;
  isLoading?: boolean;
}

const HorseCard: React.FC<{ horse: RaceData; index?: number; isTopSelection?: boolean }> = ({ 
  horse, 
  index, 
  isTopSelection = false 
}) => (
  <div className={`p-4 rounded border ${isTopSelection ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}>
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-semibold text-lg">{horse.horse_name}</h4>
      {index !== undefined && (
        <span className={`text-sm px-2 py-1 rounded ${
          isTopSelection ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
        }`}>
          #{index + 1}
        </span>
      )}
    </div>
    
    <div className="grid grid-cols-2 gap-2 text-sm">
      <div><span className="font-medium">Odds:</span> {horse.odds}</div>
      <div><span className="font-medium">Runner #:</span> {horse.runner_number || 'N/A'}</div>
      <div><span className="font-medium">Jockey:</span> {horse.jockey || 'N/A'}</div>
      <div><span className="font-medium">Trainer:</span> {horse.trainer || 'N/A'}</div>
      <div><span className="font-medium">Owner:</span> {horse.owner || 'N/A'}</div>
      <div><span className="font-medium">AI Score:</span> {horse.confidence_score}%</div>
      <div><span className="font-medium">Track Score:</span> {horse.track_suitability}%</div>
      <div><span className="font-medium">Tipster:</span> {horse.tipster_influence}</div>
      <div className="col-span-2">
        <span className="font-medium">Price Analysis:</span> {horse.price_analysis}/10
      </div>
    </div>
  </div>
);

const TopSelectionCard: React.FC<{ horse: RaceData; type: string; index: number }> = ({ 
  horse, 
  type, 
  index 
}) => (
  <div className="bg-white border-2 border-blue-200 p-4 rounded-lg">
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-bold text-lg text-blue-700">{type}</h3>
      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
        {horse.confidence_score}% confidence
      </span>
    </div>
    
    <div className="space-y-1 text-sm">
      <div className="font-semibold text-lg">{horse.horse_name}</div>
      <div><span className="font-medium">Odds:</span> {horse.odds}</div>
      <div><span className="font-medium">Jockey:</span> {horse.jockey || 'N/A'}</div>
      <div><span className="font-medium">Track Suitability:</span> {horse.track_suitability}%</div>
      <div><span className="font-medium">Price Analysis:</span> {horse.price_analysis}/10</div>
    </div>
  </div>
);

const RaceCard: React.FC<RaceCardProps> = ({ 
  raceData, 
  hasError = false, 
  onRetry,
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Race Analysis</h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading race data...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Race Analysis</h2>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Unable to retrieve race data</p>
          <button
            onClick={onRetry}
            disabled
            className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
          >
            Retry (Available in future phases)
          </button>
        </div>
      </div>
    );
  }

  if (!raceData || raceData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Race Analysis</h2>
        <div className="text-center py-8">
          <p className="text-gray-600">
            Enter race details and click "Start Analysis" to view the race card.
          </p>
        </div>
      </div>
    );
  }

  // Sort horses by confidence score (highest first)
  const sortedRaceData = [...raceData].sort((a, b) => b.confidence_score - a.confidence_score);
  
  // Create top selections
  const topSelections = [
    { type: 'Winner', horse: sortedRaceData[0] },
    { type: 'Place', horse: sortedRaceData[1] || sortedRaceData[0] },
    { type: 'Longshot', horse: sortedRaceData[sortedRaceData.length - 1] || sortedRaceData[0] }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Race Analysis</h2>
        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
          {raceData.length} horses found
        </span>
      </div>
      
      {/* Top 3 Selections */}
      <div>
        <h3 className="text-lg font-semibold mb-3">AI Top Selections</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {topSelections.map((selection, index) => (
            <TopSelectionCard 
              key={`${selection.type}-${index}`} 
              horse={selection.horse}
              type={selection.type}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Full Runner List */}
      <div>
        <h3 className="text-lg font-semibold mb-3">
          All Runners (Ordered by AI Confidence)
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {sortedRaceData.map((horse, index) => (
            <HorseCard 
              key={`${horse.horse_name}-${index}`} 
              horse={horse} 
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Data Quality Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
        <p className="text-yellow-800 text-sm">
          <strong>Note:</strong> AI confidence scores and analysis ratings are currently placeholders. 
          Advanced prediction algorithms will be implemented in future phases.
        </p>
      </div>
    </div>
  );
};

export default RaceCard;