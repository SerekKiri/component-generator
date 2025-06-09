import { useState } from "react";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect, data } from "@remix-run/node";
import { signup, setUserSession, getUserSession } from "@lib/supabase/auth";

export const action = async ({ request }: ActionFunctionArgs) => {
    const form = await request.formData();
    const username = form.get("username") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const repeat = form.get("repeat") as string;

    if (!username || !email || !password || !repeat) {
        return data({ error: "All fields are required." }, { status: 400 });
    }

    if (password !== repeat) {
        return data({ error: "Passwords do not match." }, { status: 400 });
    }

    const { data: signupData, error } = await signup({ username, email, password });

    if (error) {
        return data({ error: error.message }, { status: 400 });
    }

    if (!signupData) {
        return data({ error: "Signup failed." }, { status: 400 });
    }

    const session = await getUserSession(request);
    const cookie = await setUserSession(signupData.user?.id ?? "", session);

    return redirect("/app", {
        headers: { "Set-Cookie": cookie },
    });
};

export default function Signup() {
    const actionData = useActionData<typeof action>();
    const navigation = useNavigation();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary-50">
            <div className="bg-white rounded-lg border border-primary-100 p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-primary-700 text-center">Sign Up for Reacta</h2>
                <Form method="post" className="flex flex-col gap-4">
                    <input name="username" type="text" placeholder="Username" required className="border border-primary-200 rounded px-4 py-2 focus:outline-none focus:border-primary-400 transition-all bg-white" />
                    <input name="email" type="email" placeholder="Email" required className="border border-primary-200 rounded px-4 py-2 focus:outline-none focus:border-primary-400 transition-all bg-white" />
                    <input name="password" type={showPassword ? "text" : "password"} placeholder="Password" required className="border border-primary-200 rounded px-4 py-2 focus:outline-none focus:border-primary-400 transition-all bg-white" />
                    <input name="repeat" type={showPassword ? "text" : "password"} placeholder="Repeat Password" required className="border border-primary-200 rounded px-4 py-2 focus:outline-none focus:border-primary-400 transition-all bg-white" />
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" onChange={() => setShowPassword((v) => !v)} /> Show Passwords
                    </label>
                    {actionData?.error && <div className="text-red-500 text-sm">{actionData.error}</div>}
                    <button type="submit" className="bg-primary-500 text-white font-semibold py-2 rounded hover:bg-primary-600 transition" disabled={navigation.state !== "idle"}>
                        {navigation.state === "submitting" ? "Signing up..." : "Sign Up"}
                    </button>
                </Form>
                <div className="mt-4 text-center text-sm">
                    Already have an account? <a href="/login" className="text-primary-700 underline">Login</a>
                </div>
            </div>
        </div>
    );
} 