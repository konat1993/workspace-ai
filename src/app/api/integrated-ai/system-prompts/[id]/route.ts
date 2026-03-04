import type { NextRequest } from "next/server";
import prisma from "@/lib/db";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;

    const systemPrompt = await prisma.systemPrompt.findUnique({
        where: { id },
    });

    return Response.json({ content: systemPrompt?.content });
}
