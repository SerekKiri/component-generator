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
        <div className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col">
            <div className="p-4">
                <Avatar username={username} />
            </div>
            <nav className="px-3">
                <ul className="space-y-1">
                    <li>
                        <Link
                            to="/app"
                            className={`block px-3 py-2 text-sm rounded-md transition-colors ${selectedRoute === "/app"
                                ? "text-primary-800 bg-primary-200"
                                : "text-gray-600 hover:text-primary-800 hover:bg-primary-200"
                                }`}
                        >
                            App
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/library"
                            className={`block px-3 py-2 text-sm rounded-md transition-colors ${selectedRoute.includes("/library")
                                ? "text-primary-800 bg-primary-200"
                                : "text-gray-600 hover:text-primary-800 hover:bg-primary-200"
                                }`}
                        >
                            Library
                        </Link>
                    </li>
                </ul>
            </nav>
            {chatHistory && chatHistory.length > 0 && (
                <div className="flex-1 mt-4 px-3 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-medium text-gray-500">Chat History</h3>
                        <Link
                            to="/app"
                            className="p-1.5 rounded-md text-gray-400 hover:text-primary-800 hover:bg-primary-200 transition-colors"
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
                                    <Link
                                        to={`/app/${chat.id}`}
                                        className={`block px-3 py-2 text-sm rounded-md transition-colors truncate ${isSelected
                                            ? "text-primary-800 bg-primary-200"
                                            : "text-gray-600 hover:text-primary-800 hover:bg-primary-200"
                                            }`}
                                    >
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