import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...', color = 'indigo' }) => {
    const sizeClasses = {
        small: 'h-6 w-6',
        medium: 'h-12 w-12',
        large: 'h-16 w-16',
        xl: 'h-20 w-20'
    };

    const colorClasses = {
        indigo: 'border-indigo-600',
        purple: 'border-purple-600',
        pink: 'border-pink-600',
        blue: 'border-blue-600',
        green: 'border-green-600',
        red: 'border-red-600'
    };

    return (
        <div className="flex flex-col items-center justify-center p-8">
            {/* Main Spinner */}
            <div className={`animate-spin rounded-full border-b-2 ${colorClasses[color]} ${sizeClasses[size]} mb-4`}></div>
            
            {/* Pulsing Dots */}
            <div className="flex space-x-1">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            
            {/* Loading Text */}
            <span className="text-gray-600 font-medium mt-4 animate-pulse">{text}</span>
        </div>
    );
};

export default LoadingSpinner;
