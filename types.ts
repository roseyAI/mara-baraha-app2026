export enum ArcanaType {
  Major = 'Major',
  Minor = 'Minor'
}

export enum Suit {
  Wands = 'Wands',
  Cups = 'Cups',
  Swords = 'Swords',
  Pentacles = 'Pentacles',
  None = 'None' // For Major Arcana
}

export interface TarotCard {
  id: string;
  name: string;
  nameShort: string;
  suit: Suit;
  number: number;
  arcana: ArcanaType;
  meaningUpright: string;
  meaningReversed: string;
  description: string;
  image?: string; // Optional URL if we had assets
}

export enum SpreadType {
  OneCard = 'Daily Insight',
  ThreeCard = 'Past, Present, Future',
  CelticCross = 'Celtic Cross (Detailed)',
  Love = 'Relationship Spread',
  Career = 'Career Path'
}

export interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  position: string; // e.g., "The Past", "The Challenge"
}

export interface Reading {
  id: string;
  date: string;
  spreadType: SpreadType;
  question: string;
  cards: DrawnCard[];
  interpretation: string;
}

export interface UserState {
  credits: number;
  readings: Reading[];
  lastDailyDraw: string | null; // ISO Date string
}

export const SPREAD_CONFIG: Record<SpreadType, { name: string; positions: string[]; cost: number }> = {
  [SpreadType.OneCard]: {
    name: 'Daily Insight',
    positions: ['Insight'],
    cost: 0 // Free
  },
  [SpreadType.ThreeCard]: {
    name: 'Past, Present, Future',
    positions: ['Past', 'Present', 'Future'],
    cost: 1
  },
  [SpreadType.Love]: {
    name: 'Relationship Spread',
    positions: ['You', 'Them', 'Dynamic', 'Outcome'],
    cost: 2
  },
  [SpreadType.Career]: {
    name: 'Career Path',
    positions: ['Current Situation', 'Obstacles', 'Hidden Influences', 'Advice', 'Outcome'],
    cost: 2
  },
  [SpreadType.CelticCross]: {
    name: 'Celtic Cross',
    positions: ['Present', 'Challenge', 'Past', 'Future', 'Above', 'Below', 'Advice', 'External', 'Hopes/Fears', 'Outcome'],
    cost: 5
  }
};