import { cn } from "@/lib/utils";
import type { Message } from "@/types/workspace";

export const MessageContent = ({ message }: { message: Message }) => {
    if (message.content) {
        return (
            <p className={cn("whitespace-pre-wrap wrap-break-word")}>
                {message.content}
            </p>
        );
    }
    if (message.status === "STREAMING") {
        return (
            <span className="inline-flex items-center gap-1">
                <span className="size-1.5 animate-pulse rounded-full bg-current" />
                <span className="text-muted-foreground">Thinking…</span>
            </span>
        );
    }
    return null;
};
