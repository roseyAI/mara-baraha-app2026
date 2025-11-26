import { FULL_DECK } from '../constants';
import { TarotCard, DrawnCard } from '../types';

export const shuffleDeck = (deck: TarotCard[] = FULL_DECK): TarotCard[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

export const drawCards = (count: number, positions: string[]): DrawnCard[] => {
  const shuffled = shuffleDeck();
  const drawn: DrawnCard[] = [];

  for (let i = 0; i < count; i++) {
    const card = shuffled[i];
    // Mara Baraha method: No reversals, always upright.
    const isReversed = false; 
    drawn.push({
      card,
      isReversed,
      position: positions[i] || `Position ${i + 1}`
    });
  }

  return drawn;
};