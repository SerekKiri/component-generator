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
        messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
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
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className="p-3 rounded-lg bg-primary-500 text-white ml-auto max-w-[80%]"
                    >
                        {message.content}
                    </div>
                ))}
                {isLoading && (
                    <div className="p-3 rounded-lg bg-gray-50 border border-primary-100 max-w-[80%]">
                        <LoadingState color="bg-gray-400" />
                    </div>
                )}
                {error && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 max-w-[80%]">
                        {error}
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <Form onSubmit={handleSubmit} className="p-4 border-t border-primary-100">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 border border-primary-200 rounded px-4 py-2 focus:outline-none focus:border-primary-400 transition-all bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="bg-primary-500 text-white px-4 py-2 rounded transition hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </Form>
        </div>
    );
}; 