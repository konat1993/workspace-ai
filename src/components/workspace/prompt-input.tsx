"use client";

import { RefreshCw, Send, Square } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWorkspace } from "@/context/workspace-context";
import { useAIStream } from "@/hooks/use-ai-stream";
import { useWorkspaceVariant } from "@/hooks/use-workspace-variant";

export function PromptInput() {
    const [prompt, setPrompt] = useState("");
    const { sendMessage, stop, regenerate, isStreaming, canRegenerate } =
        useAIStream();
    const { selectedText, document } = useWorkspace();
    const workspaceVariant = useWorkspaceVariant();

    const handleSubmit = useCallback(
        (e: React.SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!prompt.trim() || isStreaming || !workspaceVariant) return;
            sendMessage({ userPrompt: prompt, workspaceVariant });
            setPrompt("");
        },
        [prompt, isStreaming, sendMessage, workspaceVariant],
    );

    const isEmptyDoc = useMemo(() => {
        return !selectedText && document.trim().length === 0;
    }, [document, selectedText]);

    return (
        <div className="flex flex-col gap-2 border-t p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ask about your document…"
                    disabled={isStreaming}
                    className="flex-1"
                    aria-label="Message"
                />
                {isStreaming ? (
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={stop}
                        aria-label="Stop generation"
                    >
                        <Square className="size-4" />
                    </Button>
                ) : (
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!prompt.trim() || isEmptyDoc}
                        aria-label="Send"
                    >
                        <Send className="size-4" />
                    </Button>
                )}
            </form>
            {canRegenerate && workspaceVariant && (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="self-start"
                    onClick={() => regenerate({ workspaceVariant })}
                >
                    <RefreshCw className="mr-1.5 size-3.5" />
                    Regenerate last response
                </Button>
            )}
        </div>
    );
}
