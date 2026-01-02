import OpenAI from "openai";
import { NextResponse } from "next/server";
import { coachingOptions } from "../../../services/Options";

export async function POST(req) {
    try {
        const { topic, coachingOption, conversation } = await req.json();


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

        const PROMPT = (option.summaryprompt).replace("{user_topic}", topic);

        const conversationText = conversation.map(m => `${m.role}: ${m.content}`).join('\n');
        const finalPrompt = `${PROMPT}\n\nConversation:\n${conversationText}\n\nPlease provide the summary now.`;

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful AI assistant." }, // Or specific summary system prompt
                { role: "user", content: finalPrompt }
            ],
            model: "deepseek/deepseek-chat",
        });

        return NextResponse.json({ role: 'assistant', content: completion.choices[0].message.content });

    } catch (error) {
        console.error("Summary Route Error:", error);
        return NextResponse.json({
            role: "assistant",
            content: "I am having trouble connecting to the AI service. Please try again later."
        }, { status: 500 });
    }
}
