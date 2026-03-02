import { ChatPanel } from "./chat-panel";
import { DocumentPanel } from "./document-panel";
import { PromptInput } from "./prompt-input";

export function WorkspaceLayout() {
    return (
        <div className="flex h-dvh flex-col">
            <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden p-4 md:grid-cols-2">
                <div className="min-h-0">
                    <DocumentPanel />
                </div>
                <div className="min-h-0">
                    <ChatPanel />
                </div>
            </div>
            <PromptInput />
        </div>
    );
}
