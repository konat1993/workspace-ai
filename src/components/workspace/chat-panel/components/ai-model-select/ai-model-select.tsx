"use client";

import type { Page } from "openai/pagination";
import type { Model } from "openai/resources/models.mjs";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox";
import { useWorkspace } from "@/context/workspace-context";

export const AIModelSelect = ({
    AI_Models,
}: {
    AI_Models: Page<Model>["data"];
}) => {
    const { aiModel, setAiModel } = useWorkspace();

    return (
        <Combobox
            defaultValue={aiModel}
            value={aiModel}
            onValueChange={(value) => {
                setAiModel(value ?? aiModel);
            }}
            items={AI_Models.map((model) => model.id)}
        >
            <ComboboxInput placeholder="Select a model" />
            <ComboboxContent>
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                    {(item) => (
                        <ComboboxItem key={item} value={item}>
                            {item}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
};
