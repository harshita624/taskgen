import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function generateTasksFromGemini(topic: string): Promise<string[]> {
  const prompt = `You're helping someone learn about "${topic}" in a practical, hands-on way. Create 5 specific, actionable tasks that will genuinely help them understand and apply this topic.

Guidelines:
- Make each task something they can actually DO, not just read about
- Keep tasks short but specific (like "Build a simple calculator app" not "Learn programming")
- Mix different learning styles: reading, practicing, creating, discussing
- Order them from beginner to more advanced
- Each task should take 1-4 hours to complete
- Focus on practical application over theory
- Make it engaging and realistic for someone just starting

Format: Return ONLY the 5 tasks as clean bullet points, no extra text.

Example for "React":
• Set up a React project and create your first "Hello World" component
• Build a simple to-do list with add/delete functionality
• Create a weather app that fetches data from a free API
• Add routing to navigate between different pages in your app
• Deploy your React app to Netlify or Vercel

Now create 5 learning tasks for: "${topic}"`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL || "gemini-1.5-flash"}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const raw = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) throw new Error("No content returned from Gemini API");

    const tasks = raw
      .split("\n")
      .map((line: string) => line.replace(/^[-*\d.]+\s*/, "").trim())
      .filter((line: string) => line.length > 0)
      .slice(0, 5);

    return tasks;
  } catch (error: any) {
    console.error("❌ Error from Gemini API:", error?.response?.data || error.message);
    throw new Error("Failed to generate tasks from Gemini.");
  }
}
