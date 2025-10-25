import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', isVisible, onClose, duration = 3000 }) => {
    const [show, setShow] = useState(isVisible);

    useEffect(() => {
        setShow(isVisible);
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                setShow(false);
                setTimeout(onClose, 300); // Wait for animation to complete
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!show) return null;

    const getToastStyles = () => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
                    border: 'border-green-200',
                    icon: 'text-green-500',
                    text: 'text-green-800',
                    iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                };
            case 'error':
                return {
                    bg: 'bg-gradient-to-r from-red-50 to-pink-50',
                    border: 'border-red-200',
                    icon: 'text-red-500',
                    text: 'text-red-800',
                    iconPath: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                };
            case 'warning':
                return {
                    bg: 'bg-gradient-to-r from-yellow-50 to-amber-50',
                    border: 'border-yellow-200',
                    icon: 'text-yellow-500',
                    text: 'text-yellow-800',
                    iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                };
            case 'info':
                return {
                    bg: 'bg-gradient-to-r from-blue-50 to-cyan-50',
                    border: 'border-blue-200',
                    icon: 'text-blue-500',
                    text: 'text-blue-800',
                    iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                };
            default:
                return {
                    bg: 'bg-gradient-to-r from-gray-50 to-slate-50',
                    border: 'border-gray-200',
                    icon: 'text-gray-500',
                    text: 'text-gray-800',
                    iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                };
        }
    };

    const styles = getToastStyles();

    return (
        <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out ${
            show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`} dir="rtl">
            <div className={`${styles.bg} ${styles.border} border rounded-xl shadow-xl p-4 min-w-80 max-w-md backdrop-blur-sm`}>
                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    {/* Icon with background */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        type === 'success' ? 'bg-green-100' :
                        type === 'error' ? 'bg-red-100' :
                        type === 'warning' ? 'bg-yellow-100' :
                        'bg-blue-100'
                    }`}>
                        <svg className={`w-5 h-5 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={styles.iconPath} />
                        </svg>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                        <p className={`text-sm font-semibold ${styles.text} leading-relaxed`}>
                            {message}
                        </p>
                    </div>
                    
                    {/* Close Button */}
                    <button
                        onClick={() => {
                            setShow(false);
                            setTimeout(onClose, 300);
                        }}
                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200 ${styles.icon}`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {/* Progress bar */}
                {duration > 0 && (
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
                        <div 
                            className={`h-1 rounded-full transition-all duration-100 ease-linear ${
                                type === 'success' ? 'bg-green-500' :
                                type === 'error' ? 'bg-red-500' :
                                type === 'warning' ? 'bg-yellow-500' :
                                'bg-blue-500'
                            }`}
                            style={{
                                animation: `shrink ${duration}ms linear forwards`
                            }}
                        />
                    </div>
                )}
            </div>
            
            <style jsx>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );
};

export default Toast;
