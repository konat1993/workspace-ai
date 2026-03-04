import { ChatPanel } from "./chat-panel";
import { DocumentPanel } from "./document-panel";
import { PromptInput } from "./prompt-input";

export function WorkspaceLayout() {
    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(140px,28vh)_1fr] gap-4 overflow-hidden p-4 md:grid-cols-2 md:grid-rows-[1fr]">
                <div className="h-full min-h-0 overflow-hidden">
                    <DocumentPanel />
                </div>
                <div className="h-full min-h-0 overflow-hidden">
                    <ChatPanel />
                </div>
            </div>
            <div className="shrink-0">
                <PromptInput />
            </div>
        </div>
    );
}
