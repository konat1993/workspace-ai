import type { Dispatch } from "react";
import type { Message, WorkspaceAction } from "@/types/workspace";

const WORKSPACE_MESSAGES_API = "/api/workspace-messages";

export function fetchWorkspaceMessages(
    dispatch: Dispatch<WorkspaceAction>,
): () => void {
    dispatch({ type: "SET_MESSAGES_LOADING", payload: true });
    dispatch({ type: "SET_MESSAGES_ERROR", payload: null });
    const ac = new AbortController();
    fetch(WORKSPACE_MESSAGES_API, {
        signal: ac.signal,
    })
        .then(async (res) => {
            if (ac.signal.aborted) return;
            if (!res.ok) {
                const errBody = await res
                    .json()
                    .catch(() => ({ error: res.statusText }));
                const message =
                    typeof errBody?.error === "string"
                        ? errBody.error
                        : res.statusText || "Failed to load messages";
                dispatch({
                    type: "SET_MESSAGES_ERROR",
                    payload: message,
                });
                dispatch({ type: "SET_MESSAGES", payload: [] });
                return;
            }
            const data: Message[] = await res.json();
            if (ac.signal.aborted) return;
            dispatch({
                type: "SET_MESSAGES",
                payload: Array.isArray(data) ? data : [],
            });
        })
        .catch(() => {
            if (!ac.signal.aborted) {
                dispatch({
                    type: "SET_MESSAGES_ERROR",
                    payload: "Failed to load messages",
                });
                dispatch({ type: "SET_MESSAGES", payload: [] });
            }
        });
    return () => ac.abort();
}
