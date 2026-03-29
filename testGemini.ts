// testGemini.ts
import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Make sure your .env has:
// GEMINI_API_KEY=YOUR_API_KEY_HERE
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function testGemini() {
  try {
    // Use the working model name from your example
    
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    const prompt = `
Return ONLY JSON.

{
  "category": "Bug | Feature Request | Improvement | Other",
  "sentiment": "Positive | Neutral | Negative",
  "priority_score": 1,
  "summary": "",
  "tags": []
}

Title: Example Title
Description: This is an example description for testing the Gemini API.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    console.log('🧠 RAW RESPONSE:', text);

    // Extract JSON safely
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      console.error('❌ No JSON found in response');
      return;
    }

    const parsed = JSON.parse(match[0]);
    console.log('✅ Parsed JSON:', parsed);

  } catch (err) {
    console.error('❌ Gemini API error:', err);
  }
}

testGemini();