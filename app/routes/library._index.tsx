import { useLoaderData } from "@remix-run/react";
import { data } from "@remix-run/node";
import { AppLayout } from "@layouts/AppLayout";
import { ComponentCard } from "@components/ComponentCard";
import { requireUserId } from "@lib/supabase/auth";
import { supabase } from "@lib/supabase/server";
import { fetchUserComponentsWithTitle } from "@lib/supabase/server/component"

interface MappedComponent {
    id: string
    chatId: string
    title: string
    code: string
    createdAt: string
}

export const loader = async ({ request }: { request: Request }) => {
    const userId = await requireUserId(request);

    // Fetch user details
    const { data: user } = await supabase
        .from("users")
        .select("username")
        .eq("id", userId)
        .single();

    // Fetch components for the current user
    const components = await fetchUserComponentsWithTitle(userId);

    // Fetch chat history
    const { data: chats, error: chatsError } = await supabase
        .from("chats")
        .select("id, title")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (chatsError) {
        throw new Error("Failed to fetch chat history");
    }
    // Map components to include title from the chat
    const mappedComponents: MappedComponent[] = (components || []).map((component) => ({
        id: component.id,
        chatId: component.chat_id || "",
        title: component.chats?.title || "Untitled Component",
        code: component.code,
        createdAt: component.created_at || "No date"
    }));

    return data({
        components: mappedComponents,
        chatHistory: chats,
        username: user?.username || "User"
    });
};

export default function Library() {
    const { components, chatHistory, username } = useLoaderData<typeof loader>();

    return (
        <AppLayout username={username} chatHistory={chatHistory}>
            <div className="p-4">
                <h2 className="text-2xl text-primary-900 font-bold mb-4">Component Library</h2>
                {components.length === 0 ? (
                    <div className="text-center py-8 text-primary-600">
                        No components in the library yet
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-4 justify-start">
                        {components.map((component) => (
                            <ComponentCard key={component.id} title={component.title} id={component.chatId || ""} createdAt={component.createdAt} />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
} 