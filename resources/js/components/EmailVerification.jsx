import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import OtpInput from './OtpInput';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import AnimatedButton from './AnimatedButton';

const EmailVerification = ({ email, onVerificationComplete, onBack, initialOtpSent = false }) => {
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [otpSent, setOtpSent] = useState(initialOtpSent);

    const { language, t } = useLanguage();
    const navigate = useNavigate();

    // Countdown timer
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    // Send initial OTP (only if it wasn't already sent on the server)
    useEffect(() => {
        if (email && !otpSent) {
            // Suppress visible error on first load
            sendOtp(true);
        }
    }, [email, otpSent]);

    const sendOtp = async (isInitial = false) => {
        setIsLoading(true);
        setError('');
        
        try {
            // Get CSRF token first
            const csrfResponse = await fetch('/api/csrf-token', {
                credentials: 'include',
            });
            const csrfData = await csrfResponse.json();
            
            const response = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfData.csrf_token,
                },
                credentials: 'include',
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (data.success) {
                setOtpSent(true);
                setCountdown(60); // 60 seconds cooldown
                setSuccess('تم إرسال كود التحقق إلى بريدك الإلكتروني');
            } else {
                // Avoid scaring users with an error before any action on first load
                if (!isInitial) {
                    setError(data.message || 'فشل في إرسال كود التحقق');
                }
            }
        } catch (err) {
            if (!isInitial) {
                setError('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const resendOtp = async () => {
        if (countdown > 0) return;
        
        setIsResending(true);
        setError('');
        
        try {
            // Get CSRF token first
            const csrfResponse = await fetch('/api/csrf-token', {
                credentials: 'include',
            });
            const csrfData = await csrfResponse.json();
            
            const response = await fetch('/api/auth/resend-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfData.csrf_token,
                },
                credentials: 'include',
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (data.success) {
                setCountdown(60);
                setSuccess('تم إعادة إرسال كود التحقق');
            } else {
                setError(data.message || 'فشل في إعادة إرسال كود التحقق');
            }
        } catch (err) {
            setError('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.');
        } finally {
            setIsResending(false);
        }
    };

    const verifyOtp = async (otpCode) => {
        setIsLoading(true);
        setError('');
        
        try {
            // Get CSRF token first
            const csrfResponse = await fetch('/api/csrf-token', {
                credentials: 'include',
            });
            const csrfData = await csrfResponse.json();
            
            const response = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfData.csrf_token,
                },
                credentials: 'include',
                body: JSON.stringify({ 
                    email, 
                    code: otpCode 
                })
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('تم التحقق من بريدك الإلكتروني بنجاح!');
                setTimeout(() => {
                    if (onVerificationComplete) {
                        onVerificationComplete();
                    } else {
                        navigate('/');
                    }
                }, 1500);
            } else {
                setError(data.message || 'كود التحقق غير صحيح');
            }
        } catch (err) {
            setError('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpComplete = (otpCode) => {
        setOtp(otpCode);
        verifyOtp(otpCode);
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-8 sm:py-12 lg:py-16 px-3 sm:px-4 lg:px-8 relative overflow-visible" style={{background: 'linear-gradient(135deg, #003C72 0%, #096289 50%, #D85584 100%)'}}>
            {/* Background Elements */}
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="star-floating absolute top-6 sm:top-10 right-6 sm:right-10 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 opacity-15 animate-pulse hover-float"></div>
            <div className="star-floating absolute bottom-6 sm:bottom-10 left-6 sm:left-10 w-10 h-10 sm:w-16 sm:h-16 lg:w-20 lg:h-20 opacity-15 animate-pulse delay-1000 hover-float"></div>
            <div className="star-floating absolute top-1/2 right-1/6 sm:right-1/4 w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 opacity-15 animate-pulse delay-500 hover-float"></div>
            
            <div className="w-full max-w-3xl mx-auto">
                <div className="space-y-6 sm:space-y-8 relative z-10 py-2 sm:py-4">
                    <div className="text-center">
                        <div className="mx-auto mb-6 sm:mb-8 shadow-2xl animate-fade-in-down rounded-2xl sm:rounded-3xl overflow-hidden w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center bg-transparent">
                            <img src="/images/star.png" alt="Star" className="w-full h-full object-cover" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 animate-fade-in-up gradient-text text-center w-full" style={{lineHeight: '1.1', paddingBottom: '0.5rem'}}>
                            تحقق من بريدك الإلكتروني
                        </h2>
                        <div className="space-y-3 animate-fade-in-up animate-delay-200">
                            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-indigo-200/90 px-2">
                                تم إرسال كود التحقق إلى
                            </p>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 inline-block">
                                <p className="text-base sm:text-lg lg:text-xl text-pink-300 font-semibold">
                                    {email}
                                </p>
                            </div>
                            {/* Debug: Show OTP for testing */}
                            {process.env.NODE_ENV === 'development' && (
                                <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-4 mt-4">
                                    <p className="text-sm text-yellow-300 font-medium">
                                        للاختبار: الكود الصحيح هو 115095
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="max-w-md mx-auto bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 space-y-8 sm:space-y-10 animate-fade-in-up animate-delay-400 shadow-2xl border border-white/20">
                        <div className="text-center space-y-6">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <p className="text-base sm:text-lg text-white/90 font-medium">
                                        أدخل كود التحقق المكون من 6 أرقام
                                    </p>
                                    <p className="text-xs sm:text-sm text-indigo-300/70">
                                        سيتم التحقق تلقائياً عند إدخال الكود كاملاً
                                    </p>
                                </div>
                                
                                <div className="flex justify-center">
                                    <OtpInput
                                        length={6}
                                        onComplete={handleOtpComplete}
                                        disabled={isLoading}
                                        error={!!error}
                                    />
                                </div>
                                
                                {isLoading && (
                                    <div className="flex items-center justify-center space-x-2 text-pink-300">
                                        <LoadingSpinner size="sm" variant="dots" />
                                        <span className="text-sm">جاري التحقق...</span>
                                    </div>
                                )}
                            </div>
                            
                            {success && (
                                <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4 animate-fade-in">
                                    <p className="text-sm sm:text-base text-green-300 font-medium">
                                        {success}
                                    </p>
                                </div>
                            )}
                            
                            {error && (
                                <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 animate-fade-in">
                                    <p className="text-sm sm:text-base text-red-300 font-medium">
                                        {error}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="text-center space-y-6">
                            <div className="space-y-3">
                                <p className="text-sm sm:text-base text-indigo-300/80">
                                    لم تستلم الكود؟
                                </p>
                                
                                <AnimatedButton
                                    onClick={resendOtp}
                                    disabled={isResending || countdown > 0}
                                    className={`w-full py-4 sm:py-5 px-6 sm:px-8 text-sm sm:text-base font-bold rounded-xl sm:rounded-2xl text-white border-2 transition-all duration-300 ${
                                        isResending || countdown > 0 
                                            ? 'opacity-50 cursor-not-allowed border-white/20 bg-white/5' 
                                            : 'border-white/40 bg-white/15 hover:bg-white/25 hover:border-white/60 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50'
                                    }`}
                                    style={{
                                        background: isResending || countdown > 0 
                                            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
                                            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)',
                                        backdropFilter: 'blur(10px)',
                                        boxShadow: isResending || countdown > 0 
                                            ? 'none'
                                            : '0 4px 15px rgba(0, 0, 0, 0.1)'
                                    }}
                                >
                                    {isResending ? (
                                        <div className="flex items-center justify-center space-x-3">
                                            <LoadingSpinner size="sm" variant="dots" />
                                            <span>جاري الإرسال...</span>
                                        </div>
                                    ) : countdown > 0 ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <span>إعادة الإرسال خلال</span>
                                            <span className="font-bold text-pink-300">{countdown}</span>
                                            <span>ثانية</span>
                                        </div>
                                    ) : (
                                        'إعادة إرسال الكود'
                                    )}
                                </AnimatedButton>
                            </div>
                            
                            {onBack && (
                                <button
                                    onClick={onBack}
                                    className="text-sm sm:text-base text-indigo-300/80 hover:text-white transition-colors duration-300 hover:underline font-medium"
                                >
                                    العودة لتسجيل الدخول
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;
