export type MessageStatus =
    | "UNKNOWN"
    | "STREAMING"
    | "DONE"
    | "ERROR"
    | "STOPPED";
export type MessageRole = "USER" | "ASSISTANT";

export type WorkspaceVariant = "SIMULATED" | "INTEGRATED";

export type Message = {
    id: string;
    role: MessageRole;
    content: string;
    status: MessageStatus;
    workspaceVariant: WorkspaceVariant;
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
    | { type: "SET_MESSAGES_LOADING"; payload: boolean };
