import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{background: 'linear-gradient(135deg, #003C72 0%, #096289 50%, #D85584 100%)'}}>
            {/* Background Elements */}
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="absolute top-20 left-10 w-20 h-20 rounded-full opacity-20 animate-pulse hover-float" style={{background: '#D85584'}}></div>
            <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full opacity-20 animate-pulse delay-1000 hover-float" style={{background: '#F4A321'}}></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full opacity-20 animate-pulse delay-500 hover-float" style={{background: '#096289'}}></div>
            
            <div className="max-w-md w-full space-y-8 relative z-10">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg animate-fade-in-down" style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}>
                        <span className="text-white text-2xl font-bold">👤</span>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-2 animate-fade-in-up gradient-text">
                        تسجيل الدخول
                    </h2>
                    <p className="text-indigo-200 animate-fade-in-up animate-delay-200">
                        مرحباً بك في ملتقى الابتكار 2025
                    </p>
                    <p className="mt-4 text-center text-sm text-indigo-300 animate-fade-in-up animate-delay-300">
                        ليس لديك حساب؟{' '}
                        <button
                            onClick={() => navigate('/register')}
                            className="font-medium text-pink-400 hover:text-pink-300 transition-colors duration-300"
                        >
                            إنشاء حساب جديد
                        </button>
                    </p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 space-y-6 animate-fade-in-up animate-delay-400">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                                البريد الإلكتروني
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-white/20 bg-white/10 text-white placeholder-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                                placeholder="أدخل بريدك الإلكتروني"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                                كلمة المرور
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-white/20 bg-white/10 text-white placeholder-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                                placeholder="أدخل كلمة المرور"
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
                            className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 hover-pulse-glow shadow-lg"
                        >
                            {isLoading ? (
                                <LoadingSpinner size="sm" />
                            ) : (
                                'تسجيل الدخول'
                            )}
                        </AnimatedButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
