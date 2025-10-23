import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
            navigate('/login');
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
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="absolute top-20 left-10 w-20 h-20 bg-pink-500 rounded-full opacity-20 animate-pulse hover-float"></div>
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500 rounded-full opacity-20 animate-pulse delay-1000 hover-float"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-cyan-500 rounded-full opacity-20 animate-pulse delay-500 hover-float"></div>
            
            <div className="max-w-md w-full space-y-8 relative z-10">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg animate-fade-in-down">
                        <span className="text-white text-2xl font-bold">✨</span>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-2 animate-fade-in-up gradient-text">
                        إنشاء حساب جديد
                    </h2>
                    <p className="text-indigo-200 animate-fade-in-up animate-delay-200">
                        انضم إلى ملتقى الابتكار 2025
                    </p>
                    <p className="mt-4 text-center text-sm text-indigo-300 animate-fade-in-up animate-delay-300">
                        لديك حساب بالفعل؟{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="font-medium text-pink-400 hover:text-pink-300 transition-colors duration-300"
                        >
                            تسجيل الدخول
                        </button>
                    </p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 space-y-6 animate-fade-in-up animate-delay-400">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                                الاسم الكامل
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                className={`appearance-none relative block w-full px-4 py-3 border ${
                                    fieldErrors.name ? 'border-red-500' : 'border-white/20'
                                } bg-white/10 text-white placeholder-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300`}
                                placeholder="أدخل اسمك الكامل"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {fieldErrors.name && (
                                <p className="mt-1 text-sm text-red-400">{fieldErrors.name[0]}</p>
                            )}
                        </div>
                        
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
                                className={`appearance-none relative block w-full px-4 py-3 border ${
                                    fieldErrors.email ? 'border-red-500' : 'border-white/20'
                                } bg-white/10 text-white placeholder-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300`}
                                placeholder="أدخل بريدك الإلكتروني"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {fieldErrors.email && (
                                <p className="mt-1 text-sm text-red-400">{fieldErrors.email[0]}</p>
                            )}
                        </div>
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                                كلمة المرور
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className={`appearance-none relative block w-full px-4 py-3 border ${
                                    fieldErrors.password ? 'border-red-500' : 'border-white/20'
                                } bg-white/10 text-white placeholder-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300`}
                                placeholder="أدخل كلمة المرور"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {fieldErrors.password && (
                                <p className="mt-1 text-sm text-red-400">{fieldErrors.password[0]}</p>
                            )}
                        </div>
                        
                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-white mb-2">
                                تأكيد كلمة المرور
                            </label>
                            <input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                autoComplete="new-password"
                                required
                                className={`appearance-none relative block w-full px-4 py-3 border ${
                                    fieldErrors.password_confirmation ? 'border-red-500' : 'border-white/20'
                                } bg-white/10 text-white placeholder-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300`}
                                placeholder="أكد كلمة المرور"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                            />
                            {fieldErrors.password_confirmation && (
                                <p className="mt-1 text-sm text-red-400">{fieldErrors.password_confirmation[0]}</p>
                            )}
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
                                'إنشاء الحساب'
                            )}
                        </AnimatedButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
