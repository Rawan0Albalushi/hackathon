import React from 'react';

const ErrorMessage = ({ message, onClose, show = true }) => {
    if (!show) return null;

    return (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
            <div className="bg-white rounded-xl shadow-2xl border border-red-200 p-6 max-w-sm animate-shake">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </div>
                    </div>
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">{message}</p>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ErrorMessage;
