import { useLoaderData } from "@remix-run/react";
import { AppLayout } from "@layouts/AppLayout";
import { ComponentCard } from "./components/ComponentCard";
import { loader } from "./loader";

export { loader };

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