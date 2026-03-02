"use client";

import {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useMemo,
    useReducer,
} from "react";
import type {
    Message,
    WorkspaceAction,
    WorkspaceState,
} from "@/types/workspace";

const initialState: WorkspaceState = {
    document: "",
    selectedText: null,
    messages: [],
    isStreaming: false,
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
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(workspaceReducer, initialState);

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

    const value = useMemo<WorkspaceContextValue>(
        () => ({
            ...state,
            dispatch,
            setDocument,
            setSelectedText,
            addMessage,
            updateMessage,
            replaceLastAssistant,
            removeLastUserAndAssistant,
            setStreaming,
            clearMessages,
        }),
        [
            state,
            setDocument,
            setSelectedText,
            addMessage,
            updateMessage,
            replaceLastAssistant,
            removeLastUserAndAssistant,
            setStreaming,
            clearMessages,
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
