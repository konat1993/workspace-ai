import prisma from "@/lib/db";
import type { Message, MessageRole } from "@/types/workspace";

function toAppMessage(row: {
    id: string;
    role: MessageRole;
    content: string;
    status: Message["status"];
    systemPromptId: string | null;
    model: string | null;
}): Message {
    return {
        id: row.id,
        role: row.role,
        content: row.content,
        status: row.status,
        systemPromptId: row.systemPromptId ?? null,
        model: row.model,
    };
}

export async function getChatHistory(): Promise<Message[]> {
    const rows = await prisma.message.findMany({
        orderBy: { createdAt: "asc" },
    });
    return rows.map(toAppMessage);
}

export async function addMessage(
    message: Omit<Message, "id" | "model"> & {
        id?: string;
        model?: string | null;
    },
): Promise<Message> {
    const created = await prisma.message.create({
        data: {
            role: message.role,
            content: message.content,
            status: message.status,
            systemPromptId: message.systemPromptId,
            model: message.role === "ASSISTANT" ? message.model : null,
        },
    });
    return toAppMessage(created);
}

export async function updateMessage(
    id: string,
    updates: { content?: string; status?: Message["status"] },
): Promise<Message | null> {
    const updated = await prisma.message
        .update({
            where: { id },
            data: {
                ...(updates.content !== undefined && {
                    content: updates.content,
                }),
                ...(updates.status !== undefined && { status: updates.status }),
            },
        })
        .catch(() => null);
    return updated ? toAppMessage(updated) : null;
}

export async function deleteLastUserAndAssistantFromDb(): Promise<number> {
    const findLastAssistantMessage = await prisma.message.findFirst({
        orderBy: { createdAt: "desc" },
        where: {
            role: "ASSISTANT",
        },
    });

    if (!findLastAssistantMessage?.id) return 0;

    const result = await prisma.message.deleteMany({
        where: {
            id: findLastAssistantMessage.id,
        },
    });
    return result.count;
}
