import { GoogleGenAI, Type } from "@google/genai";

export async function generateBounty(crime: string): Promise<number> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Based on the following crime for a Grand Theft Auto V character, generate a plausible bounty amount: "${crime}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bounty: {
              type: Type.INTEGER,
              description: "The bounty amount in USD, as a whole number. Should be between 1000 and 5000000.",
            },
          },
          required: ["bounty"],
        },
      },
    });

    const jsonResponse = JSON.parse(response.text);
    const bounty = jsonResponse.bounty;

    if (typeof bounty === 'number' && bounty > 0) {
      return bounty;
    } else {
      // Fallback for unexpected response format
      console.error("Invalid bounty format received:", jsonResponse);
      return Math.floor(Math.random() * (100000 - 5000 + 1)) + 5000;
    }
  } catch (error) {
    console.error("Error generating bounty:", error);
    // Provide a random fallback bounty on API error
    return Math.floor(Math.random() * (100000 - 5000 + 1)) + 5000;
  }
}
