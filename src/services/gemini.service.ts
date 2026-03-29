import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeFeedback(title: string, description: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Analyse this feedback.
    Return JSON:
    {
      "category": "",
      "sentiment": "",
      "priority_score": 1,
      "summary": "",
      "tags": []
    }

    Title: ${title}
    Description: ${description}
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return JSON.parse(text);
  } catch {
    return null;
  }
}