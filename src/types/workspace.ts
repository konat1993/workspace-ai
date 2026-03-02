export type MessageStatus = "streaming" | "done" | "error" | "stopped";

export type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
    status: MessageStatus;
};

export type DocumentState = {
    document: string;
    selectedText: string | null;
};

export type WorkspaceState = DocumentState & {
    messages: Message[];
    isStreaming: boolean;
};

export type WorkspaceAction =
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
    | { type: "CLEAR_MESSAGES" };
