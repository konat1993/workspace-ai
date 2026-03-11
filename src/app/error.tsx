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
        <div className="flex min-h-[calc(100dvh-100px)] flex-col items-center justify-center gap-4 p-4">
            <AlertCircle className="size-12 text-destructive" aria-hidden />
            <h2 className="text-lg font-semibold">Something went wrong</h2>
            <div className="max-h-2/4 overflow-y-auto w-2/3">
                <p className="text-muted-foreground text-center text-sm md:text-lg wrap-anywhere bg-muted/40 rounded-lg font-bold p-8">
                    {error.message || "An unexpected error occurred."}
                </p>
            </div>
            <Button
                onClick={reset}
                size="lg"
                variant="outline"
                className="text-lg mt-4"
            >
                Try again
            </Button>
        </div>
    );
}
