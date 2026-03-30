import { ArrowRightCircle } from "lucide-react";
import Link from "next/link";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default function Home() {
    return (
        <div className="flex flex-col gap-4 p-4 items-center justify-center h-screen">
            <h1 className="text-4xl font-bold text-center">
                AI Document Workspace
            </h1>
            <div className="flex flex-col gap-2 text-center">
                <p className="text-lg text-gray-500">
                    This is a workspace for AI document analysis and question
                    answering.
                </p>
                <p className="text-lg text-gray-500">
                    Choose a workspace configuration to get started:
                </p>
            </div>
            <div className="flex gap-4 flex-col">
                <Link href="/ai-chat">
                    <Card className="min-w-3xs p-4 hover:scale-105 hover:bg-accent transition-all">
                        <div className="flex gap-2 items-center justify-between">
                            <div className="flex flex-col gap-2">
                                <CardTitle>AI Chat</CardTitle>
                                <CardDescription>
                                    OpenAI and other providers via the app API.
                                </CardDescription>
                            </div>
                            <ArrowRightCircle className="size-6" />
                        </div>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
