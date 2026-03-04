import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-4">
            <h1 className="text-2xl font-semibold">404</h1>
            <p className="text-muted-foreground text-center text-sm">
                This page could not be found.
            </p>
            <Button asChild variant="outline">
                <Link href="/">Back home</Link>
            </Button>
        </div>
    );
}
