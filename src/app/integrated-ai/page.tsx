import { WorkspaceLayout } from "@/components/workspace/workspace-layout";
import { WorkspaceProvider } from "@/context/workspace-context";

export default function IntegratedAIPage() {
    return (
        <div className="min-h-dvh">
            <WorkspaceProvider>
                <WorkspaceLayout />
            </WorkspaceProvider>
        </div>
    );
}
