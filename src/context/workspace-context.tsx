"use client";

import type { Model } from "openai/resources/models.mjs";
import {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useMemo,
    useReducer,
} from "react";
import { fetchWorkspaceMessages } from "@/lib/fetch-workspace-messages";
import type {
    Message,
    WorkspaceAction,
    WorkspaceState,
} from "@/types/workspace";

const AI_MODEL_STORAGE_KEY = "workspace-ai-model";

function getStoredAiModel(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(AI_MODEL_STORAGE_KEY);
}

// Start with messagesLoading true so workspace pages (e.g. /integrated-ai) show skeleton on first paint instead of flashing empty state
const initialState: WorkspaceState = {
    document: "",
    selectedText: null,
    messages: [],
    isStreaming: false,
    messagesLoading: true,
    messagesError: null,
    aiModel: "gpt-4o-mini",
};

function workspaceReducer(
    state: WorkspaceState,
    action: WorkspaceAction,
): WorkspaceState {
    switch (action.type) {
        case "SET_DOCUMENT":
            return { ...state, document: action.payload };
        case "SET_SELECTED_TEXT":
            return { ...state, selectedText: action.payload };
        case "ADD_MESSAGE":
            return { ...state, messages: [...state.messages, action.payload] };
        case "SET_MESSAGES":
            return {
                ...state,
                messages: action.payload,
                messagesLoading: false,
            };
        case "SET_MESSAGES_LOADING":
            return { ...state, messagesLoading: action.payload };
        case "SET_MESSAGES_ERROR":
            return { ...state, messagesError: action.payload };
        case "UPDATE_MESSAGE": {
            const { id, content, status } = action.payload;
            return {
                ...state,
                messages: state.messages.map((m) =>
                    m.id === id
                        ? {
                              ...m,
                              ...(typeof content === "string" && { content }),
                              ...(status !== undefined && { status }),
                          }
                        : m,
                ),
            };
        }
        case "SET_AI_MODEL":
            return { ...state, aiModel: action.payload };
        case "REPLACE_LAST_ASSISTANT":
            return {
                ...state,
                messages: state.messages.slice(0, -1).concat(action.payload),
            };
        case "REMOVE_LAST_USER_AND_ASSISTANT":
            return {
                ...state,
                messages: state.messages.slice(0, -2),
            };
        case "SET_STREAMING":
            return { ...state, isStreaming: action.payload };
        case "CLEAR_MESSAGES":
            return { ...state, messages: [] };
        default:
            return state;
    }
}

type WorkspaceContextValue = WorkspaceState & {
    /** AI models list from server (passed from layout). */
    aiModels: Model[];
    dispatch: React.Dispatch<WorkspaceAction>;
    setDocument: (document: string) => void;
    setSelectedText: (text: string | null) => void;
    addMessage: (message: Message) => void;
    updateMessage: (
        id: string,
        updates: { content?: string; status?: Message["status"] },
    ) => void;
    replaceLastAssistant: (message: Message) => void;
    removeLastUserAndAssistant: () => void;
    setStreaming: (isStreaming: boolean) => void;
    clearMessages: () => void;
    refetchMessages: () => void;
    setAiModel: (aiModel: string) => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

function getInitialWorkspaceState(initialMessages?: Message[]): WorkspaceState {
    const stored = getStoredAiModel();
    return {
        ...initialState,
        messages: initialMessages ?? [],
        messagesLoading: initialMessages === undefined,
        aiModel: stored ?? initialState.aiModel,
    };
}

export function WorkspaceProvider({
    children,
    initialModels = [],
    initialMessages,
}: {
    children: ReactNode;
    initialModels: Model[];
    initialMessages: Message[];
}) {
    const [state, dispatch] = useReducer(
        workspaceReducer,
        getInitialWorkspaceState(initialMessages),
    );

    const setDocument = useCallback((document: string) => {
        dispatch({ type: "SET_DOCUMENT", payload: document });
    }, []);

    const setSelectedText = useCallback((selectedText: string | null) => {
        dispatch({ type: "SET_SELECTED_TEXT", payload: selectedText });
    }, []);

    const addMessage = useCallback((message: Message) => {
        dispatch({ type: "ADD_MESSAGE", payload: message });
    }, []);

    const updateMessage = useCallback(
        (
            id: string,
            updates: { content?: string; status?: Message["status"] },
        ) => {
            dispatch({
                type: "UPDATE_MESSAGE",
                payload: { id, ...updates },
            });
        },
        [],
    );

    const setAiModel = useCallback((aiModel: string) => {
        if (typeof window !== "undefined") {
            localStorage.setItem(AI_MODEL_STORAGE_KEY, aiModel);
        }
        dispatch({ type: "SET_AI_MODEL", payload: aiModel });
    }, []);

    const replaceLastAssistant = useCallback((message: Message) => {
        dispatch({ type: "REPLACE_LAST_ASSISTANT", payload: message });
    }, []);

    const removeLastUserAndAssistant = useCallback(() => {
        dispatch({ type: "REMOVE_LAST_USER_AND_ASSISTANT" });
    }, []);

    const setStreaming = useCallback((isStreaming: boolean) => {
        dispatch({ type: "SET_STREAMING", payload: isStreaming });
    }, []);

    const clearMessages = useCallback(() => {
        dispatch({ type: "CLEAR_MESSAGES" });
    }, []);

    const refetchMessages = useCallback(() => {
        dispatch({ type: "SET_MESSAGES_LOADING", payload: true });
        fetchWorkspaceMessages(dispatch);
    }, []);

    const value = useMemo<WorkspaceContextValue>(
        () => ({
            ...state,
            aiModels: initialModels,
            dispatch,
            setDocument,
            setSelectedText,
            addMessage,
            updateMessage,
            setAiModel,
            replaceLastAssistant,
            removeLastUserAndAssistant,
            setStreaming,
            clearMessages,
            refetchMessages,
        }),
        [
            state,
            initialModels,
            setDocument,
            setSelectedText,
            addMessage,
            updateMessage,
            setAiModel,
            replaceLastAssistant,
            removeLastUserAndAssistant,
            setStreaming,
            clearMessages,
            refetchMessages,
        ],
    );

    return (
        <WorkspaceContext.Provider value={value}>
            {children}
        </WorkspaceContext.Provider>
    );
}

export function useWorkspace(): WorkspaceContextValue {
    const ctx = useContext(WorkspaceContext);
    if (!ctx) {
        throw new Error("useWorkspace must be used within WorkspaceProvider");
    }
    return ctx;
}
