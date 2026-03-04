import type { ReactNode } from "react";

/**
 * Async Server Component that awaits a promise and renders children with the resolved value.
 * Use inside <Suspense> for streaming: fallback shows until the promise resolves.
 */
export async function Await<T>({
    promise,
    children,
}: {
    promise: Promise<T>;
    children: (value: T) => ReactNode;
}) {
    const data = await promise;
    return <>{children(data)}</>;
}
