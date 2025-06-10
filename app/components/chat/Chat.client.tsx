import React, { useState, useRef, useEffect } from "react";
import { Form } from "@remix-run/react";
import { Message } from "@/types/chat";
import { LoadingState } from "@components/common/LoadingState";

interface ChatProps {
    messages: Message[];
    onSendMessage: (message: string) => Promise<void>;
    isLoading?: boolean;
    error?: string;
}

export const Chat: React.FC<ChatProps> = ({ messages, onSendMessage, isLoading = false, error }) => {
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    useEffect(() => {
        if (!isLoading) {
            setMessage("");
        }
    }, [isLoading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && !isLoading) {
            await onSendMessage(message);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin scrollbar-thumb-primary-200 scrollbar-track-transparent hover:scrollbar-thumb-primary-200">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className="p-4 rounded-xl bg-primary-50 text-primary-900 ml-auto max-w-[85%] shadow-sm"
                    >
                        {message.content}
                    </div>
                ))}
                {isLoading && (
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 max-w-[85%] shadow-sm">
                        <LoadingState color="bg-primary-200" />
                    </div>
                )}
                {error && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 max-w-[85%] shadow-sm">
                        {error}
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <Form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 bg-white">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-200 transition-all bg-white disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 placeholder-gray-400"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="bg-primary-500 text-white px-5 py-2.5 rounded-lg transition-all hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </Form>
        </div>
    );
}; 