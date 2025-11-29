import { GoogleGenAI } from "@google/genai";

// API Key must be obtained exclusively from process.env.API_KEY
const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey });

export const getFitnessAdvice = async (
  query: string, 
  history: { role: string; text: string }[] = []
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Construct a context-aware prompt with FitWithFaisal branding
    const systemInstruction = `You are "Faisal", the elite personal trainer behind "FitWithFaisal". 
    Your mottos are "Train. Transform. Thrive." and "Stronger Every Day".
    Your tone is high-energy, motivating, concise, and professional. 
    You help users build habits, track workouts, and understand fitness concepts.
    Keep answers under 200 words unless asked for a detailed plan.
    Format your response with Markdown (lists, bold text) for readability.
    If asked for a workout plan, provide a structured list with exercises, sets, and reps.`;

    const chat = ai.chats.create({
        model,
        config: {
            systemInstruction,
        },
        history: history.map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
        }))
    });

    const result = await chat.sendMessage({ message: query });
    return result.text || "Let's crush this workout! (I couldn't generate a specific response right now).";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the FitWithFaisal server. Please ensure your API key is correctly configured in the environment.";
  }
};