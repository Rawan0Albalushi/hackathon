import React, { useState, useCallback } from 'react';
import Toast from './Toast';

const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);

    // Function to add a new toast
    const addToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now() + Math.random();
        const newToast = { id, message, type, duration };
        
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

    // Expose functions globally for easy access
    React.useEffect(() => {
        window.showToast = addToast;
        window.clearToasts = clearAll;
        
        return () => {
            delete window.showToast;
            delete window.clearToasts;
        };
    }, [addToast, clearAll]);

    return (
        <div className="fixed top-4 right-4 z-50 space-y-3" dir="rtl">
            {toasts.map((toast, index) => (
                <div
                    key={toast.id}
                    className="transform transition-all duration-300 ease-in-out"
                    style={{
                        transform: `translateY(${index * -10}px)`,
                        zIndex: 50 - index
                    }}
                >
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        duration={toast.duration}
                        isVisible={true}
                        onClose={() => removeToast(toast.id)}
                    />
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
