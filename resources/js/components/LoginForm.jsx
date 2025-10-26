import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import AnimatedButton from './AnimatedButton';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const { language, t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await login(formData.email, formData.password);
            // Redirect based on user role or intended destination
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-8 sm:py-12 lg:py-16 px-3 sm:px-4 lg:px-8 relative overflow-visible" style={{background: 'linear-gradient(135deg, #003C72 0%, #096289 50%, #D85584 100%)'}}>
            {/* Background Elements */}
            <div className="absolute inset-0 bg-black opacity-20"></div>
            {/* Floating elements positioned to avoid text overlap - responsive */}
            <div className="login-floating-bg absolute top-6 sm:top-10 right-6 sm:right-10 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full opacity-15 animate-pulse hover-float" style={{background: '#D85584'}}></div>
            <div className="login-floating-bg absolute bottom-6 sm:bottom-10 left-6 sm:left-10 w-10 h-10 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full opacity-15 animate-pulse delay-1000 hover-float" style={{background: '#F4A321'}}></div>
            <div className="login-floating-bg absolute top-1/2 right-1/6 sm:right-1/4 w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 rounded-full opacity-15 animate-pulse delay-500 hover-float" style={{background: '#096289'}}></div>
            
            {/* Additional floating elements for large screens - positioned away from text areas */}
            <div className="login-floating-bg hidden lg:block absolute top-1/4 left-1/6 w-18 h-18 rounded-full opacity-10 animate-pulse delay-300 hover-float" style={{background: '#F4A321'}}></div>
            <div className="login-floating-bg hidden lg:block absolute bottom-1/4 right-1/6 w-22 h-22 rounded-full opacity-10 animate-pulse delay-700 hover-float" style={{background: '#D85584'}}></div>
            <div className="login-floating-bg hidden xl:block absolute top-1/3 left-1/5 w-14 h-14 rounded-full opacity-10 animate-pulse delay-900 hover-float" style={{background: '#096289'}}></div>
            
            <div className="w-full max-w-md mx-auto">
                <div className="space-y-6 sm:space-y-8 relative z-10 py-2 sm:py-4">
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-6 sm:mb-8 shadow-2xl animate-fade-in-down" style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}>
                            <span className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold">👤</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 animate-fade-in-up gradient-text" style={{lineHeight: '1.1', paddingBottom: '0.5rem'}}>
                            {t('loginTitle')}
                        </h2>
                        <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-indigo-200 animate-fade-in-up animate-delay-200 mb-4 sm:mb-6 px-2">
                            {t('loginSubtitle')}
                        </p>
                        <p className="text-center text-xs sm:text-sm lg:text-base text-indigo-300 animate-fade-in-up animate-delay-300 px-2">
                            {t('noAccount')}{' '}
                            <button
                                onClick={() => navigate('/register')}
                                className="font-medium text-pink-primary hover:text-orange-primary transition-colors duration-300 hover:underline"
                            >
                                {t('createAccount')}
                            </button>
                        </p>
                    </div>
                    
                    <form className="mt-6 sm:mt-8 space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-10 space-y-6 sm:space-y-8 animate-fade-in-up animate-delay-400 shadow-2xl border border-white/20">
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
                                    className="appearance-none relative block w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base lg:text-lg border border-white/30 bg-white/15 text-white placeholder-indigo-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 hover:bg-white/20"
                                    placeholder={t('emailPlaceholder')}
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm sm:text-base lg:text-lg font-semibold text-white mb-2 sm:mb-3">
                                    {language === 'ar' ? 'كلمة المرور' : 'Password'}
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none relative block w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base lg:text-lg border border-white/30 bg-white/15 text-white placeholder-indigo-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 hover:bg-white/20"
                                    placeholder={t('passwordPlaceholder')}
                                    value={formData.password}
                                    onChange={handleChange}
                                />
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
                                        <LoadingSpinner size="sm" variant="dots" />
                                        <span className="text-white font-medium animate-pulse text-sm sm:text-base">
                                            {t('loggingIn') || 'جاري تسجيل الدخول...'}
                                        </span>
                                    </div>
                                ) : (
                                    t('loginButton')
                                )}
                            </AnimatedButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
