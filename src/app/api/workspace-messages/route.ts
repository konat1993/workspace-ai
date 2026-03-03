import type { NextRequest } from "next/server";
import { getChatHistory } from "@/lib/workspace-messages";

export async function GET(request: NextRequest) {
    const variantParam = request.nextUrl.searchParams.get("variant");
    if (variantParam?.toLowerCase() !== "integrated") {
        return new Response(
            JSON.stringify({
                error: "variant must be 'integrated'",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } },
        );
    }

    const messages = await getChatHistory("INTEGRATED");
    return Response.json(messages);
}
