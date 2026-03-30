import { Loader2 } from "lucide-react";

export default function AiChatLoading() {
    return (
        <div
            className="flex h-full items-center justify-center"
            aria-busy="true"
        >
            <Loader2
                className="size-8 animate-spin text-muted-foreground"
                aria-hidden
            />
        </div>
    );
}
