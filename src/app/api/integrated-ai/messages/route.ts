import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { OpenAI } from "openai";
import prisma from "@/lib/db";
import {
    addMessage as addMessageToDb,
    deleteLastUserAndAssistantFromDb,
    getChatHistory,
} from "@/lib/workspace-messages";
import type { MessageRole } from "@/types/workspace";

export const dynamic = "force-dynamic";

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
        regenerate?: boolean;
        systemIdByPrompt?: string;
        selectedAiModel?: string;
    };

    try {
        body = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const {
        document = "",
        selectedText,
        userPrompt,
        regenerate = false,
        systemIdByPrompt,
        selectedAiModel,
    } = body;

    if (!userPrompt || typeof userPrompt !== "string") {
        return new Response(
            JSON.stringify({
                error: "userPrompt is required and must be a string",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } },
        );
    }

    const defaultSystemPrompt = `
    You are a helpful assistant that can answer questions.
    `;
    const context = (selectedText || document)?.trim() || defaultSystemPrompt;
    const contentHash = createHash("sha256").update(context).digest("hex");

    const systemPrompt = await prisma.systemPrompt.upsert({
        where: { contentHash },
        create: { content: context, contentHash },
        update: {},
    });

    let systemByPrompt = "";

    if (regenerate) {
        await deleteLastUserAndAssistantFromDb();

        // Only fetch system prompt when id is provided; avoid findUnique(undefined)
        if (systemIdByPrompt) {
            const systemByUserPrompt = await prisma.systemPrompt.findUnique({
                where: { id: systemIdByPrompt },
            });
            systemByPrompt = systemByUserPrompt?.content ?? "";
        }
    } else {
        await addMessageToDb({
            role: "USER",
            content: userPrompt,
            status: "UNKNOWN",
            systemPromptId: systemPrompt.id,
        });
    }

    const chatHistory = await getChatHistory();

    const encoder = new TextEncoder();

    const toApiRole = (role: MessageRole): "user" | "assistant" => {
        switch (role) {
            case "USER":
                return "user";
            case "ASSISTANT":
                return "assistant";
        }
    };

    // System context lives in SystemPrompt table only; we prepend it here for the API. chatHistory has USER + ASSISTANT only.
    const input = [
        ...(context
            ? [
                  {
                      role: "system" as const,
                      content: regenerate ? systemByPrompt || context : context,
                  },
              ]
            : []),
        ...chatHistory.map((message) => ({
            role: toApiRole(message.role),
            content: message.content,
        })),
    ];

    const client = getOpenAIClient();
    if (!client) {
        return new Response(
            JSON.stringify({ error: "OPENAI_API_KEY is not configured" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        );
    }

    const response = await client.responses.create({
        model: selectedAiModel ?? "gpt-4o-mini",
        stream: true,
        input,
        instructions:
            "You are a helpful assistant that can answer questions about the document.",
    });

    let totalContent = "";
    const stream = new ReadableStream({
        start: async (controller) => {
            try {
                for await (const chunk of response) {
                    const content = (chunk as { delta?: string })?.delta ?? "";
                    totalContent += content;
                    controller.enqueue(encoder.encode(content));
                }
                await addMessageToDb({
                    role: "ASSISTANT",
                    content: totalContent,
                    status: "DONE",
                    model: selectedAiModel ?? "gpt-4o-mini",
                    systemPromptId: systemPrompt.id,
                });
            } catch (err) {
                const message =
                    err instanceof Error ? err.message : String(err);
                await addMessageToDb({
                    role: "ASSISTANT",
                    content: `Error: ${message}`,
                    status: "ERROR",
                    model: selectedAiModel ?? "gpt-4o-mini",
                    systemPromptId: systemPrompt.id,
                });
                controller.enqueue(encoder.encode(`\n[Error: ${message}]`));
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
