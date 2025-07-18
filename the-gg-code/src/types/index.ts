export interface RaceInput {
  country: string;
  venue: string;
  date: string;
  time: string;
}

export interface Horse {
  name: string;
  odds: string;
  runnerNumber: string;
  jockey: string;
  trainer: string;
  owner: string;
  aiConfidenceScore: number;
  trackSuitabilityScore: number;
  tipsterInfluence: string;
  priceAnalysis: number;
}

export interface TopSelection {
  type: 'Winner' | 'Place' | 'Longshot';
  horse: Horse;
}

export interface RaceCard {
  topSelections: TopSelection[];
  allRunners: Horse[];
}

export interface DeveloperIndicators {
  apiHealth: string;
  rateLimitRemaining: string;
  rateLimitReset: string;
  dataQuality: string;
}

export interface Country {
  code: string;
  name: string;
  timezone: string;
}

export interface ValidationErrors {
  country?: string;
  venue?: string;
  date?: string;
  time?: string;
}