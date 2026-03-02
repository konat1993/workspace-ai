import type { NextRequest } from "next/server";

const SIMULATED_RESPONSE = `Based on the document you shared, here is a concise summary and answer to your question.
The key points are:
1. The context you provided is being used for this response,
2. In production this would call an LLM API with your document and prompt, and
3. Streaming allows you to see the response as it is generated.
You can extend this to support real providers like OpenAI, Anthropic, or open-source models.`;

const CHUNK_DELAY_MS = 20;

export async function POST(request: NextRequest) {
    const signal = request.signal;

    let body: {
        document?: string;
        selectedText?: string;
        userPrompt?: string;
    };

    try {
        body = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const { document = "", selectedText, userPrompt } = body;

    if (!userPrompt || typeof userPrompt !== "string") {
        return new Response(
            JSON.stringify({
                error: "userPrompt is required and must be a string",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } },
        );
    }

    const context = selectedText?.trim() || document;

    const stream = new ReadableStream({
        start: async (controller) => {
            const encoder = new TextEncoder();
            const words = SIMULATED_RESPONSE.split(/(?=\s)/);

            for (const chunk of words) {
                if (signal?.aborted) {
                    controller.close();
                    return;
                }
                controller.enqueue(encoder.encode(chunk));
                await new Promise((resolve) =>
                    setTimeout(resolve, CHUNK_DELAY_MS),
                );
            }

            controller.close();
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-store",
            "X-Context-Length": String(context.length),
        },
    });
}
