"use client";

import { useQuery } from "@tanstack/react-query";

const SYSTEM_PROMPT_QUERY_KEY = "system-prompt";

async function fetchSystemPrompt(id: string): Promise<string> {
    const response = await fetch(`/api/ai-chat/system-prompts/${id}`);
    if (!response.ok) {
        throw new Error("Failed to load system prompt");
    }
    const data = await response.json();
    return data.content ?? "";
}

/**
 * Fetches a system prompt by ID with caching. Only runs when `enabled` is true
 * (e.g. when the dialog is open), so we don't fetch for every message on mount.
 * Re-opening the same message's dialog uses the cache (no refetch within staleTime).
 */
export function useSystemPrompt(
    systemPromptId: string | null,
    options: { enabled: boolean },
) {
    const enabled = !!systemPromptId && options.enabled;
    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: [SYSTEM_PROMPT_QUERY_KEY, systemPromptId],
        queryFn: () => {
            if (!systemPromptId) throw new Error("Missing systemPromptId");
            return fetchSystemPrompt(systemPromptId);
        },
        enabled,
    });

    return {
        content: data ?? "",
        isLoading: enabled && (isLoading || isFetching),
        error: error ?? null,
    };
}
