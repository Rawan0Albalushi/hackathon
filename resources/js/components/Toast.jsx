import React, { useState, useEffect } from 'react';

const Toast = ({ 
    message, 
    type = 'success', 
    isVisible, 
    onClose, 
    duration = 4000,
    title,
    actions,
    sound = true,
    position = 'top-right'
}) => {
    const [show, setShow] = useState(isVisible);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        setShow(isVisible);
        if (isVisible && duration > 0) {
            // Play sound effect
            if (sound) {
                playSound(type);
            }
            
            // Progress bar animation
            const progressInterval = setInterval(() => {
                setProgress(prev => {
                    const newProgress = prev - (100 / (duration / 50));
                    return newProgress <= 0 ? 0 : newProgress;
                });
            }, 50);

            const timer = setTimeout(() => {
                setShow(false);
                setTimeout(onClose, 400); // Wait for animation to complete
            }, duration);

            return () => {
                clearTimeout(timer);
                clearInterval(progressInterval);
            };
        }
    }, [isVisible, duration, onClose, sound, type]);

    const playSound = (toastType) => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Different frequencies for different types
            const frequencies = {
                success: [523.25, 659.25, 783.99], // C5, E5, G5
                error: [220, 185], // A3, F#3
                warning: [440, 554.37], // A4, C#5
                info: [523.25, 659.25] // C5, E5
            };
            
            const freq = frequencies[toastType] || frequencies.info;
            oscillator.frequency.setValueAtTime(freq[0], audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            // Silently fail if audio context is not available
        }
    };

    if (!show) return null;

    const getToastStyles = () => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50',
                    border: 'border-emerald-200/60',
                    icon: 'text-emerald-600',
                    text: 'text-emerald-900',
                    title: 'text-emerald-800',
                    iconBg: 'bg-emerald-100',
                    progress: 'bg-emerald-500',
                    shadow: 'shadow-emerald-100/50',
                    iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                };
            case 'error':
                return {
                    bg: 'bg-gradient-to-br from-red-50 via-rose-50 to-pink-50',
                    border: 'border-red-200/60',
                    icon: 'text-red-600',
                    text: 'text-red-900',
                    title: 'text-red-800',
                    iconBg: 'bg-red-100',
                    progress: 'bg-red-500',
                    shadow: 'shadow-red-100/50',
                    iconPath: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                };
            case 'warning':
                return {
                    bg: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50',
                    border: 'border-amber-200/60',
                    icon: 'text-amber-600',
                    text: 'text-amber-900',
                    title: 'text-amber-800',
                    iconBg: 'bg-amber-100',
                    progress: 'bg-amber-500',
                    shadow: 'shadow-amber-100/50',
                    iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                };
            case 'info':
                return {
                    bg: 'bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50',
                    border: 'border-blue-200/60',
                    icon: 'text-blue-600',
                    text: 'text-blue-900',
                    title: 'text-blue-800',
                    iconBg: 'bg-blue-100',
                    progress: 'bg-blue-500',
                    shadow: 'shadow-blue-100/50',
                    iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                };
            case 'loading':
                return {
                    bg: 'bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50',
                    border: 'border-slate-200/60',
                    icon: 'text-slate-600',
                    text: 'text-slate-900',
                    title: 'text-slate-800',
                    iconBg: 'bg-slate-100',
                    progress: 'bg-slate-500',
                    shadow: 'shadow-slate-100/50',
                    iconPath: 'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                };
            default:
                return {
                    bg: 'bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50',
                    border: 'border-gray-200/60',
                    icon: 'text-gray-600',
                    text: 'text-gray-900',
                    title: 'text-gray-800',
                    iconBg: 'bg-gray-100',
                    progress: 'bg-gray-500',
                    shadow: 'shadow-gray-100/50',
                    iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                };
        }
    };

    const getPositionClasses = () => {
        switch (position) {
            case 'top-left':
                return 'top-2 left-2 sm:top-4 sm:left-4';
            case 'top-center':
                return 'top-2 left-1/2 transform -translate-x-1/2 sm:top-4';
            case 'top-right':
                return 'top-2 right-2 sm:top-4 sm:right-4';
            case 'bottom-left':
                return 'bottom-2 left-2 sm:bottom-4 sm:left-4';
            case 'bottom-center':
                return 'bottom-2 left-1/2 transform -translate-x-1/2 sm:bottom-4';
            case 'bottom-right':
                return 'bottom-2 right-2 sm:bottom-4 sm:right-4';
            default:
                return 'top-2 right-2 sm:top-4 sm:right-4';
        }
    };

    const styles = getToastStyles();
    const positionClasses = getPositionClasses();

    return (
        <div className={`fixed ${positionClasses} z-50 transform transition-all duration-500 ease-out ${
            show ? 'translate-x-0 translate-y-0 opacity-100 scale-100' : 
            position.includes('right') ? 'translate-x-full opacity-0 scale-95' :
            position.includes('left') ? '-translate-x-full opacity-0 scale-95' :
            'translate-y-full opacity-0 scale-95'
        }`} dir="rtl">
            <div className={`${styles.bg} ${styles.border} border-2 rounded-xl sm:rounded-2xl shadow-2xl ${styles.shadow} p-3 sm:p-5 w-full max-w-sm sm:min-w-80 sm:max-w-md backdrop-blur-md relative overflow-hidden mx-2 sm:mx-0 toast-mobile-optimized toast-touch-friendly`}>
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 animate-shimmer"></div>
                </div>
                
                <div className="relative flex items-start space-x-3 sm:space-x-4 rtl:space-x-reverse">
                    {/* Icon with enhanced background */}
                    <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center ${styles.iconBg} shadow-lg`}>
                        {type === 'loading' ? (
                            <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${styles.icon} animate-spin`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={styles.iconPath} />
                            </svg>
                        ) : (
                            <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${styles.icon} animate-bounce`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={styles.iconPath} />
                            </svg>
                        )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {title && (
                            <h4 className={`text-xs sm:text-sm font-bold ${styles.title} mb-1`}>
                                {title}
                            </h4>
                        )}
                        <p className={`text-xs sm:text-sm font-medium ${styles.text} leading-relaxed`}>
                            {message}
                        </p>
                        
                        {/* Action buttons */}
                        {actions && actions.length > 0 && (
                            <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2 rtl:space-x-reverse toast-mobile-buttons">
                                {actions.map((action, index) => (
                                    <button
                                        key={index}
                                        onClick={action.onClick}
                                        className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold rounded-md sm:rounded-lg transition-all duration-200 ${
                                            action.primary 
                                                ? `${styles.icon} bg-white/80 hover:bg-white shadow-sm hover:shadow-md` 
                                                : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                                        }`}
                                    >
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Close Button */}
                    <button
                        onClick={() => {
                            setShow(false);
                            setTimeout(onClose, 400);
                        }}
                        className={`flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg flex items-center justify-center hover:bg-white/60 transition-all duration-200 ${styles.icon} hover:scale-110 touch-manipulation close-button`}
                    >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {/* Enhanced progress bar */}
                {duration > 0 && (
                    <div className="mt-2 sm:mt-4 w-full bg-white/30 rounded-full h-1 sm:h-1.5 overflow-hidden">
                        <div 
                            className={`h-1 sm:h-1.5 rounded-full transition-all duration-100 ease-linear ${styles.progress} shadow-sm`}
                            style={{
                                width: `${progress}%`,
                                boxShadow: `0 0 8px ${styles.progress.replace('bg-', '')}`
                            }}
                        />
                    </div>
                )}
            </div>
            
            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%) skewX(-12deg); }
                    100% { transform: translateX(200%) skewX(-12deg); }
                }
            `}</style>
        </div>
    );
};

export default Toast;
