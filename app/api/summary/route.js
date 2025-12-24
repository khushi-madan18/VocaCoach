import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { coachingOptions } from "../../../services/Options";

export async function POST(req) {
    try {
        const { topic, coachingOption, conversation } = await req.json();

        // Server-side environment variable
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const option = coachingOptions.find((item) => item.name === coachingOption);

        // Fallback if option isn't found
        if (!option) {
            return NextResponse.json({
                role: 'assistant',
                content: "Error: Coaching option not found."
            });
        }

        const PROMPT = (option.summaryprompt).replace("{user_topic}", topic);

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // conversation is passed from frontend
        const conversationText = conversation.map(m => `${m.role}: ${m.content}`).join('\n');
        const finalPrompt = `${PROMPT}\n\nConversation:\n${conversationText}\n\nPlease provide the summary now.`;

        const result = await model.generateContent(finalPrompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ role: 'assistant', content: text });

    } catch (error) {
        console.error("Summary Route Error:", error);
        return NextResponse.json({
            role: "assistant",
            content: "I am having trouble connecting to the AI service. Please try again later."
        }, { status: 500 });
    }
}
