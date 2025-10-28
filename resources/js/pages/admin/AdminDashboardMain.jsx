import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import AdminStats from './AdminStats';
import AdminRegistrations from './AdminRegistrations';
import AdminHackathonRegistrations from './AdminHackathonRegistrations';
import AdminConferenceRegistrations from './AdminConferenceRegistrations';
import AdminWorkshopRegistrations from './AdminWorkshopRegistrations';
import AdminWorkshops from './AdminWorkshops';
import AdminUsers from './AdminUsers';
import AdminCheckInStats from './AdminCheckInStats';
import AdminQRScanner from './AdminQRScanner';

const AdminDashboardMain = () => {
    const { language, toggleLanguage } = useLanguage();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('stats');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleNavigationClick = (item) => {
        if (item.isExternal) {
            navigate(item.externalPath);
        } else {
            setActiveTab(item.id);
        }
    };

    const navigationItems = [
        {
            id: 'stats',
            label: language === 'ar' ? 'الإحصائيات' : 'Statistics',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            color: 'from-orange-500 to-orange-600'
        },
        {
            id: 'hackathon',
            label: language === 'ar' ? 'تسجيلات الهاكثون' : 'Hackathon',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
            ),
            color: 'from-pink-500 to-pink-600'
        },
        {
            id: 'conference',
            label: language === 'ar' ? 'تسجيلات المؤتمر' : 'Conference',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            color: 'from-teal-500 to-teal-600'
        },
        {
            id: 'workshop-registrations',
            label: language === 'ar' ? 'تسجيلات الورش' : 'Workshop Reg',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            ),
            color: 'from-navy-500 to-navy-600'
        },
        {
            id: 'workshops',
            label: language === 'ar' ? 'إدارة الورش' : 'Manage Workshops',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            color: 'from-orange-500 to-orange-600'
        },
        {
            id: 'users',
            label: language === 'ar' ? 'إدارة المستخدمين' : 'User Management',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
            ),
            color: 'from-purple-500 to-purple-600'
        },
        {
            id: 'checkin-stats',
            label: language === 'ar' ? 'إحصائيات الحضور' : 'Check-in Stats',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            color: 'from-indigo-500 to-indigo-600'
        },
        {
            id: 'qr-scanner',
            label: language === 'ar' ? 'مسح QR Code' : 'QR Scanner',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
            ),
            color: 'from-green-500 to-green-600'
        }
    ];



    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Sidebar */}
            <div className={`fixed inset-y-0 ${language === 'ar' ? 'right-0' : 'left-0'} z-50 w-64 admin-sidebar ${
                sidebarOpen ? 'translate-x-0' : `${language === 'ar' ? 'translate-x-full' : '-translate-x-full'} lg:translate-x-0`
            }`}>
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                                {language === 'ar' ? 'لوحة الإدارة' : 'Admin Panel'}
                            </h2>
                            <p className="text-xs text-gray-500">
                                {language === 'ar' ? 'نظام الإدارة' : 'Management System'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="p-4 space-y-2">
                    {navigationItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                handleNavigationClick(item);
                                setSidebarOpen(false);
                            }}
                            className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-xl text-left group admin-sidebar-item sidebar-button ${
                                activeTab === item.id
                                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg active`
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:shadow-md'
                            }`}
                        >
                            <div className={`p-2 rounded-lg ${
                                activeTab === item.id 
                                    ? 'bg-white/20' 
                                    : 'bg-gray-100 group-hover:bg-white'
                            }`}>
                                {item.icon}
                            </div>
                            <span className="font-medium">{item.label}</span>
                            {activeTab === item.id && (
                                <div className="ml-auto rtl:ml-0 rtl:mr-auto">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/50 sidebar-footer">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-navy-600 rounded-full flex items-center justify-center sidebar-user-avatar">
                            <span className="text-white text-sm font-bold">
                                {user?.name?.charAt(0)?.toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-500">
                                {language === 'ar' ? 'مدير النظام' : 'System Admin'}
                            </p>
                        </div>
                    </div>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                        <button
                            onClick={toggleLanguage}
                            className="flex-1 bg-gradient-to-r from-teal-500 to-navy-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:shadow-lg"
                        >
                            {language === 'ar' ? 'English' : 'العربية'}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:shadow-lg"
                        >
                            {language === 'ar' ? 'خروج' : 'Logout'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden mobile-sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className={`flex-1 flex flex-col admin-main-content ${language === 'ar' ? 'mr-0 lg:mr-64' : 'ml-0 lg:ml-64'}`}>
                {/* Top Header */}
                <header className="bg-white/90 backdrop-blur-lg shadow-lg border-b border-gray-200/50 sticky top-0 z-30">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between py-4">
                            <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                                <div>
                                    <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                                        {navigationItems.find(item => item.id === activeTab)?.label}
                                    </h1>
                                    <p className="text-sm text-gray-600">
                                        {language === 'ar' ? `مرحباً، ${user?.name}` : `Welcome, ${user?.name}`}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <div className="hidden sm:flex items-center space-x-2 rtl:space-x-reverse bg-gray-100 rounded-lg px-3 py-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-gray-600">
                                        {language === 'ar' ? 'متصل' : 'Online'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto">
                    <div className="p-4 sm:p-6 lg:p-8">
                        <div className="animate-fade-in-up">
                            {activeTab === 'stats' && <AdminStats />}
                            {activeTab === 'registrations' && <AdminRegistrations />}
                            {activeTab === 'hackathon' && <AdminHackathonRegistrations />}
                            {activeTab === 'conference' && <AdminConferenceRegistrations />}
                            {activeTab === 'workshop-registrations' && <AdminWorkshopRegistrations />}
                            {activeTab === 'workshops' && <AdminWorkshops />}
                            {activeTab === 'users' && <AdminUsers />}
                            {activeTab === 'checkin-stats' && <AdminCheckInStats />}
                            {activeTab === 'qr-scanner' && <AdminQRScanner />}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboardMain;