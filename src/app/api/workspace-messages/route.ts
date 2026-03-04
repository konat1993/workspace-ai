import { getChatHistory } from "@/lib/workspace-messages";

export const dynamic = "force-dynamic";

export async function GET() {
    const messages = await getChatHistory();
    return Response.json(messages);
}
