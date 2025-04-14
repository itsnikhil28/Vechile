import { streamText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { initialMessages } from "@/lib/data"

const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
    compatibility: "strict"
});

export const runtime = "edge"

export async function POST(request) {
    const { messages } = await request.json();

    const stream = await streamText({
        model: openai("gpt-3.5-turbo"),
        messages: [initialMessages, ...messages],
        temperature: 1
    });

    return stream?.toDataStreamResponse();
}