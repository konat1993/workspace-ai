"use client";

import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
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
            <h2 className="text-lg font-semibold">Something went wrong</h2>
            <p className="text-muted-foreground text-center text-sm">
                {error.message || "An unexpected error occurred."}
            </p>
            <Button onClick={reset} variant="outline">
                Try again
            </Button>
        </div>
    );
}
