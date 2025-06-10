import { useState } from "react";
import { Form, useActionData, useNavigation, useSearchParams } from "@remix-run/react";
import { action } from "./action";

export { action };

export default function Login() {
    const actionData = useActionData<typeof action>();
    const navigation = useNavigation();
    const [showPassword, setShowPassword] = useState(false);
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") || "/app";

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary-50">
            <div className="bg-white rounded-lg border border-primary-100 p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-primary-700 text-center">Login to Reacta</h2>
                <Form method="post" className="flex flex-col gap-4">
                    <input type="hidden" name="redirectTo" value={redirectTo} />
                    <input name="email" type="email" placeholder="Email" required className="border border-primary-200 rounded px-4 py-2 focus:outline-none focus:border-primary-400 transition-all bg-white" />
                    <input name="password" type={showPassword ? "text" : "password"} placeholder="Password" required className="border border-primary-200 rounded px-4 py-2 focus:outline-none focus:border-primary-400 transition-all bg-white" />
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" onChange={() => setShowPassword((v) => !v)} /> Show Password
                    </label>
                    {actionData?.error && <div className="text-red-500 text-sm">{actionData.error}</div>}
                    <button type="submit" className="bg-primary-500 text-white font-semibold py-2 rounded hover:bg-primary-600 transition" disabled={navigation.state !== "idle"}>
                        {navigation.state === "submitting" ? "Logging in..." : "Login"}
                    </button>
                </Form>
                <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account? <a href="/signup" className="text-primary-700 underline">Sign Up</a>
                </div>
            </div>
        </div>
    );
} 