"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useWorkspace } from "@/context/workspace-context";
import { cn } from "@/lib/utils";
import type { Message } from "@/types/workspace";
import { Dialog } from "../../ui/dialog";
import { UserMessageActions } from "./components/message-actions";
import { MessageContent } from "./components/message-content";
import { MessageStatusBadge } from "./components/message-status-badge";
import { SystemPromptDialogBody } from "./components/system-prompt-dialog-body";

export type MessageBubbleProps = {
    message: Message;
};

export function MessageBubble({ message }: MessageBubbleProps) {
    const { setDocument, aiModel } = useWorkspace();
    const [systemPromptOpen, setSystemPromptOpen] = useState(false);
    const isUser = message.role === "USER";

    return (
        <div
            className={cn(
                "group flex w-full flex-col gap-1.5",
                isUser ? "items-end" : "items-start",
            )}
        >
            <div
                className={cn(
                    "flex items-start gap-1 min-w-[stretch]",
                    isUser && "flex-col w-full items-end",
                )}
            >
                <div
                    className={cn(
                        "relative max-w-[85%] rounded-lg px-3 py-2 text-sm",
                        isUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground border border-border pt-5",
                    )}
                >
                    {!isUser && (
                        <>
                            {/* mb-4 removed: redundant with absolute positioning */}
                            <Badge className="absolute -top-3 left-2 text-[10px] text-muted-foreground dark:text-gray-600 bg-white border border-border">
                                {message.model || aiModel}
                            </Badge>
                        </>
                    )}
                    <MessageContent message={message} />
                    {message.role === "ASSISTANT" && (
                        <div className="mt-4 flex justify-end gap-4">
                            <MessageStatusBadge status={message.status} />
                        </div>
                    )}
                </div>
                {isUser && (
                    <div
                        className={cn(
                            "flex items-center transition-opacity",
                            "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100",
                        )}
                    >
                        <UserMessageActions
                            message={message}
                            systemPromptOpen={systemPromptOpen}
                            setSystemPromptOpen={setSystemPromptOpen}
                        />
                    </div>
                )}
            </div>
            <Dialog open={systemPromptOpen} onOpenChange={setSystemPromptOpen}>
                <SystemPromptDialogBody
                    systemPromptId={message.systemPromptId}
                    open={systemPromptOpen}
                    onPutToDocument={setDocument}
                    onClose={() => setSystemPromptOpen(false)}
                />
            </Dialog>
        </div>
    );
}
