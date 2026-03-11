import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const safeClipboardWriteText = async ({
    text,
    onSuccess,
    onError,
}: {
    text: string;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}): Promise<void> => {
    try {
        await navigator.clipboard.writeText(text);
        onSuccess?.();
    } catch (error) {
        onError?.(error as Error);
    }
};
