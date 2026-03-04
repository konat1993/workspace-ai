import type { WorkspaceVariant } from "@/types/workspace";

/** Runtime list of valid workspace variants – single source of truth for parsing. Add new variants here when introducing them (e.g. AI_SDK). */
export const WORKSPACE_VARIANTS: readonly WorkspaceVariant[] = [
    "SIMULATED",
    "INTEGRATED",
];

export function parseWorkspaceVariant(value: unknown): WorkspaceVariant | null {
    const s = typeof value === "string" ? value.toUpperCase() : null;
    if (!s) return null;
    return (WORKSPACE_VARIANTS as readonly string[]).includes(s)
        ? (s as WorkspaceVariant)
        : null;
}
