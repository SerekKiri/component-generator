import { FC } from 'react';

interface LoadingStateProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    color?: string;
    fullScreen?: boolean;
}

export const LoadingState: FC<LoadingStateProps> = ({
    className = '',
    size = 'md',
    color = 'bg-gray-400',
    fullScreen = false,
}) => {
    const dotSizes = {
        sm: 'w-1.5 h-1.5',
        md: 'w-2 h-2',
        lg: 'w-3 h-3',
    };

    const containerClasses = fullScreen
        ? 'h-full w-full flex items-center justify-center'
        : 'flex items-center justify-center';

    return (
        <div className={`${containerClasses} ${className}`}>
            <div className="flex space-x-2">
                <div className={`${dotSizes[size]} ${color} rounded-full animate-bounce`} />
                <div className={`${dotSizes[size]} ${color} rounded-full animate-bounce delay-100`} />
                <div className={`${dotSizes[size]} ${color} rounded-full animate-bounce delay-200`} />
            </div>
        </div>
    );
}; 