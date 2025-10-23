import React from 'react';

const AnimatedCard = ({ 
    children, 
    className = '', 
    hover = true, 
    gradient = false,
    glass = false,
    ...props 
}) => {
    const baseClasses = 'rounded-3xl shadow-2xl transition-all duration-500 transform';
    
    const hoverClasses = hover ? 'card-hover' : '';
    const gradientClasses = gradient ? 'animate-gradient' : '';
    const glassClasses = glass ? 'glass' : 'bg-white';
    
    return (
        <div 
            className={`${baseClasses} ${hoverClasses} ${gradientClasses} ${glassClasses} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default AnimatedCard;
