import { NextResponse } from "next/server";
import { getAiModels } from "@/lib/get-ai-models";

export const dynamic = "force-dynamic";

export async function GET() {
    const models = await getAiModels();
    const defaultId = models[0]?.id ?? "gpt-4o-mini";
    return NextResponse.json(
        { models, default: defaultId },
        { headers: { "Cache-Control": "private, s-maxage=300" } },
    );
}
