import { useState } from "react";
import { Form } from "@remix-run/react";

interface NewChatProps {
    isSubmitting: boolean;
    error?: string;
}

const NewChat = ({ isSubmitting, error }: NewChatProps) => {
    const [message, setMessage] = useState("");

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-2xl p-8 bg-white rounded-xl shadow-sm">
                <h1 className="text-2xl font-semibold mb-8 text-gray-800 text-center">Generate a New Component</h1>
                <Form method="post" className="flex flex-col gap-5">
                    <div className="relative">
                        <input
                            type="text"
                            name="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Describe the component you want to generate..."
                            className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-200 transition-all bg-white disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 placeholder-gray-400"
                            disabled={isSubmitting}
                            readOnly={isSubmitting}
                        />
                        {error && (
                            <div className="mt-2 text-sm text-red-500">{error}</div>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full px-6 py-3.5 rounded-lg transition-all font-medium shadow-sm hover:shadow-md ${isSubmitting
                            ? "bg-primary-200 cursor-not-allowed"
                            : "bg-primary-500 hover:bg-primary-600"
                            } text-white`}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center gap-3">
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                <span>Generating Component...</span>
                            </div>
                        ) : (
                            "Generate Component"
                        )}
                    </button>
                </Form>
            </div>
        </div>
    );
};

export default NewChat;