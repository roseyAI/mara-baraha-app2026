import { GoogleGenAI } from "@google/genai";
import { DrawnCard, SpreadType } from '../types';
import { GEMINI_SYSTEM_INSTRUCTION } from '../constants';

// Initialize GenAI Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const interpretReading = async (
  spreadType: SpreadType,
  question: string,
  drawnCards: DrawnCard[]
): Promise<string> => {
  
  // Construct the prompt
  let cardsDescription = "";
  drawnCards.forEach((dc, index) => {
    cardsDescription += `${index + 1}. **${dc.position}**: ${dc.card.name} ${dc.isReversed ? "(Reversed)" : "(Upright)"}\n`;
  });

  const prompt = `
    Reading Type: ${spreadType}
    Querent's Question: "${question}"
    
    Cards Drawn:
    ${cardsDescription}
    
    Please provide an interpretation of these cards in the context of the question and the position they fell in.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
        temperature: 0.7, 
      },
    });

    return response.text || " The mists are too thick to see clearly right now. Please try again later.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The connection to the ether is disrupted (API Error). Please check your connection and try again.";
  }
};
