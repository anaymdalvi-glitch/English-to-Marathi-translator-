import { GoogleGenAI } from "@google/genai";
import { Language } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const translateText = async (
  text: string,
  targetLanguage: Language
): Promise<string> => {
  try {
    const prompt = `Translate the following English text to ${targetLanguage}. 
    Provide only the direct translation of the text itself, without any additional explanations, 
    introductory phrases, or labels like "${targetLanguage} Translation:".

    English Text:
    """
    ${text}
    """
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error(`Error translating to ${targetLanguage}:`, error);
    throw new Error("Failed to get translation from AI model.");
  }
};
