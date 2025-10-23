import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import AdminStats from './admin/AdminStats';
import AdminRegistrations from './admin/AdminRegistrations';
import AdminHackathonRegistrations from './admin/AdminHackathonRegistrations';
import AdminConferenceRegistrations from './admin/AdminConferenceRegistrations';
import AdminWorkshopRegistrations from './admin/AdminWorkshopRegistrations';
import AdminWorkshops from './admin/AdminWorkshops';
import AdminUsers from './admin/AdminUsers';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminPortal = () => {
    const { user, logout, isAdmin } = useAuth();
    const { language, t, toggleLanguage } = useLanguage();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('stats');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setLoading(false);
        }
    }, [user]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!isAdmin()) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
                <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-red-600 mb-4">
                        {language === 'ar' ? 'الوصول مرفوض' : 'Access Denied'}
                    </h1>
                    <p className="text-gray-600">
                        {language === 'ar' ? 'ليس لديك صلاحيات الإدارة' : 'You don\'t have admin privileges.'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Header */}
            <header className="bg-white/90 backdrop-blur-lg shadow-lg border-b border-gray-200/50 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row justify-between items-center py-4 lg:py-6 gap-4">
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                                <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                                    {language === 'ar' ? 'لوحة الإدارة' : 'Admin Dashboard'}
                                </h1>
                                <p className="text-gray-600 text-sm lg:text-base">
                                    {language === 'ar' ? `مرحباً، ${user?.name}` : `Welcome, ${user?.name}`}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 lg:space-x-4 rtl:space-x-reverse">
                            <button
                                onClick={toggleLanguage}
                                className="bg-gradient-to-r from-teal-500 to-navy-600 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-lg text-xs lg:text-sm font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
                            >
                                {language === 'ar' ? 'EN' : 'عربي'}
                            </button>
                            <div className="hidden sm:flex items-center space-x-2 rtl:space-x-reverse bg-gray-100 rounded-lg px-3 py-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm text-gray-600">
                                    {language === 'ar' ? 'مدير' : 'Admin'}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-lg text-xs lg:text-sm font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
                            >
                                {language === 'ar' ? 'خروج' : 'Logout'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-2 lg:space-x-8 rtl:space-x-reverse overflow-x-auto scrollbar-hide mobile-nav-tabs">
                        <button
                            onClick={() => setActiveTab('stats')}
                            className={`py-3 lg:py-4 px-2 lg:px-1 border-b-2 font-medium text-xs lg:text-sm whitespace-nowrap transition-all duration-300 ${
                                activeTab === 'stats'
                                    ? 'border-orange-500 text-orange-600 bg-orange-50/50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
                            }`}
                        >
                            <div className="flex items-center space-x-1 lg:space-x-2 rtl:space-x-reverse">
                                <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <span className="hidden sm:inline">{language === 'ar' ? 'الإحصائيات' : 'Statistics'}</span>
                                <span className="sm:hidden">{language === 'ar' ? 'إحصائيات' : 'Stats'}</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('hackathon')}
                            className={`py-3 lg:py-4 px-2 lg:px-1 border-b-2 font-medium text-xs lg:text-sm whitespace-nowrap transition-all duration-300 ${
                                activeTab === 'hackathon'
                                    ? 'border-pink-500 text-pink-600 bg-pink-50/50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
                            }`}
                        >
                            <div className="flex items-center space-x-1 lg:space-x-2 rtl:space-x-reverse">
                                <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                                <span className="hidden sm:inline">{language === 'ar' ? 'تسجيلات الهاكثون' : 'Hackathon'}</span>
                                <span className="sm:hidden">{language === 'ar' ? 'هاكثون' : 'Hack'}</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('conference')}
                            className={`py-3 lg:py-4 px-2 lg:px-1 border-b-2 font-medium text-xs lg:text-sm whitespace-nowrap transition-all duration-300 ${
                                activeTab === 'conference'
                                    ? 'border-teal-500 text-teal-600 bg-teal-50/50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
                            }`}
                        >
                            <div className="flex items-center space-x-1 lg:space-x-2 rtl:space-x-reverse">
                                <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <span className="hidden sm:inline">{language === 'ar' ? 'تسجيلات المؤتمر' : 'Conference'}</span>
                                <span className="sm:hidden">{language === 'ar' ? 'مؤتمر' : 'Conf'}</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('workshop-registrations')}
                            className={`py-3 lg:py-4 px-2 lg:px-1 border-b-2 font-medium text-xs lg:text-sm whitespace-nowrap transition-all duration-300 ${
                                activeTab === 'workshop-registrations'
                                    ? 'border-navy-500 text-navy-600 bg-navy-50/50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
                            }`}
                        >
                            <div className="flex items-center space-x-1 lg:space-x-2 rtl:space-x-reverse">
                                <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                                <span className="hidden sm:inline">{language === 'ar' ? 'تسجيلات الورش' : 'Workshop Reg'}</span>
                                <span className="sm:hidden">{language === 'ar' ? 'ورش' : 'Works'}</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('workshops')}
                            className={`py-3 lg:py-4 px-2 lg:px-1 border-b-2 font-medium text-xs lg:text-sm whitespace-nowrap transition-all duration-300 ${
                                activeTab === 'workshops'
                                    ? 'border-orange-500 text-orange-600 bg-orange-50/50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
                            }`}
                        >
                            <div className="flex items-center space-x-1 lg:space-x-2 rtl:space-x-reverse">
                                <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <span className="hidden sm:inline">{language === 'ar' ? 'إدارة الورش' : 'Manage Workshops'}</span>
                                <span className="sm:hidden">{language === 'ar' ? 'إدارة' : 'Manage'}</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`py-3 lg:py-4 px-2 lg:px-1 border-b-2 font-medium text-xs lg:text-sm whitespace-nowrap transition-all duration-300 ${
                                activeTab === 'users'
                                    ? 'border-purple-500 text-purple-600 bg-purple-50/50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
                            }`}
                        >
                            <div className="flex items-center space-x-1 lg:space-x-2 rtl:space-x-reverse">
                                <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                                <span className="hidden sm:inline">{language === 'ar' ? 'إدارة المستخدمين' : 'User Management'}</span>
                                <span className="sm:hidden">{language === 'ar' ? 'مستخدمين' : 'Users'}</span>
                            </div>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <main className="max-w-7xl mx-auto py-4 lg:py-6 px-4 sm:px-6 lg:px-8">
                <div className="animate-fade-in-up mobile-content">
                    {activeTab === 'stats' && <AdminStats />}
                    {activeTab === 'registrations' && <AdminRegistrations />}
                    {activeTab === 'hackathon' && <AdminHackathonRegistrations />}
                    {activeTab === 'conference' && <AdminConferenceRegistrations />}
                    {activeTab === 'workshop-registrations' && <AdminWorkshopRegistrations />}
                    {activeTab === 'workshops' && <AdminWorkshops />}
                    {activeTab === 'users' && <AdminUsers />}
                </div>
            </main>
        </div>
    );
};

export default AdminPortal;
