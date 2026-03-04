import OpenAI from "openai";
import type { Model } from "openai/resources/models.mjs";

const DEFAULT_MODEL: Model = {
    id: "gpt-4o-mini",
    owned_by: "openai",
    created: 1687882411,
    object: "model",
};

/**
 * Fetches available OpenAI models on the server. Safe to call from Server Components
 * and API routes. Uses OPENAI_API_KEY from env (server-only).
 */
export async function getAiModels(): Promise<Model[]> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return [DEFAULT_MODEL];
    try {
        const openai = new OpenAI({ apiKey });
        const { data } = await openai.models.list();
        const ownedByOpenAI = data.filter((m) => m.owned_by === "openai");
        return ownedByOpenAI.length > 0
            ? [...ownedByOpenAI, DEFAULT_MODEL]
            : [DEFAULT_MODEL];
    } catch {
        return [DEFAULT_MODEL];
    }
}
