"use client";

import { useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useWorkspace } from "@/context/workspace-context";
import { cn } from "@/lib/utils";

export function DocumentPanel() {
    const { document, selectedText, setDocument, setSelectedText } =
        useWorkspace();

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setDocument(e.target.value);
            // Clear selection when document content changes
            setSelectedText(null);
        },
        [setDocument, setSelectedText],
    );

    const handleSelect = useCallback(
        (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
            const target = e.target as HTMLTextAreaElement;
            const start = target.selectionStart;
            const end = target.selectionEnd;
            const text =
                start !== end ? target.value.slice(start, end).trim() : null;
            setSelectedText(text || null);
        },
        [setSelectedText],
    );

    return (
        <Card className="flex h-full flex-col overflow-hidden">
            <CardHeader className="shrink-0 border-b py-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">
                        Document
                    </CardTitle>
                    {selectedText !== null && selectedText !== "" && (
                        <Badge variant="secondary" className="text-xs">
                            Selection active
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-3">
                <Textarea
                    placeholder="Paste your document here…"
                    value={document}
                    onChange={handleChange}
                    onSelect={handleSelect}
                    onMouseUp={handleSelect}
                    onKeyUp={handleSelect}
                    className={cn(
                        "h-full min-h-[200px] resize-none font-mono text-sm",
                        selectedText &&
                            "ring-2 ring-primary/30 ring-offset-2 ring-offset-background",
                    )}
                    aria-label="Document content"
                />
            </CardContent>
        </Card>
    );
}
