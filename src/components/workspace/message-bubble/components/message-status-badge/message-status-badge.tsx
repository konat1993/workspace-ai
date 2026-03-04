import { Badge } from "@/components/ui/badge";
import type { MessageStatus } from "@/types/workspace";
import { statusLabel, statusVariant } from "../../utils";

export const MessageStatusBadge = ({ status }: { status: MessageStatus }) => {
    return (
        <Badge
            variant={statusVariant(status)}
            className="text-[10px] font-normal"
        >
            {status === "STREAMING" && (
                <span className="mr-1 size-1 animate-pulse rounded-full bg-current" />
            )}
            {statusLabel(status)}
        </Badge>
    );
};
