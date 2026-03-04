"use client";

import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/", label: "Home" },
    { href: "/integrated-ai", label: "Integrated AI" },
] as const;

function Logo() {
    return (
        <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-foreground no-underline"
            aria-label="AI Document Workspace home"
        >
            <span
                className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm"
                aria-hidden
            >
                AI
            </span>
            <span className="hidden sm:inline">AI Document Workspace</span>
        </Link>
    );
}

function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle theme"
                className="relative size-9"
            >
                <Sun className="size-4" aria-hidden />
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            aria-label={
                resolvedTheme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            }
            className="relative size-9"
        >
            <Sun className="size-4 scale-100 transition-transform dark:scale-0" />
            <Moon className="absolute size-4 scale-0 transition-transform dark:scale-100" />
        </Button>
    );
}

export function SiteHeader() {
    const pathname = usePathname();
    const isActive = (href: string) => pathname === href;

    return (
        <header className="sticky top-0 z-50 w-full shrink-0 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="flex h-14 items-center justify-between gap-4 px-4">
                <Logo />
                <nav className="flex items-center gap-1" aria-label="Main">
                    {navItems.map(({ href, label }) => (
                        <Button
                            key={href}
                            variant="ghost"
                            size="sm"
                            asChild
                            className={cn(isActive(href) && "bg-accent")}
                        >
                            <Link href={href}>{label}</Link>
                        </Button>
                    ))}
                </nav>
                <ThemeToggle />
            </div>
        </header>
    );
}
