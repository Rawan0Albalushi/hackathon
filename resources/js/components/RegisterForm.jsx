import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import AnimatedButton from './AnimatedButton';
import EmailVerification from './EmailVerification';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [showEmailVerification, setShowEmailVerification] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');

    const { register } = useAuth();
    const { language, t } = useLanguage();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
        // Clear field error when user starts typing
        if (fieldErrors[e.target.name]) {
            setFieldErrors({
                ...fieldErrors,
                [e.target.name]: ''
            });
        }
    };

    const handleVerificationComplete = () => {
        setShowEmailVerification(false);
        setRegisteredEmail('');
        navigate('/');
    };

    const handleBackToRegister = () => {
        setShowEmailVerification(false);
        setRegisteredEmail('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setIsLoading(true);
        setError('');
        setFieldErrors({});

        try {
            const response = await register(formData.name, formData.email, formData.password, formData.password_confirmation);
            
            // Check if OTP was sent
            if (response.data && response.data.otp_sent) {
                setRegisteredEmail(formData.email);
                setShowEmailVerification(true);
                setError('');
            } else {
                // Auto-login is already handled in AuthContext, so navigate to home
                navigate('/');
            }
        } catch (err) {
            // Check if it's a validation error with field details
            if (err.response && err.response.data && err.response.data.errors) {
                setFieldErrors(err.response.data.errors);
                setError('يرجى تصحيح الأخطاء أدناه');
            } else {
                setError(err.message || 'فشل في التسجيل');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Show email verification if required
    if (showEmailVerification) {
        return (
            <EmailVerification
                email={registeredEmail}
                onVerificationComplete={handleVerificationComplete}
                onBack={handleBackToRegister}
            />
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-8 sm:py-12 px-3 sm:px-4 lg:px-8 relative overflow-hidden" style={{background: 'linear-gradient(135deg, #003C72 0%, #096289 50%, #D85584 100%)'}}>
            {/* Background Elements */}
            <div className="absolute inset-0 bg-black opacity-20"></div>
            {/* Floating star elements positioned to avoid text overlap - responsive */}
            <div className="star-floating absolute top-6 sm:top-10 right-6 sm:right-10 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 opacity-15 animate-pulse hover-float"></div>
            <div className="star-floating absolute bottom-6 sm:bottom-10 left-6 sm:left-10 w-10 h-10 sm:w-16 sm:h-16 lg:w-20 lg:h-20 opacity-15 animate-pulse delay-1000 hover-float"></div>
            <div className="star-floating absolute top-1/2 right-1/6 sm:right-1/4 w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 opacity-15 animate-pulse delay-500 hover-float"></div>
            
            {/* Additional floating star elements for large screens - positioned away from text areas */}
            <div className="star-floating hidden lg:block absolute top-1/4 left-1/6 w-18 h-18 opacity-10 animate-pulse delay-300 hover-float"></div>
            <div className="star-floating hidden lg:block absolute bottom-1/4 right-1/6 w-22 h-22 opacity-10 animate-pulse delay-700 hover-float"></div>
            <div className="star-floating hidden xl:block absolute top-1/3 left-1/5 w-14 h-14 opacity-10 animate-pulse delay-900 hover-float"></div>
            
            <div className="w-full max-w-md mx-auto">
                <div className="space-y-6 sm:space-y-8 relative z-10">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center mb-6 sm:mb-8 animate-fade-in-down">
                            <img src="/images/star.png" alt="Star" className="w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 object-contain" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 animate-fade-in-up gradient-text">
                            {t('registerTitle')}
                        </h2>
                        <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-indigo-200 animate-fade-in-up animate-delay-200 mb-4 sm:mb-6 px-2">
                            {t('registerSubtitle')}
                        </p>
                        <p className="text-center text-xs sm:text-sm lg:text-base text-indigo-300 animate-fade-in-up animate-delay-300 px-2">
                            {t('haveAccount')}{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="font-medium text-pink-primary hover:text-orange-primary transition-colors duration-300 hover:underline"
                            >
                                {t('loginLink')}
                            </button>
                        </p>
                    </div>
                
                    <form className="mt-6 sm:mt-8 space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-10 space-y-6 sm:space-y-8 animate-fade-in-up animate-delay-400 shadow-2xl border border-white/20">
                            <div>
                                <label htmlFor="name" className="block text-sm sm:text-base lg:text-lg font-semibold text-white mb-2 sm:mb-3">
                                    {t('fullName')}
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    className={`appearance-none relative block w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base lg:text-lg border ${
                                        fieldErrors.name ? 'border-red-500' : 'border-white/30'
                                    } bg-white/15 text-white placeholder-indigo-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 hover:bg-white/20`}
                                    placeholder={t('namePlaceholder')}
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                                {fieldErrors.name && (
                                    <p className="mt-2 text-xs sm:text-sm text-red-400">{fieldErrors.name[0]}</p>
                                )}
                            </div>
                        
                            <div>
                                <label htmlFor="email" className="block text-sm sm:text-base lg:text-lg font-semibold text-white mb-2 sm:mb-3">
                                    {t('email')}
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className={`appearance-none relative block w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base lg:text-lg border ${
                                        fieldErrors.email ? 'border-red-500' : 'border-white/30'
                                    } bg-white/15 text-white placeholder-indigo-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 hover:bg-white/20`}
                                    placeholder={t('emailPlaceholder')}
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {fieldErrors.email && (
                                    <p className="mt-2 text-xs sm:text-sm text-red-400">{fieldErrors.email[0]}</p>
                                )}
                            </div>
                            
                            <div>
                                <label htmlFor="password" className="block text-sm sm:text-base lg:text-lg font-semibold text-white mb-2 sm:mb-3">
                                    {language === 'ar' ? 'كلمة المرور' : 'Password'}
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className={`appearance-none relative block w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base lg:text-lg border ${
                                        fieldErrors.password ? 'border-red-500' : 'border-white/30'
                                    } bg-white/15 text-white placeholder-indigo-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 hover:bg-white/20`}
                                    placeholder={t('passwordPlaceholder')}
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                {fieldErrors.password && (
                                    <p className="mt-2 text-xs sm:text-sm text-red-400">{fieldErrors.password[0]}</p>
                                )}
                            </div>
                            
                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm sm:text-base lg:text-lg font-semibold text-white mb-2 sm:mb-3">
                                    {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                                </label>
                                <input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className={`appearance-none relative block w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base lg:text-lg border ${
                                        fieldErrors.password_confirmation ? 'border-red-500' : 'border-white/30'
                                    } bg-white/15 text-white placeholder-indigo-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 hover:bg-white/20`}
                                    placeholder={t('confirmPasswordPlaceholder')}
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                />
                                {fieldErrors.password_confirmation && (
                                    <p className="mt-2 text-xs sm:text-sm text-red-400">{fieldErrors.password_confirmation[0]}</p>
                                )}
                            </div>
                    </div>

                    {error && <ErrorMessage message={error} />}

                        <div className="animate-fade-in-up animate-delay-600">
                            <AnimatedButton
                                type="submit"
                                disabled={isLoading}
                                className={`group relative w-full flex justify-center items-center py-3 sm:py-4 lg:py-5 px-6 sm:px-8 border border-transparent text-sm sm:text-base lg:text-xl font-bold rounded-xl sm:rounded-2xl text-white bg-gradient-primary hover:bg-gradient-card focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-primary transition-all duration-300 hover-pulse-glow shadow-2xl ${
                                    isLoading ? 'opacity-75 cursor-not-allowed' : ''
                                }`}
                                style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}
                            >
                                {isLoading ? (
                                    <div className="flex items-center space-x-2 sm:space-x-3">
                                        <LoadingSpinner size="sm" variant="wave" />
                                        <span className="text-white font-medium animate-pulse text-sm sm:text-base">
                                            {t('creatingAccount') || 'جاري إنشاء الحساب...'}
                                        </span>
                                    </div>
                                ) : (
                                    t('registerButton')
                                )}
                            </AnimatedButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
