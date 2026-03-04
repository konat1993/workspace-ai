"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEFAULT_MODEL } from "@/consts";
import { useWorkspace } from "@/context/workspace-context";
import { AIModelSelect, MessageList } from "./components/";

export function ChatPanel() {
    const { aiModels } = useWorkspace();
    const modelList = aiModels.length > 0 ? aiModels : [DEFAULT_MODEL];

    return (
        <Card className="flex h-full flex-col overflow-hidden">
            <CardHeader className="shrink-0 border-b py-3">
                <CardTitle className="text-base font-medium">
                    Chat - Open AI
                </CardTitle>
                <AIModelSelect AI_Models={modelList} />
            </CardHeader>
            <CardContent className="min-h-0 flex-1 overflow-hidden p-0">
                <MessageList />
            </CardContent>
        </Card>
    );
}
