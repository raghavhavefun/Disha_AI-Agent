import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const GROQ_KEY = process.env.GROQ_API_KEY!;

const ROADMAP_PROMPT = `You are an elite career strategist and personal mentor. You are creating a HYPER-PERSONALIZED 60-day learning roadmap for a young person.

This person has paid for a premium service and expects high-value, actionable, and non-generic guidance.

CRITICAL RULES FOR TASKS:
1. NO GENERIC TASKS. Never say "Learn Python" or "Study Marketing". 
2. BE HYPER-SPECIFIC. Say "Watch 'Python for Beginners' by Programming with Mosh (Chapters 1-3)" or "Complete the 'Google Digital Marketing & E-commerce' Certificate (Module 1)".
3. REAL RESOURCES. Use names of real, high-quality, free resources: YouTube channels (e.g., freeCodeCamp, Fireship, Ali Abdaal, Ken Jee), specific websites (e.g., Coursera free audit, Khan Academy, GitHub, Behance), or specific books/articles.
4. ACTION-ORIENTED. Tasks must involve DOING. "Build a personal portfolio site using HTML/CSS", "Write a 500-word analysis on recent stock market trends", "Create a Figma prototype for a food delivery app".
5. PROGRESSIVE. Week 1 should be easy wins. Week 8 should be job-ready actions (resume optimization, mock interviews, cold emailing).
6. TONE. Professional yet encouraging, like a mentor who knows exactly what it takes to succeed in the real world.

JSON STRUCTURE (Return ONLY raw JSON):
{
  "weeks": [
    {
      "weekNumber": 1,
      "theme": "Strategic Foundation & Skill Audit",
      "days": [
        {
          "dayNumber": 1,
          "tasks": [
            {
              "title": "Actionable task title",
              "description": "Specific instructions on what to do and why it matters for their chosen career.",
              "type": "video|course|project|practice|reading|networking",
              "resourceUrl": "Actual URL if possible, or a search link",
              "resourceName": "Specific name of the YouTube video, Course, or Article",
              "estimatedMinutes": 45
            }
          ]
        }
      ]
    }
  ]
}

Make sure you have exactly 8 weeks. Each week must have a clear, motivating theme. Ensure the tasks are varied (don't just give 60 videos).`;

async function generateWithGroq(prompt: string): Promise<string> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: ROADMAP_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 8000,
    }),
  });

  if (!response.ok) throw new Error(`Groq error: ${response.status}`);
  const data = await response.json();
  return data.choices[0].message.content;
}

async function generateWithGemini(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    systemInstruction: ROADMAP_PROMPT,
  });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function POST(req: Request) {
  try {
    const { profile, selectedCareers } = await req.json();

    const prompt = `
User Profile:
- Personality: ${profile.personalityType}
- Strengths: ${profile.strengths?.join(", ")}
- Passions: ${profile.passions?.join(", ")}
- Skills to learn: ${profile.skillsToLearn?.join(", ")}
- Best fit industries: ${profile.bestFitIndustries?.join(", ")}

Selected Career Paths (create roadmap for these):
${selectedCareers.map((c: string, i: number) => `${i + 1}. ${c}`).join("\n")}

Create a 60-day roadmap that helps this person build skills for these career paths, considering their existing strengths and what they need to learn.`;

    let rawJson: string;
    try {
      rawJson = await generateWithGroq(prompt);
    } catch {
      rawJson = await generateWithGemini(prompt);
    }

    const cleaned = rawJson.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const roadmap = JSON.parse(cleaned);

    return Response.json(roadmap);
  } catch (error) {
    console.error("Roadmap Error:", error);
    return Response.json(
      { error: "Failed to generate roadmap" },
      { status: 500 }
    );
  }
}
