import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import AdminStats from './AdminStats';
import AdminRegistrations from './AdminRegistrations';

const AdminDashboardMain = () => {
    const { language, t } = useLanguage();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({
        totalRegistrations: 0,
        hackathonRegistrations: 0,
        workshopRegistrations: 0,
        conferenceRegistrations: 0,
        todayRegistrations: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/admin/stats');
                const data = await response.json();
                
                if (data.success) {
                    setStats(data.data);
                }
            } catch (err) {
                console.error('Error fetching stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const tabs = [
        { 
            id: 'dashboard', 
            label: language === 'ar' ? 'لوحة التحكم' : 'Dashboard', 
            icon: 'dashboard'
        },
        { 
            id: 'stats', 
            label: language === 'ar' ? 'الإحصائيات' : 'Statistics', 
            icon: 'chart',
            component: AdminStats
        },
        { 
            id: 'registrations', 
            label: language === 'ar' ? 'التسجيلات' : 'Registrations', 
            icon: 'users',
            component: AdminRegistrations
        }
    ];

    const getIcon = (iconName) => {
        const icons = {
            dashboard: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                </svg>
            ),
            chart: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            users: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            )
        };
        return icons[iconName] || icons.dashboard;
    };

    const renderDashboardOverview = () => (
        <div className="p-6 h-full">
            <div className="space-y-6 h-full">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    {language === 'ar' ? 'إجمالي التسجيلات' : 'Total Registrations'}
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {loading ? (
                                        <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                                    ) : (
                                        stats.totalRegistrations
                                    )}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}>
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    {language === 'ar' ? 'تسجيلات اليوم' : 'Today\'s Registrations'}
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {loading ? (
                                        <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                                    ) : (
                                        stats.todayRegistrations
                                    )}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    {language === 'ar' ? 'الهاكثون' : 'Hackathon'}
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {loading ? (
                                        <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                                    ) : (
                                        stats.hackathonRegistrations
                                    )}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    {language === 'ar' ? 'الورشة' : 'Workshop'}
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {loading ? (
                                        <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                                    ) : (
                                        stats.workshopRegistrations
                                    )}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200/50 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {language === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
                    </h3>
                    <div className="space-y-4">
                        <div className="text-center text-gray-500 py-8">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p>{language === 'ar' ? 'لا توجد أنشطة حديثة' : 'No recent activity'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderActiveComponent = () => {
        const activeTabData = tabs.find(tab => tab.id === activeTab);
        if (activeTabData?.component) {
            const Component = activeTabData.component;
            return <Component />;
        }
        return renderDashboardOverview();
    };

    return (
        <div className="h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200/50 flex-shrink-0">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">A</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    {t('adminDashboard')}
                                </h1>
                                <p className="text-sm text-gray-600">
                                    {t('manageRegistrations')}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="text-sm text-gray-500">
                                {t('lastUpdated')} {new Date().toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                            </div>
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
                    <nav className="p-4 space-y-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
                                }`}
                            >
                                {getIcon(tab.icon)}
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto">
                    {renderActiveComponent()}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardMain;