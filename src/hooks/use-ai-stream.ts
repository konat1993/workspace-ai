"use client";

import { useCallback, useRef } from "react";
import { useWorkspace } from "@/context/workspace-context";
import type { Message, WorkspaceVariant } from "@/types/workspace";

function generateId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const INTEGRATED_AI_API = "/api/integrated-ai";

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
        async ({
            userPrompt,
            workspaceVariant: variant,
        }: {
            userPrompt: string;
            workspaceVariant: WorkspaceVariant;
        }) => {
            const trimmedPrompt = userPrompt.trim();
            if (!trimmedPrompt || isStreaming) return;

            const userMessage: Message = {
                id: generateId(),
                role: "USER",
                content: trimmedPrompt,
                status: "UNKNOWN",
                workspaceVariant: variant,
            };
            addMessage(userMessage);

            const assistantId = generateId();
            const assistantMessage: Message = {
                id: assistantId,
                role: "ASSISTANT",
                content: "",
                status: "STREAMING",
                workspaceVariant: variant,
            };
            addMessage(assistantMessage);
            setStreaming(true);

            const controller = new AbortController();
            abortControllerRef.current = controller;

            let content = "";
            try {
                const res = await fetch(INTEGRATED_AI_API, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        document,
                        selectedText: selectedText || undefined,
                        userPrompt: trimmedPrompt,
                        workspaceVariant: variant,
                    }),
                    signal: controller.signal,
                });

                if (!res.ok || !res.body) {
                    const errText = await res
                        .text()
                        .catch(() => "Unknown error");
                    updateMessage(assistantId, {
                        content: `Error: ${res.status} — ${errText}`,
                        status: "ERROR",
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
                        status: "STREAMING",
                    });
                }

                updateMessage(assistantId, { content, status: "DONE" });
            } catch (err) {
                const isAbort =
                    err instanceof Error && err.name === "AbortError";
                updateMessage(assistantId, {
                    content: isAbort
                        ? content || "Generation stopped."
                        : `Error: ${err instanceof Error ? err.message : String(err)}`,
                    status: isAbort ? "STOPPED" : "ERROR",
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
    const regenerate = useCallback(
        ({
            workspaceVariant: variant,
        }: {
            workspaceVariant: WorkspaceVariant;
        }) => {
            if (messages.length < 2 || isStreaming) return;
            const lastUser = messages[messages.length - 2];
            if (lastUser.role !== "USER") return;
            removeLastUserAndAssistant();
            sendMessage({
                userPrompt: lastUser.content,
                workspaceVariant: variant,
            });
        },
        [messages, isStreaming, removeLastUserAndAssistant, sendMessage],
    );

    return {
        sendMessage,
        stop,
        regenerate,
        isStreaming,
        canRegenerate:
            !isStreaming &&
            messages.length >= 2 &&
            messages[messages.length - 1]?.role === "ASSISTANT",
    };
}
