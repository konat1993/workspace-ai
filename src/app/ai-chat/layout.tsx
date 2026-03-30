import type { Metadata } from "next";
import { Suspense } from "react";
import { Await } from "@/components/await";
import { WorkspaceProvider } from "@/context/workspace-context";
import { getAiModels } from "@/lib/get-ai-models";
import { getChatHistory } from "@/lib/workspace-messages";
import AiChatLoading from "./loading";

export const metadata: Metadata = {
    title: "AI Chat | AI Document Workspace",
    description:
        "Chat with AI about your document using OpenAI or other integrated providers.",
};

export default function AiChatLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const dataPromise = Promise.all([getAiModels(), getChatHistory()]);

    return (
        <div className="relative min-h-0 flex-1">
            <div className="absolute inset-0 flex flex-col">
                <Suspense fallback={<AiChatLoading />}>
                    <Await promise={dataPromise}>
                        {([initialModels, initialMessages]) => (
                            <div className="flex h-full flex-col">
                                <WorkspaceProvider
                                    initialModels={initialModels}
                                    initialMessages={initialMessages}
                                >
                                    <div className="flex h-full flex-1 flex-col">
                                        {children}
                                    </div>
                                </WorkspaceProvider>
                            </div>
                        )}
                    </Await>
                </Suspense>
            </div>
        </div>
    );
}
