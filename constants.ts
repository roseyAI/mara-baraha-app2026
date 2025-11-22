import { TarotCard, Suit, ArcanaType } from './types';

// using jsDelivr CDN for better performance and reliability than raw.github
const BASE_IMAGE_URL = "https://cdn.jsdelivr.net/gh/ekelen/tarot-api/static/images/cards";

// Helper to generate the deck
const generateDeck = (): TarotCard[] => {
  const deck: TarotCard[] = [];
  
  // Major Arcana
  const majorArcana = [
    "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
    "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
    "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
    "The Devil", "The Tower", "The Star", "The Moon", "The Sun",
    "Judgement", "The World"
  ];

  majorArcana.forEach((name, index) => {
    // Map index to ID format (ar00, ar01, ... ar21)
    // The source repo uses 'ar' prefix for Major Arcana
    const idSuffix = index.toString().padStart(2, '0');
    
    deck.push({
      id: `major-${index}`,
      name,
      nameShort: name,
      suit: Suit.None,
      number: index,
      arcana: ArcanaType.Major,
      meaningUpright: "Major life lesson, karma, spiritual path.",
      meaningReversed: "Ignoring life lessons, stalling, inner conflict.",
      description: `The ${name} represents a significant archetype in the journey of life.`,
      image: `${BASE_IMAGE_URL}/ar${idSuffix}.jpg`
    });
  });

  // Minor Arcana
  const suits = [Suit.Wands, Suit.Cups, Suit.Swords, Suit.Pentacles];
  const ranks = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];
  
  // Map suits to ID prefixes used by the repo (wa, cu, sw, pe)
  const suitPrefixes: Record<Suit, string> = {
    [Suit.Wands]: 'wa',
    [Suit.Cups]: 'cu',
    [Suit.Swords]: 'sw',
    [Suit.Pentacles]: 'pe',
    [Suit.None]: ''
  };

  suits.forEach(suit => {
    ranks.forEach((rank, index) => {
      // Number is index + 1. 
      // Files are 01..14 (Ace=01, ..., Ten=10, Page=11, Knight=12, Queen=13, King=14)
      const number = index + 1;
      const idSuffix = number.toString().padStart(2, '0');
      const prefix = suitPrefixes[suit];

      deck.push({
        id: `minor-${suit}-${index + 1}`,
        name: `${rank} of ${suit}`,
        nameShort: `${rank} ${suit}`,
        suit: suit,
        number: number,
        arcana: ArcanaType.Minor,
        meaningUpright: `Energy of ${suit} in the form of ${rank}.`,
        meaningReversed: `Blocked energy of ${suit} in the form of ${rank}.`,
        description: `The ${rank} of ${suit} pertains to everyday life aspects associated with ${suit}.`,
        image: `${BASE_IMAGE_URL}/${prefix}${idSuffix}.jpg`
      });
    });
  });

  return deck;
};

export const FULL_DECK = generateDeck();

export const GEMINI_SYSTEM_INSTRUCTION = `
You are Mara, a mystical, compassionate, and insightful Tarot reader. 
Your tone is calm, slightly esoteric but grounded, and supportive. 
You do not give medical, legal, or financial advice. 
Instead, you offer guidance on energy, mindset, and potential paths. 
Structure your response with clear headings for each card if multiple are drawn, and a final "Synthesis" or "Summary" section.
Keep the response under 300 words unless it is a complex spread (like Celtic Cross), then up to 600 words.
Format the output in Markdown.
`;