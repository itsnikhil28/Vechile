import { initialMessages } from "@/lib/data"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { streamText } from "ai"

const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY || ""
})

export const runtime = "edge"

const generateid = () => Math.random().toString(36).slice(2, 15)

export async function POST(request) {
    const { messages } = await request.json()

    let language = 'english'

    const filteredMessages = messages.filter(msg => {
        if (msg.role === 'system' && msg.content.startsWith('LANGUAGE:')) {
            language = msg.content.split(':')[1].trim().toLowerCase()
            return false
        }
        return true
    })

    const languageInstruction = {
        id: generateid(),
        role: 'system',
        content: language === 'hindi'? 'आप एक पुरुष सहायक हैं। कृपया हमेशा साधारण, बोलचाल वाली हिंदी में जवाब दें जिसमें ज़रूरत हो तो थोड़ा आसान English मिक्स कर सकते हैं। भाषा ऐसी होनी चाहिए जो आम इंसान आसानी से समझ सके।' : 'You are a male assistant. Always respond in English'
    }

    const prompt = [
        languageInstruction,
        {
            id: generateid(),
            role: "user",
            content: initialMessages.content
        },
        ...filteredMessages.map(message => ({
            id: generateid(),
            role: message.role,
            content: message.content
        }))
    ]

    const stream = await streamText({
        model: google('gemini-2.0-flash-lite-preview-02-05'),
        messages: prompt,
        temperature: 1
    })

    return stream?.toDataStreamResponse()
}


// import { initialMessages } from "@/lib/data"
// import { createGoogleGenerativeAI } from "@ai-sdk/google"
// import { streamText } from "ai"

// const google = createGoogleGenerativeAI({
//     apiKey: process.env.GEMINI_API_KEY || ""
// })

// export const runtime = "edge"

// const generateid = () => Math.random.toString(36).slice(2, 15)

// const buildGooglegenAIPrompt = (messages) => [
//     {
//         id: generateid(),
//         role: "user",
//         content: initialMessages.content
//     },

//     ...messages.map((message) => ({
//         id: generateid() || message.id,
//         role: message.role,
//         content: message.content
//     }))
// ]

// export async function POST(request) {
//     const { messages } = await request.json()

//     const stream = await streamText({
//         model: google('gemini-1.5-pro-002'),
//         messages: buildGooglegenAIPrompt(messages),
//         temperature: 1
//     })
    
//     return stream?.toDataStreamResponse()
// }