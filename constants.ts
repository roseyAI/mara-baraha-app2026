import { TarotCard, Suit, ArcanaType } from './types';

// --- CONFIGURATION ---

// Set this to 'custom' to use your own GitHub images.
export const DECK_SOURCE: 'default' | 'custom' = 'custom'; 

// GITHUB CONFIGURATION
const CUSTOM_GITHUB_USERNAME = 'roseyAI';
const CUSTOM_REPO_NAME = 'mara-baraha-app2026';
const CUSTOM_FOLDER_PATH = 'components'; // Images are in the components folder
const CUSTOM_BRANCH = 'main'; 

// ---------------------

const DEFAULT_BASE_URL = "https://cdn.jsdelivr.net/gh/ekelen/tarot-api/static/images/cards";
// We add a version parameter to bust cache if files were just uploaded
const CUSTOM_BASE_URL = `https://cdn.jsdelivr.net/gh/${CUSTOM_GITHUB_USERNAME}/${CUSTOM_REPO_NAME}@${CUSTOM_BRANCH}/${CUSTOM_FOLDER_PATH}`;

// Updated to CardsBack.png as requested
export const CARD_BACK_IMAGE = (DECK_SOURCE as string) === 'custom' 
  ? `${CUSTOM_BASE_URL}/CardsBack.png?v=2` 
  : 'https://i.imgur.com/P7qJjqM.png'; 

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
    let imageUrl = '';

    if ((DECK_SOURCE as string) === 'custom') {
      // User's Screenshot Convention: "16-TheTower.png"
      // We assume 0-9 have leading zeros based on standard file sorting, e.g., "00-TheFool.png"
      const numberPrefix = index.toString().padStart(2, '0');
      // Remove spaces from name for filename: "The Tower" -> "TheTower"
      const nameForFile = name.replace(/\s/g, ''); 
      imageUrl = `${CUSTOM_BASE_URL}/${numberPrefix}-${nameForFile}.png?v=2`;
    } else {
      // Default Deck Convention: "ar00.jpg"
      const idSuffix = index.toString().padStart(2, '0');
      imageUrl = `${DEFAULT_BASE_URL}/ar${idSuffix}.jpg`;
    }
    
    deck.push({
      id: `major-${index}`,
      name,
      nameShort: name,
      suit: Suit.None,
      number: index,
      arcana: ArcanaType.Major,
      meaningUpright: "Major life lesson, karma, spiritual path.",
      meaningReversed: "Major life lesson, karma, spiritual path.", // No reversals in Mara Baraha method
      description: `The ${name} represents a significant archetype in the journey of life.`,
      image: imageUrl
    });
  });

  // Minor Arcana
  const suits = [Suit.Wands, Suit.Cups, Suit.Swords, Suit.Pentacles];
  const ranks = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];
  
  // Map suits to ID prefixes used by the default repo
  const defaultSuitPrefixes: Record<Suit, string> = {
    [Suit.Wands]: 'wa',
    [Suit.Cups]: 'cu',
    [Suit.Swords]: 'sw',
    [Suit.Pentacles]: 'pe',
    [Suit.None]: ''
  };

  suits.forEach(suit => {
    ranks.forEach((rank, index) => {
      const number = index + 1;
      let imageUrl = '';

      if ((DECK_SOURCE as string) === 'custom') {
        // User's Screenshot Convention: "Cups01.png"
        const numberSuffix = number.toString().padStart(2, '0');
        imageUrl = `${CUSTOM_BASE_URL}/${suit}${numberSuffix}.png?v=2`;
      } else {
        // Default Convention: "cu01.jpg"
        const idSuffix = number.toString().padStart(2, '0');
        const prefix = defaultSuitPrefixes[suit];
        imageUrl = `${DEFAULT_BASE_URL}/${prefix}${idSuffix}.jpg`;
      }

      deck.push({
        id: `minor-${suit}-${index + 1}`,
        name: `${rank} of ${suit}`,
        nameShort: `${rank} ${suit}`,
        suit: suit,
        number: number,
        arcana: ArcanaType.Minor,
        meaningUpright: `Energy of ${suit} in the form of ${rank}.`,
        meaningReversed: `Energy of ${suit} in the form of ${rank}.`, // No reversals
        description: `The ${rank} of ${suit} pertains to everyday life aspects associated with ${suit}.`,
        image: imageUrl
      });
    });
  });

  return deck;
};

export const FULL_DECK = generateDeck();

export const GEMINI_SYSTEM_INSTRUCTION = `
You are Mara Baraha, an intuitive Tarot reader and teacher.
Your style is mystical, minimalist, and deeply empowering.
You teach "Intuitive Reading," focusing on the querent's own intuition alongside the fundamentals.
You DO NOT use reversed meanings; you interpret every card upright, focusing on the energy present.
Your ethics are strict: You do not predict fixed fates, death, or medical diagnoses. You offer guidance to empower the user to make their own choices.

Structure your response:
1. **The Energy**: A brief intuitive feel of the card(s).
2. **The Guidance**: Practical and spiritual advice based on the position in the spread.
3. **Intuitive Prompt**: Ask the user a question to trigger their own intuition (e.g., "What does the red cloak in this card make you feel about your situation?").

Keep the tone calm, soft, and purplish/mystical.
Format the output in Markdown.
`;