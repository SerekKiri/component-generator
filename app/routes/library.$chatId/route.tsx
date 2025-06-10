import { useLoaderData, useNavigate } from "@remix-run/react";
import { AppLayout } from "@layouts/AppLayout";
import { CodePreview } from "@/components/preview/CodePreview.client";
import { ComponentPreview } from "@/components/preview/ComponentPreview.client";
import { ErrorBoundary } from "@/components/boundaries/ErrorBoundary";
import { ClientOnly } from "remix-utils/client-only";
import { LoadingState } from "@/components/common/LoadingState";
import { DateDisplay } from "@/components/common/Date.client";
import { loader } from "./loader";

export { loader, ErrorBoundary };

export default function ComponentView() {
    const { component, chatHistory, username } = useLoaderData<typeof loader>();
    const navigate = useNavigate();

    return (
        <AppLayout username={username} chatHistory={chatHistory}>
            <div className="p-4 bg-white h-full">
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
                        <ClientOnly fallback={null}>
                            {() => <DateDisplay date={component.createdAt} />}
                        </ClientOnly>
                    </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-12rem)]">
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
