import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const GROQ_KEY = process.env.GROQ_API_KEY!;

const ANALYZE_PROMPT = `You are an elite career psychologist and data analyst. Your job is to extract a DEEP, high-fidelity profile from a conversation between a user and Disha (an AI mentor).

This is NOT a generic chatbot summary. You must analyze the nuances, tone, and specific details shared.

FIELDS TO EXTRACT:
- name: (If not found, use 'Explorer')
- age: (If not found, use 'Not mentioned')
- institution: (College/School name. If not found, use 'Not mentioned')
- organization: (Current company or workplace. If not found, use 'Not mentioned')
- passion: (What truly excites them?)
- aim: (What is their primary career goal or dream?)
- skills: (What can they already do?)

JSON STRUCTURE (Return ONLY raw JSON):
{
  "name": "string",
  "age": "string",
  "institution": "string",
  "organization": "string",
  "passion": "string",
  "aim": "string",
  "skills": ["string"],
  "personalityType": "A unique, creative 3-word title like 'The Disruptive Visionary'",
  "strengths": ["string"],
  "expertise": ["string"],
  "personalityTraits": ["string"],
  "weaknesses": ["string"],
  "areasToImprove": ["string"],
  "skillsToLearn": ["string"],
  "bestFitIndustries": ["string"],
  "recommendedCareers": ["string"],
  "summary": "A 3-4 sentence deeply personal analysis. Mention specific things they said. Don't be generic. Explain WHY you chose their personality type."
}`;

async function analyzeWithGroq(conversation: string): Promise<string> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: ANALYZE_PROMPT },
        { role: "user", content: `Here is the full conversation:\n\n${conversation}` },
      ],
      temperature: 0.5,
      max_tokens: 1500,
    }),
  });

  if (!response.ok) throw new Error(`Groq error: ${response.status}`);
  const data = await response.json();
  return data.choices[0].message.content;
}

async function analyzeWithGemini(conversation: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    systemInstruction: ANALYZE_PROMPT,
  });
  const result = await model.generateContent(`Here is the full conversation:\n\n${conversation}`);
  return result.response.text();
}

export async function POST(req: Request) {
  try {
    const { history } = await req.json();

    const conversation = history
      .map((msg: any) => `${msg.role === "ai" ? "Disha" : "User"}: ${msg.text}`)
      .join("\n");

    let rawJson: string;
    try {
      rawJson = await analyzeWithGroq(conversation);
    } catch {
      rawJson = await analyzeWithGemini(conversation);
    }

    // Clean up any markdown wrapping and extract JSON
    let cleaned = rawJson.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    // Attempt to find JSON if there's surrounding text
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }

    try {
      const profile = JSON.parse(cleaned);
      return Response.json(profile);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, "Raw string:", cleaned);
      // Fallback profile if parsing fails
      return Response.json({
        name: "Explorer",
        age: "Not mentioned",
        institution: "Not mentioned",
        organization: "Not mentioned",
        passion: "Exploration",
        aim: "Discovery",
        skills: ["Adaptability"],
        personalityType: "The Strategic Voyager",
        strengths: ["Curiosity", "Resilience"],
        expertise: ["Generalist"],
        personalityTraits: ["Observant", "Patient"],
        weaknesses: ["Indecision"],
        areasToImprove: ["Goal Setting"],
        skillsToLearn: ["Specialized Skills"],
        bestFitIndustries: ["Unknown"],
        recommendedCareers: ["Consultant", "Researcher"],
        summary: "You are someone who is currently in a state of exploration and discovery."
      });
    }
  } catch (error) {
    console.error("Analyze Error:", error);
    return Response.json(
      { error: "Failed to analyze conversation" },
      { status: 500 }
    );
  }
}
