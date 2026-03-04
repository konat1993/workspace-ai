"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWorkspace } from "@/context/workspace-context";
import { MessageBubble } from "../../../message-bubble";

function ChatLoadingSkeleton() {
    return (
        <div className="flex flex-col gap-4 p-4" aria-busy="true">
            <div className="flex justify-end">
                <div className="h-10 w-3/4 max-w-sm rounded-lg bg-muted animate-pulse" />
            </div>
            <div className="flex justify-start">
                <div className="h-16 w-4/5 max-w-md rounded-lg bg-muted animate-pulse" />
            </div>
            <div className="flex justify-center py-2">
                <Loader2
                    className="size-5 animate-spin text-muted-foreground"
                    aria-hidden
                />
            </div>
        </div>
    );
}

export function MessageList() {
    const { messages, messagesLoading, messagesError } = useWorkspace();
    const bottomRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when messages or streaming content changes
    // biome-ignore lint/correctness/useExhaustiveDependencies: messages from context; re-run when list or streaming content changes
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Only show skeleton on initial load (no messages yet). When refetching after
    // stream ends, keep showing the list so the scroll container isn't unmounted
    // and scroll position is preserved.
    if (messagesLoading && messages.length === 0) {
        return (
            <ScrollArea className="h-full w-full *:*:first:block!">
                <ChatLoadingSkeleton />
            </ScrollArea>
        );
    }

    return (
        <ScrollArea className="h-full w-full *:*:first:block!">
            <div className="flex flex-col gap-4 p-4">
                {/* TODO: Implement toast notification for errors */}
                {messagesError ? (
                    <p
                        className="text-destructive text-center text-sm"
                        role="alert"
                    >
                        {messagesError}
                    </p>
                ) : messages.length === 0 ? (
                    <p className="text-muted-foreground text-center text-sm">
                        Ask a question about your document. Select text to focus
                        the AI on a specific fragment.
                    </p>
                ) : (
                    messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))
                )}
                <div ref={bottomRef} aria-hidden />
            </div>
        </ScrollArea>
    );
}
