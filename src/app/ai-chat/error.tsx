"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AiChatError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-4">
            <AlertCircle className="size-12 text-destructive" aria-hidden />
            <h2 className="text-lg font-semibold">Workspace error</h2>
            <p className="text-muted-foreground text-center text-sm">
                {error.message || "Failed to load the workspace."}
            </p>
            <div className="flex gap-2">
                <Button onClick={reset} variant="outline">
                    Try again
                </Button>
                <Button asChild variant="secondary">
                    <Link href="/">Back home</Link>
                </Button>
            </div>
        </div>
    );
}
