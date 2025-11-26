import { GoogleGenAI } from "@google/genai";
import { DrawnCard, SpreadType } from '../types';
import { GEMINI_SYSTEM_INSTRUCTION } from '../constants';

// Initialize GenAI Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const interpretReading = async (
  spreadType: SpreadType,
  question: string,
  drawnCards: DrawnCard[],
  isDaily: boolean = false
): Promise<string> => {
  
  // Construct the prompt
  let cardsDescription = "";
  drawnCards.forEach((dc, index) => {
    cardsDescription += `${index + 1}. **${dc.position}**: ${dc.card.name} (Upright)\n`;
  });

  let lengthInstruction = isDaily 
    ? "Provide a short, impactful intuitive reading. **Strictly limited to 5-8 sentences.** Focus on the core energy of the day."
    : "Provide a detailed interpretation.";

  const prompt = `
    Reading Type: ${spreadType}
    Question: "${question}"
    
    Cards Drawn:
    ${cardsDescription}
    
    ${lengthInstruction}
    IMPORTANT: Provide the response as clean text only. DO NOT use markdown formatting (no asterisks, no hash symbols, no bolding). DO NOT enclose the response in quotation marks.
    Please interpret this for the user.
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

    return response.text || "The mists are too thick to see clearly right now. Please try again later.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The connection to the ether is disrupted (API Error). Please check your connection and try again.";
  }
};