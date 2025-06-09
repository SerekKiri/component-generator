import React from "react";
import { Link } from "@remix-run/react";

interface Chat {
    id: string;
    title: string;
}

interface ChatHistoryProps {
    chats: Chat[];
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({ chats }) => {
    return (
        <div className="p-4 border-t border-gray-200">
            <h3 className="font-semibold mb-2">Chat History</h3>
            <ul className="space-y-1">
                {chats.map((chat) => (
                    <li key={chat.id}>
                        <Link to={`/app/${chat.id}`} className="block px-4 py-2 rounded bg-gray-50 hover:bg-primary hover:text-white transition">
                            {chat.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}; 