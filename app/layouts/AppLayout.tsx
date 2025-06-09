import React from "react";
import { Sidebar } from "../components/Sidebar";

interface LayoutProps {
    children: React.ReactNode;
    username: string;
    chatHistory: Array<{
        id: string;
        title: string;
    }>;
}

export const AppLayout: React.FC<LayoutProps> = ({ children, username, chatHistory }) => {
    return (
        <div className="flex h-screen">
            <Sidebar username={username} chatHistory={chatHistory} />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}; 