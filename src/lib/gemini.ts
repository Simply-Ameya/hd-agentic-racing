import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing Gemini API key.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const flashModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export const proModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export async function generateJSON<T>(
  model: ReturnType<typeof genAI.getGenerativeModel>,
  prompt: string,
) {
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Gemini JSON generation failed:", err);
    return null;
  }
}
