import type { NextRequest } from "next/server";
import { OpenAI } from "openai";
import {
    addMessage as addMessageToDb,
    getChatHistory,
} from "@/lib/workspace-messages";

const WORKSPACE_VARIANT = "INTEGRATED" as const;

// Fail fast with clear error instead of opaque SDK error when key is missing; returns null when key missing so caller can return error response
function getOpenAIClient(): OpenAI | null {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return null;
    return new OpenAI({ apiKey });
}

export async function POST(request: NextRequest) {
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

    await addMessageToDb(WORKSPACE_VARIANT, {
        role: "USER",
        content: userPrompt,
        status: "UNKNOWN",
    });

    const chatHistory = await getChatHistory(WORKSPACE_VARIANT);

    const context = (selectedText || document)?.trim() || "";

    const encoder = new TextEncoder();

    const toApiRole = (role: "USER" | "ASSISTANT"): "user" | "assistant" =>
        role === "USER" ? "user" : "assistant";

    // chatHistory already includes the new user message; avoid sending userPrompt twice, only append document context when present
    const input = [
        ...chatHistory.map((message) => ({
            role: toApiRole(message.role),
            content: message.content,
        })),
        ...(context ? [{ role: "user" as const, content: context }] : []),
    ];

    const client = getOpenAIClient();
    if (!client) {
        return new Response(
            JSON.stringify({ error: "OPENAI_API_KEY is not configured" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        );
    }
    const response = await client.responses.create({
        model: "gpt-4o-mini",
        stream: true,
        input,
        instructions:
            "You are a helpful assistant that can answer questions about the document.",
    });

    let content = "";
    let totalContent = "";
    const stream = new ReadableStream({
        start: async (controller) => {
            try {
                for await (const chunk of response) {
                    content = (chunk as { delta?: string })?.delta ?? "";
                    totalContent += content;

                    controller.enqueue(encoder.encode(content));
                }

                await addMessageToDb(WORKSPACE_VARIANT, {
                    role: "ASSISTANT",
                    content: totalContent,
                    status: "DONE",
                });
            } finally {
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-store",
            "X-Context-Length": String(context.length),
            "Transfer-Encoding": "chunked",
        },
    });
}
