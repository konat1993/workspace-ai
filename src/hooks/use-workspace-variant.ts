import { usePathname } from "next/navigation";
import type { WorkspaceVariant } from "@/types/workspace";

const INTEGRATED_PATH = "/integrated-ai";

export function useWorkspaceVariant(): WorkspaceVariant | undefined {
    const pathname = usePathname();
    return pathname === INTEGRATED_PATH ? "INTEGRATED" : undefined;
}
