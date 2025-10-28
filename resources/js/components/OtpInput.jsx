import React, { useState, useRef, useEffect } from 'react';

const OtpInput = ({ length = 6, onComplete, disabled = false, error = false }) => {
    const [otp, setOtp] = useState(new Array(length).fill(''));
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index, value) => {
        if (disabled) return;

        // Only allow single digit
        if (value.length > 1) {
            value = value.slice(-1);
        }

        // Only allow numbers
        if (!/^\d*$/.test(value)) {
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value && index < length - 1) {
            setActiveIndex(index + 1);
            inputRefs.current[index + 1]?.focus();
        }

        // Check if all inputs are filled
        if (newOtp.every(digit => digit !== '') && onComplete) {
            onComplete(newOtp.join(''));
        }
    };

    const handleKeyDown = (index, e) => {
        if (disabled) return;

        // Handle backspace
        if (e.key === 'Backspace') {
            if (otp[index]) {
                // Clear current input
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            } else if (index > 0) {
                // Move to previous input
                setActiveIndex(index - 1);
                inputRefs.current[index - 1]?.focus();
            }
        }

        // Handle arrow keys
        if (e.key === 'ArrowLeft' && index > 0) {
            setActiveIndex(index - 1);
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'ArrowRight' && index < length - 1) {
            setActiveIndex(index + 1);
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        if (disabled) return;

        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
        
        if (pastedData.length > 0) {
            const newOtp = [...otp];
            for (let i = 0; i < pastedData.length && i < length; i++) {
                newOtp[i] = pastedData[i];
            }
            setOtp(newOtp);
            
            // Focus on the next empty input or the last input
            const nextIndex = Math.min(pastedData.length, length - 1);
            setActiveIndex(nextIndex);
            inputRefs.current[nextIndex]?.focus();
            
            // Check if all inputs are filled
            if (newOtp.every(digit => digit !== '') && onComplete) {
                onComplete(newOtp.join(''));
            }
        }
    };

    const handleFocus = (index) => {
        if (disabled) return;
        setActiveIndex(index);
    };

    return (
        <div className="flex justify-center gap-2 sm:gap-3 max-w-full px-4">
            {otp.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    onFocus={() => handleFocus(index)}
                    disabled={disabled}
                    className={`
                        w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16
                        text-center text-lg sm:text-xl md:text-2xl font-bold
                        border-2 rounded-lg sm:rounded-xl
                        focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50
                        transition-all duration-300 ease-in-out
                        flex-shrink-0
                        ${error 
                            ? 'border-red-400 bg-red-50/20 text-red-300 shadow-red-500/20' 
                            : activeIndex === index
                                ? 'border-pink-400 bg-pink-50/20 text-pink-300 shadow-pink-500/20 shadow-lg'
                                : 'border-white/40 bg-white/20 text-white placeholder-white/50'
                        }
                        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/30 hover:border-white/60'}
                    `}
                    style={{
                        background: error 
                            ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.1) 100%)' 
                            : activeIndex === index
                                ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(219, 39, 119, 0.15) 100%)'
                                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: error 
                            ? '0 0 20px rgba(239, 68, 68, 0.3)' 
                            : activeIndex === index
                                ? '0 0 20px rgba(236, 72, 153, 0.4)'
                                : '0 4px 15px rgba(0, 0, 0, 0.1)'
                    }}
                />
            ))}
        </div>
    );
};

export default OtpInput;
