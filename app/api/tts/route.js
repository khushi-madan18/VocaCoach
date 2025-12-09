import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { NextResponse } from "next/server";

const pollyClient = new PollyClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

export async function POST(req) {
    try {
        const { text, voiceId } = await req.json();

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        const command = new SynthesizeSpeechCommand({
            Text: text,
            OutputFormat: 'mp3',
            VoiceId: voiceId || 'Joanna' // Default to Joanna if not provided
        });

        const { AudioStream } = await pollyClient.send(command);

        // Convert the AudioStream (which is a ReadableStream) to a Buffer
        const audioBuffer = await AudioStream.transformToByteArray();

        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
            },
        });

    } catch (error) {
        console.error("Error generating audio:", error);
        return NextResponse.json({ error: "Failed to generate audio" }, { status: 500 });
    }
}
