import React, { useState, useEffect } from 'react';
import { DeveloperIndicators } from '../types';

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
            <span className="text-red-400">{indicators.apiHealth}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Rate Limit Remaining:</span>
            <span className="text-yellow-400">{indicators.rateLimitRemaining}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Rate Limit Reset:</span>
            <span className="text-yellow-400">{indicators.rateLimitReset}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Data Quality:</span>
            <span className="text-orange-400">{indicators.dataQuality}</span>
          </div>
          
          <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-600">
            Phase 1: UI Only - No backend integration
          </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperPanel;