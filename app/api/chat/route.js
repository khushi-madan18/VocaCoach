import OpenAI from "openai";
import { NextResponse } from "next/server";
import { coachingOptions } from "../../../services/Options";

export async function POST(req) {
    try {
        const { topic, coachingOption, messages } = await req.json();


        const openai = new OpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: process.env.DEEPSEEK_API_KEY
        });

        const option = coachingOptions.find((item) => item.name === coachingOption);

        if (!option) {
            return NextResponse.json({
                role: 'assistant',
                content: "Error: Coaching option not found."
            });
        }

        const PROMPT = (option.prompt).replace("{user_topic}", topic);

        try {
            // Include system prompt and history
            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: PROMPT },
                    ...messages
                ],
                model: "deepseek/deepseek-chat",
            });

            return NextResponse.json({ role: 'assistant', content: completion.choices[0].message.content });

        } catch (error) {
            console.error("AI Model Error:", error);
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
