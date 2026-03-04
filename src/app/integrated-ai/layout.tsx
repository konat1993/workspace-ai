import type { Metadata } from "next";
import { Suspense } from "react";
import { Await } from "@/components/await";
import { WorkspaceProvider } from "@/context/workspace-context";
import { getAiModels } from "@/lib/get-ai-models";
import { getChatHistory } from "@/lib/workspace-messages";
import IntegratedAILoading from "./loading";

export const metadata: Metadata = {
    title: "Integrated AI | AI Document Workspace",
    description:
        "Chat with AI about your document using OpenAI or other integrated providers.",
};

export default function IntegratedAILayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const dataPromise = Promise.all([getAiModels(), getChatHistory()]);

    return (
        <Suspense fallback={<IntegratedAILoading />}>
            <Await promise={dataPromise}>
                {([initialModels, initialMessages]) => (
                    <WorkspaceProvider
                        initialModels={initialModels}
                        initialMessages={initialMessages}
                    >
                        <div className="min-h-dvh">{children}</div>
                    </WorkspaceProvider>
                )}
            </Await>
        </Suspense>
    );
}
