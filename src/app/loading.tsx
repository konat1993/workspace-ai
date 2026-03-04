import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div
            className="flex min-h-dvh items-center justify-center"
            aria-busy="true"
        >
            <Loader2
                className="size-8 animate-spin text-muted-foreground"
                aria-hidden
            />
        </div>
    );
}
