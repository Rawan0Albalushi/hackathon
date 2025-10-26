import React, { useState, useCallback } from 'react';
import Toast from './Toast';

const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);

    // Function to add a new toast with enhanced options
    const addToast = useCallback((message, type = 'success', options = {}) => {
        const {
            duration = 4000,
            title,
            actions,
            sound = true,
            position = 'top-right'
        } = options;
        
        const id = Date.now() + Math.random();
        const newToast = { 
            id, 
            message, 
            type, 
            duration, 
            title, 
            actions, 
            sound, 
            position 
        };
        
        setToasts(prev => [...prev, newToast]);
        
        return id;
    }, []);

    // Function to remove a toast
    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    // Function to clear all toasts
    const clearAll = useCallback(() => {
        setToasts([]);
    }, []);

    // Function to show success toast
    const showSuccess = useCallback((message, options = {}) => {
        return addToast(message, 'success', options);
    }, [addToast]);

    // Function to show error toast
    const showError = useCallback((message, options = {}) => {
        return addToast(message, 'error', { duration: 5000, ...options });
    }, [addToast]);

    // Function to show warning toast
    const showWarning = useCallback((message, options = {}) => {
        return addToast(message, 'warning', { duration: 4500, ...options });
    }, [addToast]);

    // Function to show info toast
    const showInfo = useCallback((message, options = {}) => {
        return addToast(message, 'info', options);
    }, [addToast]);

    // Function to show loading toast
    const showLoading = useCallback((message, options = {}) => {
        return addToast(message, 'loading', { duration: 0, sound: false, ...options });
    }, [addToast]);

    // Expose functions globally for easy access
    React.useEffect(() => {
        window.showToast = addToast;
        window.showSuccess = showSuccess;
        window.showError = showError;
        window.showWarning = showWarning;
        window.showInfo = showInfo;
        window.showLoading = showLoading;
        window.clearToasts = clearAll;
        
        return () => {
            delete window.showToast;
            delete window.showSuccess;
            delete window.showError;
            delete window.showWarning;
            delete window.showInfo;
            delete window.showLoading;
            delete window.clearToasts;
        };
    }, [addToast, showSuccess, showError, showWarning, showInfo, showLoading, clearAll]);

    // Group toasts by position
    const toastsByPosition = toasts.reduce((acc, toast) => {
        const position = toast.position || 'top-right';
        if (!acc[position]) {
            acc[position] = [];
        }
        acc[position].push(toast);
        return acc;
    }, {});

    return (
        <>
            {Object.entries(toastsByPosition).map(([position, positionToasts]) => (
                <div 
                    key={position}
                    className={`fixed z-50 space-y-2 sm:space-y-3 toast-safe-area ${
                        position === 'top-left' ? 'top-2 left-2 sm:top-4 sm:left-4' :
                        position === 'top-center' ? 'top-2 left-1/2 transform -translate-x-1/2 sm:top-4' :
                        position === 'top-right' ? 'top-2 right-2 sm:top-4 sm:right-4' :
                        position === 'bottom-left' ? 'bottom-2 left-2 sm:bottom-4 sm:left-4' :
                        position === 'bottom-center' ? 'bottom-2 left-1/2 transform -translate-x-1/2 sm:bottom-4' :
                        'bottom-2 right-2 sm:bottom-4 sm:right-4'
                    }`} 
                    dir="rtl"
                >
                    {positionToasts.map((toast, index) => (
                        <div
                            key={toast.id}
                            className="transform transition-all duration-300 ease-in-out"
                            style={{
                                transform: `translateY(${index * -4}px)`,
                                zIndex: 50 - index
                            }}
                        >
                            <Toast
                                message={toast.message}
                                type={toast.type}
                                duration={toast.duration}
                                title={toast.title}
                                actions={toast.actions}
                                sound={toast.sound}
                                position={toast.position}
                                isVisible={true}
                                onClose={() => removeToast(toast.id)}
                            />
                        </div>
                    ))}
                </div>
            ))}
        </>
    );
};

export default ToastContainer;
