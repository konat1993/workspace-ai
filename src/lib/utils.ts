import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const safeClipboardWriteText = async (
    text: string,
    callback?: () => void | Promise<void>,
) => {
    await navigator.clipboard
        .writeText(text)
        .then(callback ?? (() => {}))
        .catch(() => {});
};
