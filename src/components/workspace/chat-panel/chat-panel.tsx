import OpenAI from "openai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIModelSelect, MessageList } from "./components/";

// Lazy-fetched so missing OPENAI_API_KEY does not crash the app at module load
let cachedModels: Awaited<ReturnType<OpenAI["models"]["list"]>>["data"] = [];
try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const list = await openai.models.list();
    cachedModels = list.data.filter((m) => m.owned_by === "openai");
} catch {}

const DEFAULT_MODEL_OPTION = {
    id: "gpt-4o-mini",
    owned_by: "openai",
    created: 1687882411,
    object: "model" as const,
};

export function ChatPanel() {
    return (
        <Card className="flex h-full flex-col overflow-hidden">
            <CardHeader className="shrink-0 border-b py-3">
                <CardTitle className="text-base font-medium">
                    Chat - Open AI
                </CardTitle>
                <AIModelSelect
                    AI_Models={[...cachedModels, DEFAULT_MODEL_OPTION]}
                />
            </CardHeader>
            <CardContent className="min-h-0 flex-1 overflow-hidden p-0">
                <MessageList />
            </CardContent>
        </Card>
    );
}
