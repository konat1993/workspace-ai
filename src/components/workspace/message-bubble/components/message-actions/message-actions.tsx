import { BookCopy, Copy, ScanText, Settings } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWorkspace } from "@/context/workspace-context";
import { safeClipboardWriteText } from "@/lib/utils";
import type { Message } from "@/types/workspace";
import { SystemPromptDialogBody } from "../system-prompt-dialog-body";

export const UserMessageActions = ({
    message,
    systemPromptOpen,
    setSystemPromptOpen,
}: {
    message: Message;
    systemPromptOpen: boolean;
    setSystemPromptOpen: (open: boolean) => void;
}) => {
    const { setDocument } = useWorkspace();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon-xs"
                    className="p-0 text-foreground shrink-0"
                    aria-label="Message actions"
                >
                    <Settings className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" sideOffset={4}>
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        onClick={() => {
                            safeClipboardWriteText({
                                text: message.content,
                                onSuccess: () =>
                                    toast.success("Copied to clipboard"),
                                onError: () => toast.error("Failed to copy"),
                            });
                        }}
                    >
                        Copy
                        <DropdownMenuShortcut>
                            <Copy className="size-4" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <Dialog
                        open={systemPromptOpen}
                        onOpenChange={setSystemPromptOpen}
                    >
                        <DialogTrigger asChild>
                            <DropdownMenuItem
                                onSelect={(e: Event) => {
                                    e.preventDefault();
                                    setSystemPromptOpen(true);
                                }}
                            >
                                See system for this prompt
                                <DropdownMenuShortcut>
                                    <ScanText className="size-4" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DialogTrigger>
                        <SystemPromptDialogBody
                            systemPromptId={message.systemPromptId}
                            open={systemPromptOpen}
                            onPutToDocument={setDocument}
                            onClose={() => setSystemPromptOpen(false)}
                        />
                    </Dialog>
                    <DropdownMenuItem
                        onClick={() => setDocument(message.content)}
                    >
                        Put to system prompt
                        <DropdownMenuShortcut>
                            <BookCopy className="size-4" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
