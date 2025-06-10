import { useLoaderData, useActionData, useNavigation } from "@remix-run/react";
import { AppLayout } from "@layouts/AppLayout";
import { ClientOnly } from "remix-utils/client-only";
import NewChat from "@/components/chat/NewChat.client";
import { loader } from "./loader";
import { action } from "./action";

export { loader, action };

export default function Index() {
    const { username, chatHistory } = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    return (
        <AppLayout username={username} chatHistory={chatHistory}>
            <ClientOnly fallback={<div>Loading...</div>}>
                {() => <NewChat isSubmitting={isSubmitting} error={actionData?.error} />}
            </ClientOnly>
        </AppLayout>
    );
} 