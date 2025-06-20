import { useState, useRef, useEffect } from 'react';
import { FiEdit } from 'react-icons/fi';

export const Title = ({ title, onTitleChange }: { title: string, onTitleChange: (newTitle: string) => void }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setEditedTitle(title);
    }, [title]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (editedTitle.trim() !== title) {
            onTitleChange(editedTitle.trim());
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setIsEditing(false);
            if (editedTitle.trim() !== title) {
                onTitleChange(editedTitle.trim());
            }
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setEditedTitle(title);
        }
    };

    return (
        <div className="px-4 py-2 max-w-md">
            {isEditing ? (
                <div className="relative w-full">
                    <input
                        ref={inputRef}
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        className="w-full pr-32 px-2 py-1 text-lg font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <div className="absolute inset-y-0 right-2 flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditing(false);
                                setEditedTitle(title);
                            }}
                            className="px-2 py-0.5 text-xs rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditing(false);
                                if (editedTitle.trim() !== title) {
                                    onTitleChange(editedTitle.trim());
                                }
                            }}
                            className="px-2 py-0.5 text-xs rounded bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </div>
            ) : (
                <h1
                    onDoubleClick={handleDoubleClick}
                    title="Double click to edit title"
                    className="text-lg font-medium cursor-pointer hover:text-primary-600 transition-colors group flex items-center gap-2"
                >
                    {title}
                    <span className="text-stone-700 opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                        <FiEdit className="w-4 h-4" />
                    </span>
                </h1>
            )}
        </div>
    );
}; 