"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Message, MessageStatus } from "@/types/workspace";

type MessageBubbleProps = {
    message: Message;
};

function statusLabel(status: MessageStatus): string {
    switch (status) {
        case "STREAMING":
            return "Streaming…";
        case "DONE":
            return "Done";
        case "ERROR":
            return "Error";
        case "STOPPED":
            return "Stopped";
        case "UNKNOWN":
            return "Unknown";
        default:
            return status;
    }
}

function statusVariant(
    status: MessageStatus,
): "default" | "secondary" | "destructive" | "outline" {
    switch (status) {
        case "STREAMING":
            return "secondary";
        case "DONE":
            return "default";
        case "ERROR":
            return "destructive";
        default:
            return "outline";
    }
}

export function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === "USER";

    return (
        <div
            className={cn(
                "flex w-full flex-col gap-1.5",
                isUser ? "items-end" : "items-start",
            )}
        >
            <div
                className={cn(
                    "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                    isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground border border-border",
                )}
            >
                {message.content ? (
                    <p className="whitespace-pre-wrap wrap-break-word">
                        {message.content}
                    </p>
                ) : message.status === "STREAMING" ? (
                    <span className="inline-flex items-center gap-1">
                        <span className="size-1.5 animate-pulse rounded-full bg-current" />
                        <span className="text-muted-foreground">Thinking…</span>
                    </span>
                ) : null}
                {message.role === "ASSISTANT" && (
                    <div className="mt-2 flex justify-end">
                        <Badge
                            variant={statusVariant(message.status)}
                            className="text-[10px] font-normal"
                        >
                            {message.status === "STREAMING" && (
                                <span className="mr-1 size-1 animate-pulse rounded-full bg-current" />
                            )}
                            {statusLabel(message.status)}
                        </Badge>
                    </div>
                )}
            </div>
        </div>
    );
}
