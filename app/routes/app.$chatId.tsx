import { data } from "@remix-run/node";
import { useLoaderData, useSubmit, useActionData, useParams } from "@remix-run/react";
import { useState, useEffect } from "react";
import { Chat } from "@/components/Chat.client";
import { Title } from "@/components/Title.client";
import { callClaudeAPI, CLAUDE_SYSTEM_PROMPT, extractCodeFromResponse } from "@/lib/models/claude";
import { fetchUserDetails } from "@/lib/supabase/server/user";
import { fetchMessages, saveMessage } from "@/lib/supabase/server/message";
import { fetchComponent, upsertComponent } from "@/lib/supabase/server/component";
import { fetchChat, fetchChatHistory, updateChatTitle } from "@/lib/supabase/server/chat";
import { requireUserId } from "@/lib/supabase/auth";
import { ClientOnly } from "remix-utils/client-only";
import { ComponentPreview } from "@/components/ComponentPreview.client";
import { CodePreview } from "@/components/CodePreview.client";
import { AppLayout } from "@/layouts/AppLayout";
import { LoadingState } from "@/components/LoadingState";

// Types
import { Component } from "@/types/component";
import { Chat as ChatType, Message } from "@/types/chat";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";

interface LoaderData {
    chat: ChatType;
    username: string;
    chatHistory: ChatType[];
    messages: Message[];
    component: Component | null;
}

export async function loader({ request, params }: LoaderFunctionArgs) {
    const userId = await requireUserId(request);
    const chatId = params.chatId;
    if (!chatId) {
        throw new Error("Chat ID is required");
    }

    try {
        const chat = await fetchChat(chatId);
        const user = await fetchUserDetails(userId);
        const chatHistory = await fetchChatHistory(userId);
        const messages = await fetchMessages(chatId);
        const component = await fetchComponent(chatId);

        return data<LoaderData>({
            chat,
            username: user?.username || "User",
            chatHistory,
            messages,
            component
        });
    } catch (error) {
        console.error("Error in loader:", error);
        throw error;
    }
}

export async function action({ request, params }: ActionFunctionArgs) {
    const chatId = params.chatId;
    const userId = await requireUserId(request);

    if (!chatId) {
        throw new Error("Chat ID is required");
    }

    const formData = await request.formData();
    const message = formData.get("message") as string;
    const messages = JSON.parse(formData.get("messages") as string);
    const component = JSON.parse(formData.get("component") as string);
    const title = formData.get("title") as string;

    if (title) {
        // Update chat title
        await updateChatTitle(chatId, title);
        return data({ success: true, title });
    }

    if (!message) {
        return data({ error: "Message is required" }, { status: 400 });
    }

    try {
        const savedUserMessage = await saveMessage({
            role: "user",
            content: message,
            chat_id: chatId || '',
            user_id: userId || ''
        });

        if (!savedUserMessage) {
            return data({ error: "Failed to save user message" }, { status: 500 });
        }

        let componentPrompt = CLAUDE_SYSTEM_PROMPT
        if (component) {
            componentPrompt = `I want you to improve the following component: ${component.code}. Please return the improved code as per request: ${message}.`;
        }

        // Get response from Claude
        const response = await callClaudeAPI([{ role: "user", content: componentPrompt }]);

        // Extract code if present
        const extractedCode = extractCodeFromResponse(response.content[0].text);
        let updatedComponent = component;

        if (extractedCode) {
            // Save the new component
            updatedComponent = await upsertComponent(chatId, extractedCode);
        }

        // Return updated data with the saved message
        return data({
            success: true,
            messages: [...messages, savedUserMessage],
            component: updatedComponent
        });
    } catch (error) {
        console.error("Error in action:", error);
        return data({ error: "Failed to process message" }, { status: 500 });
    }
}

export default function ChatRoute() {
    const { chatId } = useParams();
    const { username, chatHistory, messages: initialMessages, component: initialComponent, chat } = useLoaderData<LoaderData>();
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [component, setComponent] = useState(initialComponent);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const actionData = useActionData<{ success: boolean; messages: Message[]; component: Component; title?: string }>();
    const submit = useSubmit();

    // Reset state when chat ID changes
    useEffect(() => {
        setMessages(initialMessages);
        setComponent(initialComponent);
        setIsLoading(false);
        setError(null);
    }, [chatId, initialMessages, initialComponent]);

    const handleTitleChange = (newTitle: string) => {
        const formData = new FormData();
        formData.append("title", newTitle);
        submit(formData, { method: "post" });
    };

    const handleSendMessage = async (message: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("message", message);
            formData.append("messages", JSON.stringify(messages));
            formData.append("component", JSON.stringify(component));

            await submit(formData, { method: "post" });
        } catch (err) {
            setError("Failed to send message");
            console.error("Error sending message:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Update UI when action data arrives
    useEffect(() => {
        if (actionData?.success) {
            if (actionData.messages) {
                setMessages(actionData.messages);
            }
            if (actionData.component) {
                setComponent(actionData.component);
            }
        }
    }, [actionData]);

    return (
        <AppLayout username={username} chatHistory={chatHistory}>
            <div className="flex flex-col h-full overflow-hidden">
                <ClientOnly fallback={<LoadingState fullScreen />}>
                    {() => <Title title={chat.title} onTitleChange={handleTitleChange} />}
                </ClientOnly>
                <div className="flex flex-1 overflow-hidden">
                    <div className="w-full md:min-w-[200px] md:max-w-[450px] 2xl:min-w-[400px] 2xl:max-w-[650px] flex-shrink border-r border-primary-100 overflow-hidden">
                        <ClientOnly fallback={<LoadingState fullScreen />}>
                            {() => <Chat
                                messages={messages}
                                onSendMessage={handleSendMessage}
                                isLoading={isLoading}
                                error={error || undefined}
                            />}
                        </ClientOnly>
                    </div>
                    <div className="hidden md:flex flex-1 flex-col overflow-hidden">
                        <div className="h-1/2 border-b border-gray-200 overflow-hidden">
                            <ClientOnly fallback={<LoadingState className="border-l border-gray-200" fullScreen />}>
                                {() => <CodePreview code={component?.code || ''} isLoading={isLoading} />}
                            </ClientOnly>
                        </div>
                        <div className="h-1/2 overflow-hidden">
                            <ClientOnly fallback={<LoadingState className="border-l border-gray-200" fullScreen />}>
                                {() => <ComponentPreview code={component?.code || ''} />}
                            </ClientOnly>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 