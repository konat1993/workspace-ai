import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn, safeClipboardWriteText } from "@/lib/utils";

export const CopyButton = ({
    text,
    onSuccess,
    onError,
    children,
    className,
}: {
    text: string;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    children?: React.ReactNode;
    className?: string;
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (copied) return;
        safeClipboardWriteText({
            text,
            onSuccess: () => {
                setCopied(true);
                setTimeout(() => {
                    setCopied(false);
                }, 2000);
                toast.success("Copied to clipboard");
                onSuccess?.();
            },
            onError: (error) => {
                console.error(error);
                toast.error("Failed to copy to clipboard");
                onError?.(error);
            },
        });
    };

    return (
        <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleCopy}
            className={cn("cursor-pointer", copied && "cursor-auto", className)}
        >
            {children ||
                (copied ? (
                    <CheckIcon className="size-3" color="green" />
                ) : (
                    <CopyIcon className="size-3" />
                ))}
        </Button>
    );
};
