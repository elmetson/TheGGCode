import React from 'react';
import { RaceCard as RaceCardType, Horse, TopSelection } from '../types';

interface RaceCardProps {
  raceCard: RaceCardType;
  hasError?: boolean;
  onRetry?: () => void;
}

const HorseCard: React.FC<{ horse: Horse; index?: number }> = ({ horse, index }) => (
  <div className="bg-gray-50 p-4 rounded border">
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-semibold text-lg">{horse.name}</h4>
      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
        {index !== undefined ? `#${index + 1}` : ''}
      </span>
    </div>
    
    <div className="grid grid-cols-2 gap-2 text-sm">
      <div><span className="font-medium">Odds:</span> {horse.odds}</div>
      <div><span className="font-medium">Runner #:</span> {horse.runnerNumber}</div>
      <div><span className="font-medium">Jockey:</span> {horse.jockey}</div>
      <div><span className="font-medium">Trainer:</span> {horse.trainer}</div>
      <div><span className="font-medium">Owner:</span> {horse.owner}</div>
      <div><span className="font-medium">AI Score:</span> {horse.aiConfidenceScore}%</div>
      <div><span className="font-medium">Track Score:</span> {horse.trackSuitabilityScore}%</div>
      <div><span className="font-medium">Tipster:</span> {horse.tipsterInfluence}</div>
      <div className="col-span-2">
        <span className="font-medium">Price Analysis:</span> {horse.priceAnalysis}/10
      </div>
    </div>
  </div>
);

const TopSelectionCard: React.FC<{ selection: TopSelection }> = ({ selection }) => (
  <div className="bg-white border-2 border-blue-200 p-4 rounded-lg">
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-bold text-lg text-blue-700">{selection.type}</h3>
      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
        {selection.horse.aiConfidenceScore}% confidence
      </span>
    </div>
    
    <div className="space-y-1 text-sm">
      <div className="font-semibold text-lg">{selection.horse.name}</div>
      <div><span className="font-medium">Odds:</span> {selection.horse.odds}</div>
      <div><span className="font-medium">Jockey:</span> {selection.horse.jockey}</div>
      <div><span className="font-medium">Track Suitability:</span> {selection.horse.trackSuitabilityScore}%</div>
      <div><span className="font-medium">Price Analysis:</span> {selection.horse.priceAnalysis}/10</div>
    </div>
  </div>
);

const RaceCard: React.FC<RaceCardProps> = ({ raceCard, hasError = false, onRetry }) => {
  if (hasError) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center">
          <p className="text-red-600 mb-4">No data found. Retry?</p>
          <button
            onClick={onRetry}
            disabled
            className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
          >
            Retry (Disabled in Phase 1)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <h2 className="text-xl font-bold mb-4">Race Analysis</h2>
      
      {/* Top 3 Selections */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Top Selections</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {raceCard.topSelections.map((selection, index) => (
            <TopSelectionCard key={`${selection.type}-${index}`} selection={selection} />
          ))}
        </div>
      </div>

      {/* Full Runner List */}
      <div>
        <h3 className="text-lg font-semibold mb-3">All Runners (Ordered by AI Confidence)</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {raceCard.allRunners.map((horse, index) => (
            <HorseCard key={`${horse.name}-${index}`} horse={horse} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RaceCard;