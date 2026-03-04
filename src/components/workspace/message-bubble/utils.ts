import type { MessageStatus } from "@/types/workspace";

export function statusLabel(status: MessageStatus): string {
    switch (status) {
        case "STREAMING":
            return "Streaming…";
        case "DONE":
            return "Done";
        case "ERROR":
            return "Error";
        case "STOPPED":
            return "Stopped";
        case "UNKNOWN":
            return "Unknown";
        default:
            return status;
    }
}

export function statusVariant(
    status: MessageStatus,
): "default" | "secondary" | "destructive" | "outline" {
    switch (status) {
        case "STREAMING":
            return "secondary";
        case "DONE":
            return "default";
        case "ERROR":
            return "destructive";
        default:
            return "outline";
    }
}
