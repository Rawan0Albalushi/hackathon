import React from 'react';
import { createRipple } from '../utils/scrollAnimations';

const AnimatedButton = ({ 
    children, 
    onClick, 
    variant = 'primary', 
    size = 'medium', 
    disabled = false,
    loading = false,
    loadingText = 'Loading...',
    loadingVariant = 'spinner',
    className = '',
    ...props 
}) => {
    const handleClick = (event) => {
        if (!disabled && !loading) {
            createRipple(event);
            if (onClick) onClick(event);
        }
    };

    const baseClasses = 'ripple-effect button-press font-semibold rounded-full transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
        primary: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 hover-pulse-glow shadow-lg hover:shadow-xl',
        secondary: 'bg-white text-indigo-900 border-2 border-indigo-500 hover:bg-indigo-50 hover-float shadow-md hover:shadow-lg',
        success: 'bg-gradient-to-r from-green-500 to-teal-600 text-white hover:from-green-600 hover:to-teal-700 hover-pulse-glow shadow-lg hover:shadow-xl',
        danger: 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 hover-pulse-glow shadow-lg hover:shadow-xl',
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 hover-float',
        glass: 'glass text-white hover:bg-white/20 hover-float'
    };

    const sizeClasses = {
        small: 'px-4 py-2 text-sm',
        medium: 'px-6 py-3 text-base',
        large: 'px-8 py-4 text-lg',
        xl: 'px-10 py-5 text-xl'
    };

    const loadingSpinner = (
        <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span className="text-sm">{loadingText}</span>
        </div>
    );

    const loadingClasses = loading ? 'button-loading opacity-75 cursor-not-allowed' : 'hover:scale-105';

    return (
        <button
            onClick={handleClick}
            disabled={disabled || loading}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${loadingClasses} ${className}`}
            {...props}
        >
            {loading ? loadingSpinner : children}
        </button>
    );
};

export default AnimatedButton;
