import { Horse, RaceCard, TopSelection } from '../types';

export const createDummyHorses = (): Horse[] => [
  {
    name: "Thunderbolt",
    odds: "3/1",
    runnerNumber: "5",
    jockey: "J. Smith",
    trainer: "A. Brown",
    owner: "XYZ Stables",
    aiConfidenceScore: 85,
    trackSuitabilityScore: 78,
    tipsterInfluence: "Strong",
    priceAnalysis: 8
  },
  {
    name: "Lightning Strike",
    odds: "5/1",
    runnerNumber: "2",
    jockey: "M. Johnson",
    trainer: "B. Wilson",
    owner: "Thunder Racing",
    aiConfidenceScore: 80,
    trackSuitabilityScore: 75,
    tipsterInfluence: "Moderate",
    priceAnalysis: 7
  },
  {
    name: "Storm Chaser",
    odds: "7/1",
    runnerNumber: "8",
    jockey: "S. Davis",
    trainer: "C. Miller",
    owner: "Storm Stable",
    aiConfidenceScore: 75,
    trackSuitabilityScore: 82,
    tipsterInfluence: "N/A",
    priceAnalysis: 6
  },
  {
    name: "Silver Bullet",
    odds: "4/1",
    runnerNumber: "3",
    jockey: "R. Taylor",
    trainer: "D. Garcia",
    owner: "Silver Racing",
    aiConfidenceScore: 72,
    trackSuitabilityScore: 70,
    tipsterInfluence: "Weak",
    priceAnalysis: 5
  },
  {
    name: "Golden Arrow",
    odds: "9/1",
    runnerNumber: "1",
    jockey: "L. Anderson",
    trainer: "E. Martinez",
    owner: "Golden Stables",
    aiConfidenceScore: 68,
    trackSuitabilityScore: 65,
    tipsterInfluence: "N/A",
    priceAnalysis: 4
  },
  {
    name: "Racing Dream",
    odds: "12/1",
    runnerNumber: "7",
    jockey: "K. Thompson",
    trainer: "F. Rodriguez",
    owner: "Dream Racing",
    aiConfidenceScore: 65,
    trackSuitabilityScore: 60,
    tipsterInfluence: "N/A",
    priceAnalysis: 3
  },
  {
    name: "Swift Wind",
    odds: "15/1",
    runnerNumber: "4",
    jockey: "P. White",
    trainer: "G. Lewis",
    owner: "Wind Stable",
    aiConfidenceScore: 60,
    trackSuitabilityScore: 55,
    tipsterInfluence: "N/A",
    priceAnalysis: 2
  },
  {
    name: "Midnight Express",
    odds: "20/1",
    runnerNumber: "6",
    jockey: "T. Clark",
    trainer: "H. Walker",
    owner: "Express Racing",
    aiConfidenceScore: 55,
    trackSuitabilityScore: 50,
    tipsterInfluence: "N/A",
    priceAnalysis: 1
  }
];

export const createDummyRaceCard = (): RaceCard => {
  const allRunners = createDummyHorses();
  
  // Sort by AI confidence score for the full runner list
  const sortedRunners = [...allRunners].sort((a, b) => b.aiConfidenceScore - a.aiConfidenceScore);
  
  // Create top 3 selections
  const topSelections: TopSelection[] = [
    { type: 'Winner', horse: sortedRunners[0] },
    { type: 'Place', horse: sortedRunners[1] },
    { type: 'Longshot', horse: sortedRunners[7] } // Last horse as longshot
  ];
  
  return {
    topSelections,
    allRunners: sortedRunners
  };
};