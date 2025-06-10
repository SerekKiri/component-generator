import React from "react";
import { Link, useLocation } from "@remix-run/react";
import { Avatar } from "@components/common/Avatar";

interface Chat {
    id: string;
    title: string;
}

interface SidebarProps {
    username: string;
    chatHistory: Chat[];
}

export const Sidebar: React.FC<SidebarProps> = ({ username, chatHistory }) => {
    const selectedRoute = useLocation().pathname;

    return (
        <div className="w-64 h-screen bg-white border-r border-primary-100 flex flex-col">
            <div className="p-4 border-b border-primary-100">
                <Avatar username={username} />
            </div>
            <nav className="py-4 px-2">
                <ul className="space-y-2">
                    <li>
                        <Link to="/app" className={`block px-4 py-2 text-sm rounded-lg ${selectedRoute === "/app" ? "bg-primary-500 text-white" : "bg-gray-50 hover:bg-primary-500 hover:text-white transition"}`}>
                            App
                        </Link>
                    </li>
                    <li>
                        <Link to="/library" className={`block px-4 py-2 text-sm rounded-lg ${selectedRoute.includes("/library") ? "bg-primary-500 text-white" : "bg-gray-50 hover:bg-primary-500 hover:text-white transition"}`}>
                            Library
                        </Link>
                    </li>
                </ul>
            </nav>
            {chatHistory && chatHistory.length > 0 && (
                <div className="flex-1 py-4 px-2 border-t border-primary-100">
                    <div className="flex justify-between items-center mb-2 px-1">
                        <h3 className="font-semibold">Chat History</h3>
                        <Link
                            to="/app"
                            className="w-6 h-6 flex items-center justify-center rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition"
                            aria-label="New Component"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </div>
                    <ul className="space-y-1">
                        {chatHistory.map((chat) => {
                            const isSelected = selectedRoute.includes(`/app/${chat.id}`);

                            return (
                                <li key={chat.id}>
                                    <Link to={`/app/${chat.id}`} className={`block px-4 py-2 rounded-lg ${isSelected ? "bg-primary-500 text-white" : "bg-gray-50 hover:bg-primary-500 hover:text-white transition"} truncate `}>
                                        {chat.title}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}; 