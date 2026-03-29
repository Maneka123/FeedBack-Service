// src/services/gemini.service.ts
import dotenv from "dotenv";
dotenv.config(); // load .env first

import { GoogleGenerativeAI } from "@google/generative-ai";

export interface FeedbackAnalysis {
  category: "Bug" | "Feature Request" | "Improvement" | "Other";
  sentiment: "Positive" | "Neutral" | "Negative";
  priority_score: number;
  summary: string;
  tags: string[];
}

// Function to create client lazily
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is missing in .env");
  return new GoogleGenerativeAI(apiKey);
}

export async function analyzeFeedback(
  title: string,
  description: string
): Promise<FeedbackAnalysis | null> {
  try {
    const genAI = getGenAI();

    // Use the working model you tested successfully
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `
Return ONLY JSON (no extra text or markdown):

{
  "category": "Bug | Feature Request | Improvement | Other",
  "sentiment": "Positive | Neutral | Negative",
  "priority_score": 1,
  "summary": "",
  "tags": []
}

Title: ${title}
Description: ${description}
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();

    console.log("🧠 RAW RESPONSE:", text);

    // Remove Markdown code fences if present
    text = text.replace(/```json|```/gi, "").trim();

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;

    let parsed: FeedbackAnalysis = JSON.parse(match[0]);

    parsed.category = parsed.category || "Other";
    parsed.sentiment = parsed.sentiment || "Neutral";
    parsed.priority_score = parsed.priority_score ?? 1;
    parsed.summary = parsed.summary || "";
    parsed.tags = Array.isArray(parsed.tags) ? parsed.tags : [];

    return parsed;
  } catch (err: any) {
    console.error("❌ Gemini API error:", err?.response?.status, err?.response?.statusText || err);
    return null;
  }
}