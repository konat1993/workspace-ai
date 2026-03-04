import { Check, Copy, Loader2, NotebookPen } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSystemPrompt } from "@/hooks/use-system-prompt";
import { cn, safeClipboardWriteText } from "@/lib/utils";

export const SystemPromptDialogBody = ({
    systemPromptId,
    open,
    onPutToDocument,
    onClose,
}: {
    systemPromptId: string | null;
    open: boolean;
    onPutToDocument: (content: string) => void;
    onClose: () => void;
}) => {
    const { content, isLoading, error } = useSystemPrompt(systemPromptId, {
        enabled: open,
    });
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        // navigator.clipboard
        //     .writeText(content)
        //     .then(() => {
        //         setCopied(true);
        //         setTimeout(() => setCopied(false), 2000);
        //     })
        //     .catch(() => {});
        safeClipboardWriteText(content, () => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handlePutToDocument = () => {
        onPutToDocument(content);
        onClose();
    };

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>System Prompt</DialogTitle>
                <DialogDescription>
                    See the system prompt for this user prompt.
                </DialogDescription>
            </DialogHeader>
            {isLoading ? (
                <div className="flex justify-center">
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                </div>
            ) : error ? (
                <p className="text-destructive text-sm">
                    Failed to load system prompt.
                </p>
            ) : (
                <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
                    <div className="flex justify-end items-center gap-2 my-2">
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon-xs"
                                    className={cn(copied && "cursor-auto")}
                                    onClick={handleCopy}
                                >
                                    {copied ? (
                                        <Check
                                            className="size-4"
                                            color="green"
                                        />
                                    ) : (
                                        <Copy className="size-4" />
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent sideOffset={6}>
                                <p>Copy system prompt</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={handlePutToDocument}
                                >
                                    <NotebookPen className="size-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent sideOffset={6}>
                                <p>Put system prompt to document</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <p className="mb-4 leading-normal">
                        {content === "" ? "System prompt was empty." : content}
                    </p>
                </div>
            )}
        </DialogContent>
    );
};
