"use client";

import { useCallback, useRef } from "react";
import { useWorkspace } from "@/context/workspace-context";
import type { Message } from "@/types/workspace";

function generateId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useAIStream() {
    const {
        document,
        selectedText,
        messages,
        isStreaming,
        addMessage,
        updateMessage,
        removeLastUserAndAssistant,
        setStreaming,
    } = useWorkspace();

    const abortControllerRef = useRef<AbortController | null>(null);

    const stop = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    }, []);

    const sendMessage = useCallback(
        async (userPrompt: string) => {
            const trimmedPrompt = userPrompt.trim();
            if (!trimmedPrompt || isStreaming) return;

            const userMessage: Message = {
                id: generateId(),
                role: "user",
                content: trimmedPrompt,
                status: "done",
            };
            addMessage(userMessage);

            const assistantId = generateId();
            const assistantMessage: Message = {
                id: assistantId,
                role: "assistant",
                content: "",
                status: "streaming",
            };
            addMessage(assistantMessage);
            setStreaming(true);

            const controller = new AbortController();
            abortControllerRef.current = controller;

            let content = "";
            try {
                const res = await fetch("/api/ai", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        document,
                        selectedText: selectedText || undefined,
                        userPrompt: trimmedPrompt,
                    }),
                    signal: controller.signal,
                });

                if (!res.ok || !res.body) {
                    const errText = await res
                        .text()
                        .catch(() => "Unknown error");
                    updateMessage(assistantId, {
                        content: `Error: ${res.status} — ${errText}`,
                        status: "error",
                    });
                    return;
                }

                const reader = res.body.getReader();
                const decoder = new TextDecoder();

                while (true) {
                    const { done, value } = await reader.read();

                    if (done) break;
                    content += decoder.decode(value, { stream: true });
                    updateMessage(assistantId, {
                        content,
                        status: "streaming",
                    });
                }

                updateMessage(assistantId, { content, status: "done" });
            } catch (err) {
                const isAbort =
                    err instanceof Error && err.name === "AbortError";
                updateMessage(assistantId, {
                    content: isAbort
                        ? content || "Generation stopped."
                        : `Error: ${err instanceof Error ? err.message : String(err)}`,
                    status: isAbort ? "stopped" : "error",
                });
            } finally {
                abortControllerRef.current = null;
                setStreaming(false);
            }
        },
        [
            document,
            selectedText,
            isStreaming,
            addMessage,
            updateMessage,
            setStreaming,
        ],
    );

    /** Re-run last user message and replace last assistant reply */
    const regenerate = useCallback(() => {
        if (messages.length < 2 || isStreaming) return;
        const lastUser = messages[messages.length - 2];
        if (lastUser.role !== "user") return;
        removeLastUserAndAssistant();
        sendMessage(lastUser.content);
    }, [messages, isStreaming, removeLastUserAndAssistant, sendMessage]);

    return {
        sendMessage,
        stop,
        regenerate,
        isStreaming,
        canRegenerate:
            !isStreaming &&
            messages.length >= 2 &&
            messages[messages.length - 1]?.role === "assistant",
    };
}
