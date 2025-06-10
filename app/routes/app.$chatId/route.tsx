import { useState, useEffect } from "react";
import { useLoaderData, useSubmit, useActionData, useParams } from "@remix-run/react";
import { Chat } from "@/components/chat/Chat.client";
import { Title } from "@/components/common/Title.client";
import { ClientOnly } from "remix-utils/client-only";
import { ComponentPreview } from "@/components/preview/ComponentPreview.client";
import { CodePreview } from "@/components/preview/CodePreview.client";
import { AppLayout } from "@/layouts/AppLayout";
import { LoadingState } from "@/components/common/LoadingState";
import type { LoaderData, ActionData } from "./types";
import { loader } from "./loader";
import { action } from "./action";

export { loader, action };

export default function ChatRoute() {
    const { chatId } = useParams();
    const { username, chatHistory, messages: initialMessages, component: initialComponent, chat } = useLoaderData<LoaderData>();
    const [messages, setMessages] = useState(initialMessages);
    const [component, setComponent] = useState(initialComponent);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const actionData = useActionData<ActionData>();
    const submit = useSubmit();

    useEffect(() => {
        setMessages(initialMessages);
        setComponent(initialComponent);
        setIsLoading(false);
        setError(null);
    }, [chatId, initialMessages, initialComponent]);

    useEffect(() => {
        if (actionData) {
            setIsLoading(false);
        }

        if (actionData?.success) {
            if (actionData.messages) {
                setMessages(actionData.messages);
            }
            if (actionData.component) {
                setComponent(actionData.component);
            }
        }
    }, [actionData]);

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
        }
    };

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
                        <div className="h-1/2 border-b border-gray-200 overflow-hidden border-l border-gray-200">
                            <ClientOnly fallback={<LoadingState className="border-l border-gray-200" fullScreen />}>
                                {() => <CodePreview code={component?.code || ''} />}
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