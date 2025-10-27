import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminCheckInStats = () => {
    const { language } = useLanguage();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCheckInStats();
    }, []);

    const fetchCheckInStats = async () => {
        try {
            const response = await fetch('/api/admin/qr/stats', {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success) {
                setStats(data.data);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError(language === 'ar' ? 'فشل في تحميل الإحصائيات' : 'Failed to load statistics');
        } finally {
            setLoading(false);
        }
    };

    const getPercentage = (checkedIn, total) => {
        if (total === 0) return 0;
        return Math.round((checkedIn / total) * 100);
    };

    const getStatusColor = (percentage) => {
        if (percentage >= 80) return 'from-green-500 to-green-600';
        if (percentage >= 60) return 'from-yellow-500 to-yellow-600';
        if (percentage >= 40) return 'from-orange-500 to-orange-600';
        return 'from-red-500 to-red-600';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">
                        {language === 'ar' ? 'جاري تحميل الإحصائيات...' : 'Loading statistics...'}
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/60 rounded-2xl p-8 text-center">
                <div className="text-red-600 text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-red-800 mb-2">
                    {language === 'ar' ? 'خطأ في التحميل' : 'Loading Error'}
                </h3>
                <p className="text-red-700">{error}</p>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-20">
                <div className="text-gray-500 text-6xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {language === 'ar' ? 'لا توجد بيانات' : 'No Data Available'}
                </h3>
                <p className="text-gray-600">
                    {language === 'ar' ? 'لا توجد إحصائيات متاحة حالياً' : 'No statistics available at the moment'}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-2xl blur-lg opacity-60" style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}></div>
                        <div className="relative p-6 rounded-2xl shadow-xl" style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}>
                            <span className="text-white text-4xl">📊</span>
                        </div>
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {language === 'ar' ? 'إحصائيات الحضور' : 'Check-in Statistics'}
                </h1>
                <p className="text-xl text-gray-600">
                    {language === 'ar' 
                        ? 'متابعة حالة حضور المشاركين في جميع الأحداث'
                        : 'Track participant attendance across all events'
                    }
                </p>
            </div>

            {/* Overall Statistics */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    {language === 'ar' ? 'الإحصائيات العامة' : 'Overall Statistics'}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="relative mb-4">
                            <div className="absolute inset-0 rounded-2xl blur-lg opacity-60" style={{background: 'linear-gradient(135deg, #096289 0%, #003C72 100%)'}}></div>
                            <div className="relative p-6 rounded-2xl shadow-xl" style={{background: 'linear-gradient(135deg, #096289 0%, #003C72 100%)'}}>
                                <span className="text-white text-4xl">👥</span>
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.overall.total}</h3>
                        <p className="text-gray-600 text-lg">
                            {language === 'ar' ? 'إجمالي المسجلين' : 'Total Registrations'}
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="relative mb-4">
                            <div className="absolute inset-0 rounded-2xl blur-lg opacity-60" style={{background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'}}></div>
                            <div className="relative p-6 rounded-2xl shadow-xl" style={{background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'}}>
                                <span className="text-white text-4xl">✅</span>
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.overall.checked_in}</h3>
                        <p className="text-gray-600 text-lg">
                            {language === 'ar' ? 'تم تسجيل الحضور' : 'Checked In'}
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="relative mb-4">
                            <div className="absolute inset-0 rounded-2xl blur-lg opacity-60" style={{background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'}}></div>
                            <div className="relative p-6 rounded-2xl shadow-xl" style={{background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'}}>
                                <span className="text-white text-4xl">⏳</span>
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.overall.pending}</h3>
                        <p className="text-gray-600 text-lg">
                            {language === 'ar' ? 'في انتظار الحضور' : 'Pending Check-in'}
                        </p>
                    </div>
                </div>

                {/* Overall Progress Bar */}
                <div className="mt-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                            {language === 'ar' ? 'نسبة الحضور الإجمالية' : 'Overall Attendance Rate'}
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                            {getPercentage(stats.overall.checked_in, stats.overall.total)}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                            className={`h-4 rounded-full bg-gradient-to-r ${getStatusColor(getPercentage(stats.overall.checked_in, stats.overall.total))}`}
                            style={{width: `${getPercentage(stats.overall.checked_in, stats.overall.total)}%`}}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Event-specific Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Hackathon Stats */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/30">
                    <div className="text-center mb-6">
                        <div className="flex justify-center mb-4">
                            <div className="relative">
                                <div className="absolute inset-0 rounded-2xl blur-lg opacity-60" style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}></div>
                                <div className="relative p-4 rounded-2xl shadow-xl" style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}>
                                    <span className="text-white text-3xl">🚀</span>
                                </div>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {language === 'ar' ? 'الهاكثون' : 'Hackathon'}
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                                {language === 'ar' ? 'المسجلين' : 'Registered'}
                            </span>
                            <span className="font-bold text-gray-900">{stats.hackathon.total}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                                {language === 'ar' ? 'حاضر' : 'Present'}
                            </span>
                            <span className="font-bold text-green-600">{stats.hackathon.checked_in}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                                {language === 'ar' ? 'غائب' : 'Absent'}
                            </span>
                            <span className="font-bold text-orange-600">{stats.hackathon.pending}</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">
                                {language === 'ar' ? 'نسبة الحضور' : 'Attendance Rate'}
                            </span>
                            <span className="text-sm font-bold text-gray-900">
                                {getPercentage(stats.hackathon.checked_in, stats.hackathon.total)}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                                className={`h-3 rounded-full bg-gradient-to-r ${getStatusColor(getPercentage(stats.hackathon.checked_in, stats.hackathon.total))}`}
                                style={{width: `${getPercentage(stats.hackathon.checked_in, stats.hackathon.total)}%`}}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Conference Stats */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/30">
                    <div className="text-center mb-6">
                        <div className="flex justify-center mb-4">
                            <div className="relative">
                                <div className="absolute inset-0 rounded-2xl blur-lg opacity-60" style={{background: 'linear-gradient(135deg, #096289 0%, #003C72 100%)'}}></div>
                                <div className="relative p-4 rounded-2xl shadow-xl" style={{background: 'linear-gradient(135deg, #096289 0%, #003C72 100%)'}}>
                                    <span className="text-white text-3xl">🎯</span>
                                </div>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {language === 'ar' ? 'المؤتمر' : 'Conference'}
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                                {language === 'ar' ? 'المسجلين' : 'Registered'}
                            </span>
                            <span className="font-bold text-gray-900">{stats.conference.total}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                                {language === 'ar' ? 'حاضر' : 'Present'}
                            </span>
                            <span className="font-bold text-green-600">{stats.conference.checked_in}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                                {language === 'ar' ? 'غائب' : 'Absent'}
                            </span>
                            <span className="font-bold text-orange-600">{stats.conference.pending}</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">
                                {language === 'ar' ? 'نسبة الحضور' : 'Attendance Rate'}
                            </span>
                            <span className="text-sm font-bold text-gray-900">
                                {getPercentage(stats.conference.checked_in, stats.conference.total)}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                                className={`h-3 rounded-full bg-gradient-to-r ${getStatusColor(getPercentage(stats.conference.checked_in, stats.conference.total))}`}
                                style={{width: `${getPercentage(stats.conference.checked_in, stats.conference.total)}%`}}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Workshop Stats */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/30">
                    <div className="text-center mb-6">
                        <div className="flex justify-center mb-4">
                            <div className="relative">
                                <div className="absolute inset-0 rounded-2xl blur-lg opacity-60" style={{background: 'linear-gradient(135deg, #D85584 0%, #F4A321 100%)'}}></div>
                                <div className="relative p-4 rounded-2xl shadow-xl" style={{background: 'linear-gradient(135deg, #D85584 0%, #F4A321 100%)'}}>
                                    <span className="text-white text-3xl">🛠️</span>
                                </div>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {language === 'ar' ? 'الورش' : 'Workshops'}
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                                {language === 'ar' ? 'المسجلين' : 'Registered'}
                            </span>
                            <span className="font-bold text-gray-900">{stats.workshop.total}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                                {language === 'ar' ? 'حاضر' : 'Present'}
                            </span>
                            <span className="font-bold text-green-600">{stats.workshop.checked_in}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                                {language === 'ar' ? 'غائب' : 'Absent'}
                            </span>
                            <span className="font-bold text-orange-600">{stats.workshop.pending}</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">
                                {language === 'ar' ? 'نسبة الحضور' : 'Attendance Rate'}
                            </span>
                            <span className="text-sm font-bold text-gray-900">
                                {getPercentage(stats.workshop.checked_in, stats.workshop.total)}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                                className={`h-3 rounded-full bg-gradient-to-r ${getStatusColor(getPercentage(stats.workshop.checked_in, stats.workshop.total))}`}
                                style={{width: `${getPercentage(stats.workshop.checked_in, stats.workshop.total)}%`}}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Refresh Button */}
            <div className="text-center">
                <button
                    onClick={fetchCheckInStats}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                    {language === 'ar' ? 'تحديث الإحصائيات' : 'Refresh Statistics'}
                </button>
            </div>
        </div>
    );
};

export default AdminCheckInStats;
