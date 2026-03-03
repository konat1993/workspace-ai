import prisma from "@/lib/db";
import type { Message, WorkspaceVariant } from "@/types/workspace";

const variantToEnum = (variant: WorkspaceVariant): "SIMULATED" | "INTEGRATED" =>
    variant;

function toAppMessage(row: {
    id: string;
    role: Message["role"];
    content: string;
    status: Message["status"];
    workspaceVariant: WorkspaceVariant;
}): Message {
    return {
        id: row.id,
        role: row.role,
        content: row.content,
        status: row.status,
        workspaceVariant: row.workspaceVariant,
    };
}

export async function getChatHistory(
    workspaceVariant: WorkspaceVariant,
): Promise<Message[]> {
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    const rows = await prisma.message.findMany({
        where: { workspaceVariant: variantToEnum(workspaceVariant) },
        orderBy: { createdAt: "asc" },
    });
    return rows.map(toAppMessage);
}

export async function addMessage(
    workspaceVariant: WorkspaceVariant,
    message: Omit<Message, "id" | "workspaceVariant"> & { id?: string },
): Promise<Message> {
    const created = await prisma.message.create({
        data: {
            role: message.role,
            content: message.content,
            status: message.status,
            workspaceVariant: variantToEnum(workspaceVariant),
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

export async function deleteMessagesByVariant(
    workspaceVariant: WorkspaceVariant,
): Promise<number> {
    const result = await prisma.message.deleteMany({
        where: { workspaceVariant: variantToEnum(workspaceVariant) },
    });
    return result.count;
}
