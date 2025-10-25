import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import AnimatedButton from './AnimatedButton';

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setIsLoading(true);
        setError('');
        setFieldErrors({});

        try {
            await register(formData.name, formData.email, formData.password, formData.password_confirmation);
            // Auto-login is already handled in AuthContext, so navigate to home
            navigate('/');
        } catch (err) {
            // Check if it's a validation error with field details
            if (err.response && err.response.data && err.response.data.errors) {
                setFieldErrors(err.response.data.errors);
                setError('يرجى تصحيح الأخطاء أدناه');
            } else {
                setError(err.message || 'Registration failed');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{background: 'linear-gradient(135deg, #003C72 0%, #096289 50%, #D85584 100%)'}}>
            {/* Background Elements */}
            <div className="absolute inset-0 bg-black opacity-20"></div>
            {/* Floating elements positioned to avoid text overlap */}
            <div className="login-floating-bg absolute top-10 right-10 w-16 h-16 rounded-full opacity-15 animate-pulse hover-float" style={{background: '#D85584'}}></div>
            <div className="login-floating-bg absolute bottom-10 left-10 w-20 h-20 rounded-full opacity-15 animate-pulse delay-1000 hover-float" style={{background: '#F4A321'}}></div>
            <div className="login-floating-bg absolute top-1/2 right-1/4 w-12 h-12 rounded-full opacity-15 animate-pulse delay-500 hover-float" style={{background: '#096289'}}></div>
            
            {/* Additional floating elements for large screens - positioned away from text areas */}
            <div className="login-floating-bg hidden lg:block absolute top-1/4 left-1/6 w-18 h-18 rounded-full opacity-10 animate-pulse delay-300 hover-float" style={{background: '#F4A321'}}></div>
            <div className="login-floating-bg hidden lg:block absolute bottom-1/4 right-1/6 w-22 h-22 rounded-full opacity-10 animate-pulse delay-700 hover-float" style={{background: '#D85584'}}></div>
            <div className="login-floating-bg hidden xl:block absolute top-1/3 left-1/5 w-14 h-14 rounded-full opacity-10 animate-pulse delay-900 hover-float" style={{background: '#096289'}}></div>
            
            <div className="w-full max-w-md mx-auto">
                <div className="space-y-8 relative z-10">
                    <div className="text-center">
                        <div className="mx-auto w-20 h-20 lg:w-24 lg:h-24 rounded-3xl flex items-center justify-center mb-8 shadow-2xl animate-fade-in-down" style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}>
                            <span className="text-white text-3xl lg:text-4xl font-bold">✨</span>
                        </div>
                        <h2 className="text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in-up gradient-text">
                            {t('registerTitle')}
                        </h2>
                        <p className="text-lg lg:text-xl text-indigo-200 animate-fade-in-up animate-delay-200 mb-6">
                            {t('registerSubtitle')}
                        </p>
                        <p className="text-center text-sm lg:text-base text-indigo-300 animate-fade-in-up animate-delay-300">
                            {t('haveAccount')}{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="font-medium text-pink-primary hover:text-orange-primary transition-colors duration-300 hover:underline"
                            >
                                {t('loginLink')}
                            </button>
                        </p>
                    </div>
                
                    <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
                        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 lg:p-10 space-y-8 animate-fade-in-up animate-delay-400 shadow-2xl border border-white/20">
                            <div>
                                <label htmlFor="name" className="block text-lg font-semibold text-white mb-3">
                                    {t('fullName')}
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    className={`appearance-none relative block w-full px-6 py-4 text-lg border ${
                                        fieldErrors.name ? 'border-red-500' : 'border-white/30'
                                    } bg-white/15 text-white placeholder-indigo-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 hover:bg-white/20`}
                                    placeholder={t('namePlaceholder')}
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                                {fieldErrors.name && (
                                    <p className="mt-2 text-sm text-red-400">{fieldErrors.name[0]}</p>
                                )}
                            </div>
                        
                            <div>
                                <label htmlFor="email" className="block text-lg font-semibold text-white mb-3">
                                    {t('email')}
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className={`appearance-none relative block w-full px-6 py-4 text-lg border ${
                                        fieldErrors.email ? 'border-red-500' : 'border-white/30'
                                    } bg-white/15 text-white placeholder-indigo-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 hover:bg-white/20`}
                                    placeholder={t('emailPlaceholder')}
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {fieldErrors.email && (
                                    <p className="mt-2 text-sm text-red-400">{fieldErrors.email[0]}</p>
                                )}
                            </div>
                            
                            <div>
                                <label htmlFor="password" className="block text-lg font-semibold text-white mb-3">
                                    {language === 'ar' ? 'كلمة المرور' : 'Password'}
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className={`appearance-none relative block w-full px-6 py-4 text-lg border ${
                                        fieldErrors.password ? 'border-red-500' : 'border-white/30'
                                    } bg-white/15 text-white placeholder-indigo-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 hover:bg-white/20`}
                                    placeholder={t('passwordPlaceholder')}
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                {fieldErrors.password && (
                                    <p className="mt-2 text-sm text-red-400">{fieldErrors.password[0]}</p>
                                )}
                            </div>
                            
                            <div>
                                <label htmlFor="password_confirmation" className="block text-lg font-semibold text-white mb-3">
                                    {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                                </label>
                                <input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className={`appearance-none relative block w-full px-6 py-4 text-lg border ${
                                        fieldErrors.password_confirmation ? 'border-red-500' : 'border-white/30'
                                    } bg-white/15 text-white placeholder-indigo-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 hover:bg-white/20`}
                                    placeholder={t('confirmPasswordPlaceholder')}
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                />
                                {fieldErrors.password_confirmation && (
                                    <p className="mt-2 text-sm text-red-400">{fieldErrors.password_confirmation[0]}</p>
                                )}
                            </div>
                    </div>

                    {error && <ErrorMessage message={error} />}

                        <div className="animate-fade-in-up animate-delay-600">
                            <AnimatedButton
                                type="submit"
                                disabled={isLoading}
                                className={`group relative w-full flex justify-center items-center py-5 px-8 border border-transparent text-xl font-bold rounded-2xl text-white bg-gradient-primary hover:bg-gradient-card focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-primary transition-all duration-300 transform hover:scale-105 hover-pulse-glow shadow-2xl ${
                                    isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:scale-105'
                                }`}
                                style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}
                            >
                                {isLoading ? (
                                    <div className="flex items-center space-x-3">
                                        <LoadingSpinner size="sm" variant="wave" />
                                        <span className="text-white font-medium animate-pulse">
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
