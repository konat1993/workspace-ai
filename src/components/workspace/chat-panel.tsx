import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageList } from "./message-list";

export function ChatPanel() {
    return (
        <Card className="flex h-full flex-col overflow-hidden">
            <CardHeader className="shrink-0 border-b py-3">
                <CardTitle className="text-base font-medium">Chat</CardTitle>
            </CardHeader>
            <CardContent className="min-h-0 flex-1 overflow-hidden p-0">
                <MessageList />
            </CardContent>
        </Card>
    );
}
