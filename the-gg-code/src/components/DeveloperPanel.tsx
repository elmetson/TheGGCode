import React, { useState, useEffect } from 'react';

export interface DeveloperIndicators {
  apiHealth: string;
  rateLimitRemaining: number | null;
  rateLimitReset: number | null;
  dataQuality: string;
}

interface DeveloperPanelProps {
  indicators: DeveloperIndicators;
}

const DeveloperPanel: React.FC<DeveloperPanelProps> = ({ indicators }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Log indicators to console as specified
  useEffect(() => {
    console.log('Developer Panel - API Health:', indicators.apiHealth);
    console.log('Developer Panel - Rate Limit Remaining:', indicators.rateLimitRemaining);
    console.log('Developer Panel - Rate Limit Reset:', indicators.rateLimitReset);
    console.log('Developer Panel - Data Quality:', indicators.dataQuality);
  }, [indicators]);

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'Connected': return 'text-green-400';
      case 'Error': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'High': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const formatRateLimitReset = (reset: number | null) => {
    if (!reset) return 'N/A';
    try {
      const resetDate = new Date(reset * 1000);
      return resetDate.toLocaleTimeString();
    } catch {
      return reset.toString();
    }
  };

  return (
    <div className="fixed bottom-0 right-0 bg-gray-800 text-white p-4 rounded-tl-lg shadow-lg w-80 z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold">Developer Panel</h3>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-xs bg-gray-600 px-2 py-1 rounded hover:bg-gray-500"
        >
          {isCollapsed ? 'Show' : 'Hide'}
        </button>
      </div>
      
      {!isCollapsed && (
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span>API Health:</span>
            <span className={getHealthColor(indicators.apiHealth)}>
              {indicators.apiHealth}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Rate Limit Remaining:</span>
            <span className="text-yellow-400">
              {indicators.rateLimitRemaining ?? 'N/A'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Rate Limit Reset:</span>
            <span className="text-yellow-400">
              {formatRateLimitReset(indicators.rateLimitReset)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Data Quality:</span>
            <span className={getQualityColor(indicators.dataQuality)}>
              {indicators.dataQuality}
            </span>
          </div>
          
          <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-600">
            Phase 2: Brave Search + Llama-3.3-70B + Supabase
          </div>
          
          {/* API Status Indicators */}
          <div className="mt-2 pt-2 border-t border-gray-600">
            <div className="text-xs text-gray-300 mb-1">API Status:</div>
            <div className="flex space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                indicators.apiHealth === 'Connected' ? 'bg-green-400' : 
                indicators.apiHealth === 'Error' ? 'bg-red-400' : 'bg-yellow-400'
              }`}></div>
              <span className="text-xs">Brave Search</span>
            </div>
            <div className="flex space-x-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${
                indicators.dataQuality !== 'N/A' ? 'bg-green-400' : 'bg-gray-400'
              }`}></div>
              <span className="text-xs">OpenRouter LLM</span>
            </div>
            <div className="flex space-x-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${
                process.env.REACT_APP_SUPABASE_URL ? 'bg-green-400' : 'bg-red-400'
              }`}></div>
              <span className="text-xs">Supabase DB</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperPanel;