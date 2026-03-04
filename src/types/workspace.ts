import type { Prisma } from "@/generated/prisma/client";

export type MessageStatus =
    | "UNKNOWN"
    | "STREAMING"
    | "DONE"
    | "ERROR"
    | "STOPPED";
export type MessageRole = "USER" | "ASSISTANT";

export type WorkspaceVariant = "SIMULATED" | "INTEGRATED";

export type Message = Omit<Prisma.MessageModel, "createdAt" | "updatedAt"> & {
    createdAt?: Date;
    updatedAt?: Date;
};

export type DocumentState = {
    document: string;
    selectedText: string | null;
};

export type WorkspaceState = DocumentState & {
    messages: Message[];
    isStreaming: boolean;
    /** True while initial messages are being fetched from the server. */
    messagesLoading: boolean;
    /** Error message when loading messages from the server failed. */
    messagesError: string | null;
    aiModel: string;
};

export type WorkspaceAction =
    // | { type: "SET_VARIANT"; payload: WorkspaceVariant }
    | { type: "SET_DOCUMENT"; payload: string }
    | { type: "SET_SELECTED_TEXT"; payload: string | null }
    | { type: "ADD_MESSAGE"; payload: Message }
    | {
          type: "UPDATE_MESSAGE";
          payload: { id: string; content?: string; status?: MessageStatus };
      }
    | { type: "REPLACE_LAST_ASSISTANT"; payload: Message }
    | { type: "REMOVE_LAST_USER_AND_ASSISTANT" }
    | { type: "SET_STREAMING"; payload: boolean }
    | { type: "CLEAR_MESSAGES" }
    | { type: "SET_MESSAGES"; payload: Message[] }
    | { type: "SET_MESSAGES_LOADING"; payload: boolean }
    | { type: "SET_MESSAGES_ERROR"; payload: string | null }
    | { type: "SET_AI_MODEL"; payload: string };
