import { data } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { requireUserId } from "@lib/supabase/auth";
import { streamClaudeResponse } from "@lib/models/claude";
import { supabase } from "@lib/supabase/server";

export const action = async ({ request }: ActionFunctionArgs) => {
    const userId = await requireUserId(request);
    const form = await request.formData();
    const prompt = form.get("prompt") as string;
    const chatId = form.get("chatId") as string;

    if (!prompt) {
        return data({ error: "Prompt is required." }, { status: 400 });
    }

    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
        return data({ error: "Claude API key is missing." }, { status: 500 });
    }

    let responseText = "";
    await streamClaudeResponse(prompt, apiKey, (chunk) => {
        responseText += chunk;
    });

    // Save message and component to Supabase
    const { error: messageError } = await supabase.from("messages").insert({
        chat_id: chatId,
        user_id: userId,
        role: "user",
        content: prompt,
    });

    if (messageError) {
        return data({ error: messageError.message }, { status: 500 });
    }

    const { error: componentError } = await supabase.from("components").insert({
        chat_id: chatId,
        code: responseText,
    });

    if (componentError) {
        return data({ error: componentError.message }, { status: 500 });
    }

    return data({ success: true });
}; 