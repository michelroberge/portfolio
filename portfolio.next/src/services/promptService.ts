// src/services/promptService.ts
import { ADMIN_API } from "@/lib/constants";
import { Prompt, PromptFormData } from "@/models/Prompt";

export async function fetchPrompts(cookieHeader: string): Promise<Prompt[]> {
    const headers: HeadersInit = { Cookie: cookieHeader };
    const res = await fetch(ADMIN_API.prompts.list, { credentials: "include", headers });
    if (!res.ok) throw new Error("Failed to fetch prompts");
    return await res.json();
}

export async function fetchPrompt(id: string, cookieHeader: string): Promise<Prompt> {
    const headers: HeadersInit = { Cookie: cookieHeader };

    const res = await fetch(`${ADMIN_API.prompts.get(id)}`, { credentials: "include", headers });
    if (!res.ok) throw new Error("Failed to fetch prompt");
    return await res.json();
}

export async function createPrompt(promptData: PromptFormData, cookieHeader: string): Promise<Prompt> {
    const headers: HeadersInit = { Cookie: cookieHeader, "Content-Type": "application/json" };
    const res = await fetch(ADMIN_API.prompts.create, {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify(promptData),
    });
    if (!res.ok) throw new Error("Failed to create prompt");
    return await res.json();
}

export async function updatePrompt(id: string, promptData: PromptFormData, cookieHeader: string): Promise<Prompt> {
    const headers: HeadersInit = { Cookie: cookieHeader, "Content-Type": "application/json" };
    const res = await fetch(`${ADMIN_API.prompts.update(id)}`, {
        method: "PUT",
        credentials: "include",
        headers,
        body: JSON.stringify(promptData),
    });
    if (!res.ok) throw new Error("Failed to update prompt");
    return await res.json();
}

export async function deletePrompt(id: string, cookieHeader: string): Promise<void> {
    const headers: HeadersInit = { Cookie: cookieHeader };
    const res = await fetch(`${ADMIN_API.prompts.delete}/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers
    });
    if (!res.ok) throw new Error("Failed to delete prompt");
}
