import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { coachingOptions } from "../../../services/Options";

export async function POST(req) {
    try {
        const { topic, coachingOption, messages } = await req.json();

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

        const PROMPT = (option.prompt).replace("{user_topic}", topic);

        try {
            const model = genAI.getGenerativeModel({
                model: "gemini-2.0-flash",
                systemInstruction: PROMPT
            });

            // Construct history
            // messages is lastTwoResp from frontend
            let chatHistory = messages.slice(0, -1).map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            }));

            // Gemini history must start with a user message
            if (chatHistory.length > 0 && chatHistory[0].role === 'model') {
                chatHistory = chatHistory.slice(1);
            }

            const chat = model.startChat({
                history: chatHistory
            });

            const lastMsg = messages[messages.length - 1];
            const result = await chat.sendMessage(lastMsg.content);
            const response = await result.response;
            const text = response.text();

            return NextResponse.json({ role: 'assistant', content: text });

        } catch (error) {
            console.error("AI Model Error:", error);
            // Check for safety block or other generation errors
            if (error.message?.includes("SAFETY") || error.message?.includes("blocked")) {
                return NextResponse.json({
                    role: 'assistant',
                    content: "Could you rephrase that? I want to make sure I understand correctly."
                });
            }
            throw error;
        }

    } catch (error) {
        console.error("Chat Route Error:", error);
        return NextResponse.json({
            role: "assistant",
            content: "I am having trouble connecting to the AI service. Please try again later."
        }, { status: 500 });
    }
}
