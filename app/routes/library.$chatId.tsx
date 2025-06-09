import { useLoaderData, useNavigate } from "@remix-run/react";
import { data } from "@remix-run/node";
import { AppLayout } from "@layouts/AppLayout";
import { CodePreview } from "@/components/CodePreview.client";
import { ComponentPreview } from "@components/ComponentPreview.client";
import { requireUserId } from "@lib/supabase/auth";
import { fetchUserDetails } from "@lib/supabase/server/user";
import { fetchChatHistory } from "@lib/supabase/server/chat";
import { fetchComponentWithTitle } from "@lib/supabase/server/component";
import { ErrorBoundary } from "@components/ErrorBoundary";
import { ClientOnly } from "remix-utils/client-only";
import { LoadingState } from "@/components/LoadingState";

export const loader = async ({ request, params }: { request: Request; params: { chatId: string } }) => {
    const userId = await requireUserId(request);
    const { chatId } = params;

    // Fetch user details
    const user = await fetchUserDetails(userId);

    // Fetch component
    const component = await fetchComponentWithTitle(chatId);
    if (!component) {
        throw new Error("Component not found");
    }

    // Fetch chat history
    const chatHistory = await fetchChatHistory(userId);

    return data({
        component: {
            id: component.id,
            title: component.chats?.title || "Untitled Component",
            code: component.code,
            created_at: component.created_at || "No date"
        },
        chatHistory,
        username: user?.username || "User"
    });
};

export { ErrorBoundary };

export default function ComponentView() {
    const { component, chatHistory, username } = useLoaderData<typeof loader>();
    const navigate = useNavigate();

    return (
        <AppLayout username={username} chatHistory={chatHistory}>
            <div className="p-4">
                <div className="flex gap-6 justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-primary-400 rounded-md hover:bg-primary-200 hover:text-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            ← Go Back
                        </button>
                        <h2 className="text-2xl text-primary-900 font-bold">{component.title}</h2>
                    </div>
                    <span className="text-sm text-gray-500">
                        {new Date(component.created_at).toLocaleDateString()}
                    </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-12rem)]">
                    <div className="h-full">
                        <ClientOnly fallback={<LoadingState fullScreen />}>
                            {() => <CodePreview code={component.code} />}
                        </ClientOnly>
                    </div>
                    <div className="h-full">
                        <ClientOnly fallback={<LoadingState fullScreen />}>
                            {() => <ComponentPreview code={component.code} />}
                        </ClientOnly>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
