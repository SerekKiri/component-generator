import { useState, useEffect } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs2015, atomOneDark, github, dracula, monokai } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { LoadingState } from '@components/common/LoadingState';

const themes = [
    { name: 'VS Code Dark', value: vs2015 },
    { name: 'Atom Dark', value: atomOneDark },
    { name: 'GitHub', value: github },
    { name: 'Dracula', value: dracula },
    { name: 'Monokai', value: monokai },
];

const THEME_STORAGE_KEY = 'code-preview-theme';

export const CodePreview = ({ code, isLoading = false }: { code: string | null, isLoading?: boolean }) => {
    const [selectedTheme, setSelectedTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
            if (savedTheme) {
                const theme = themes.find(t => t.name === savedTheme);
                if (theme) return theme.value;
            }
        }
        return vs2015;
    });

    const [isThemeOpen, setIsThemeOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    // Save theme to localStorage whenever it changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const themeName = themes.find(t => t.value === selectedTheme)?.name;
            if (themeName) {
                localStorage.setItem(THEME_STORAGE_KEY, themeName);
            }
        }
    }, [selectedTheme]);

    const handleCopy = () => {
        if (code) {
            navigator.clipboard.writeText(code);
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
            }, 800);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Code Preview</h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCopy}
                        className="p-2 hover:bg-gray-100 rounded-lg relative group"
                        title="Copy code"
                        disabled={isLoading || !code}
                    >
                        <ClipboardDocumentIcon
                            className={`h-5 w-5 transition-all duration-75 ease-out hover:scale-110 ${isLoading || !code ? 'text-gray-400' : 'text-gray-600'} ${isCopied ? 'text-green-500' : ''}`}
                        />
                        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {isCopied ? 'Copied!' : 'Copy'}
                        </span>
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setIsThemeOpen(!isThemeOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg relative group flex items-center gap-1"
                            title="Select theme"
                            disabled={isLoading}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className={`w-5 h-5 ${isLoading ? 'text-gray-400' : 'text-gray-600'}`}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
                                />
                            </svg>
                            <span className={`text-sm ${isLoading ? 'text-gray-400' : 'text-gray-600'}`}>Theme</span>
                        </button>
                        {isThemeOpen && !isLoading && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                {themes.map((theme) => (
                                    <button
                                        key={theme.name}
                                        onClick={() => {
                                            setSelectedTheme(theme.value);
                                            setIsThemeOpen(false);
                                        }}
                                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${selectedTheme === theme.value ? 'bg-gray-50 text-blue-600' : 'text-gray-700'
                                            }`}
                                    >
                                        {theme.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex-1 min-h-0 pr-2">
                {isLoading ? (
                    <div className="h-full bg-gray-50 rounded-lg">
                        <LoadingState fullScreen color="bg-gray-400" />
                    </div>
                ) : (
                    <SyntaxHighlighter
                        language="jsx"
                        style={selectedTheme}
                        customStyle={{
                            margin: 0,
                            height: '100%',
                            fontSize: '14px',
                            lineHeight: '1.5',
                        }}
                    >
                        {code || ''}
                    </SyntaxHighlighter>
                )}
            </div>
        </div>
    );
}; 