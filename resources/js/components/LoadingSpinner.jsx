import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...', color = 'primary', variant = 'spinner' }) => {
    const sizeClasses = {
        xs: 'h-4 w-4',
        sm: 'h-6 w-6',
        medium: 'h-8 w-8',
        large: 'h-12 w-12',
        xl: 'h-16 w-16'
    };

    const colorClasses = {
        primary: 'border-orange-500',
        secondary: 'border-pink-500',
        teal: 'border-teal-500',
        navy: 'border-navy-500',
        white: 'border-white'
    };

    const textSizeClasses = {
        xs: 'text-xs',
        sm: 'text-sm',
        medium: 'text-base',
        large: 'text-lg',
        xl: 'text-xl'
    };

    // Modern spinner with gradient border
    const ModernSpinner = () => (
        <div className="relative">
            <div className={`${sizeClasses[size]} rounded-full border-2 border-gray-200`}></div>
            <div className={`absolute top-0 left-0 ${sizeClasses[size]} rounded-full border-2 border-transparent border-t-orange-500 border-r-pink-500 animate-spin`}></div>
        </div>
    );

    // Pulsing dots animation
    const PulsingDots = () => (
        <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
        </div>
    );

    // Wave animation
    const WaveAnimation = () => (
        <div className="flex items-center space-x-1">
            <div className="w-1 h-4 bg-orange-500 rounded-full animate-wave" style={{animationDelay: '0s'}}></div>
            <div className="w-1 h-4 bg-pink-500 rounded-full animate-wave" style={{animationDelay: '0.1s'}}></div>
            <div className="w-1 h-4 bg-teal-500 rounded-full animate-wave" style={{animationDelay: '0.2s'}}></div>
            <div className="w-1 h-4 bg-navy-500 rounded-full animate-wave" style={{animationDelay: '0.3s'}}></div>
        </div>
    );

    // Rotating squares
    const RotatingSquares = () => (
        <div className="relative">
            <div className={`${sizeClasses[size]} flex items-center justify-center`}>
                <div className="w-3 h-3 bg-orange-500 rounded-sm animate-rotate-squares" style={{animationDelay: '0s'}}></div>
                <div className="w-3 h-3 bg-pink-500 rounded-sm animate-rotate-squares absolute" style={{animationDelay: '0.1s'}}></div>
                <div className="w-3 h-3 bg-teal-500 rounded-sm animate-rotate-squares absolute" style={{animationDelay: '0.2s'}}></div>
            </div>
        </div>
    );

    const renderSpinner = () => {
        switch (variant) {
            case 'dots':
                return <PulsingDots />;
            case 'wave':
                return <WaveAnimation />;
            case 'squares':
                return <RotatingSquares />;
            default:
                return <ModernSpinner />;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            {renderSpinner()}
            {text && (
                <span className={`text-white font-medium mt-3 animate-pulse ${textSizeClasses[size]}`}>
                    {text}
                </span>
            )}
        </div>
    );
};

export default LoadingSpinner;
