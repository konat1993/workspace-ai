"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWorkspace } from "@/context/workspace-context";
import { MessageBubble } from "./message-bubble";

export function MessageList() {
    const { messages } = useWorkspace();

    const bottomRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when messages or streaming content changes
    // biome-ignore lint/correctness/useExhaustiveDependencies: messages from context; re-run when list or streaming content changes
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <ScrollArea className="h-full w-full *:*:first:block!">
            <div className="flex flex-col gap-4 p-4">
                {messages.length === 0 ? (
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
