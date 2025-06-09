import React from "react";

interface AvatarProps {
    username: string;
}

export const Avatar: React.FC<AvatarProps> = ({ username }) => {
    const firstLetter = username.charAt(0).toUpperCase();
    return (
        <div className="flex items-center gap-2 select-none">
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                {firstLetter}
            </div>
            <span className="font-medium">{username}</span>
        </div>
    );
}; 