import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
}

// Helper to check key
const hasKey = () => !!apiKey && !!ai;

export const geminiService = {
  /**
   * Generates a story outline or plot twist based on keywords.
   */
  async generateStoryIdeas(keywords: string, type: 'outline' | 'twist' | 'rewrite'): Promise<string> {
    if (!hasKey()) {
        // Mock response if no key
        await new Promise(resolve => setTimeout(resolve, 1500)); // Fake delay
        if (type === 'twist') return "Suddenly, the ancient artifact wasn't a weapon, but a key to a prison holding something far worse.";
        if (type === 'rewrite') return "The darkness wasn't just an absence of light; it was a living, breathing entity that wrapped around him like a cold shroud.";
        return "AI Configuration missing.";
    }

    const prompts = {
      outline: `Create a brief story outline based on these keywords: ${keywords}. Keep it under 200 words.`,
      twist: `Suggest a shocking plot twist for a story involving: ${keywords}.`,
      rewrite: `Rewrite the following text to be more descriptive and engaging: "${keywords}"`
    };

    try {
      const response = await ai!.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompts[type],
      });
      return response.text || "No response generated.";
    } catch (error) {
      console.error("AI Error:", error);
      return "Failed to generate ideas. Please try again.";
    }
  },

  /**
   * Suggests tags and genre for a given text.
   */
  async autoTagStory(content: string): Promise<{ genre: string, tags: string[] }> {
    if (!hasKey()) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { genre: "Fantasy", tags: ["Magic", "Adventure", "Generated"] };
    }

    try {
      const response = await ai!.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analyze this story snippet: "${content.substring(0, 1000)}...". 
        Return a JSON object with a single "genre" string and an array of 5 "tags".`,
        config: {
            responseMimeType: "application/json"
        }
      });
      
      const text = response.text || "{}";
      return JSON.parse(text);
    } catch (error) {
      console.error("AI Error:", error);
      return { genre: "Fantasy", tags: ["Adventure", "Magic"] }; // Fallback
    }
  },

  /**
   * Summarizes a chapter or previous context.
   */
  async summarizeText(text: string): Promise<string> {
    if (!hasKey()) {
         await new Promise(resolve => setTimeout(resolve, 1500));
         return "Elias Blackwood encounters a massive Leviathan in the storm. The creature seems to be communicating, or perhaps waiting. The lighthouse beacon reveals its massive eye staring back.";
    }

    try {
      const response = await ai!.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Summarize this text in 3 bullet points for a reader catching up: "${text.substring(0, 2000)}..."`,
      });
      return response.text || "No summary available.";
    } catch (error) {
      return "Could not generate summary.";
    }
  },

  /**
   * Checks for content policy violations.
   */
  async moderateContent(text: string): Promise<string> {
    if (!hasKey()) {
         await new Promise(resolve => setTimeout(resolve, 1000));
         return "Approved";
    }

    try {
      const response = await ai!.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Review this text for severe violence or explicit content. If safe, say "Approved". If not, briefly explain why. Text: "${text.substring(0, 500)}..."`,
      });
      return response.text || "Approved";
    } catch (error) {
      return "Approved (Service Unavailable)";
    }
  }
};