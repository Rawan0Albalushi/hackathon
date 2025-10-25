import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    const { user } = useAuth();
    const { language } = useLanguage();
    const [registrations, setRegistrations] = useState({
        hackathon: null,
        conference: null,
        workshops: []
    });
    const [availableWorkshops, setAvailableWorkshops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserRegistrations();
        fetchAvailableWorkshops();
    }, []);

    const fetchUserRegistrations = async () => {
        try {
            const response = await fetch('/api/user/registrations', {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success) {
                setRegistrations(data.data);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('فشل في تحميل بيانات التسجيل');
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableWorkshops = async () => {
        try {
            const response = await fetch('/api/user/workshops', {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success) {
                setAvailableWorkshops(data.data);
            }
        } catch (err) {
            console.error('فشل في تحميل الورش المتاحة');
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'pending': {
                bg: 'bg-gradient-to-r from-yellow-400 to-orange-400',
                text: 'text-white',
                icon: '⏳',
                label: language === 'ar' ? 'قيد المراجعة' : 'Under Review'
            },
            'approved': {
                bg: 'bg-gradient-to-r from-green-400 to-emerald-500',
                text: 'text-white',
                icon: '✅',
                label: language === 'ar' ? 'مقبول' : 'Approved'
            },
            'rejected': {
                bg: 'bg-gradient-to-r from-red-400 to-pink-500',
                text: 'text-white',
                icon: '❌',
                label: language === 'ar' ? 'مرفوض' : 'Rejected'
            }
        };

        const config = statusConfig[status] || statusConfig['pending'];

        return (
            <div className={`${config.bg} ${config.text} px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center space-x-2 rtl:space-x-reverse`}>
                <span className="text-lg">{config.icon}</span>
                <span>{config.label}</span>
            </div>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 mx-auto"></div>
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto absolute top-0 left-1/2 transform -translate-x-1/2"></div>
                    </div>
                    <p className="mt-6 text-gray-700 text-lg font-medium">
                        {language === 'ar' ? 'جاري تحميل لوحة التحكم...' : 'Loading Dashboard...'}
                    </p>
                    <div className="mt-4 flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-200"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-3xl">
                                <span className="text-4xl">🎛️</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                        </h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            {language === 'ar' 
                                ? `مرحباً ${user?.name}، يمكنك هنا متابعة حالة طلبات التسجيل الخاصة بك`
                                : `Welcome ${user?.name}, track your registration status here`
                            }
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">

                {error && (
                    <div className="mb-8 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <div className="bg-red-100 p-3 rounded-full">
                                <span className="text-red-600 text-xl">⚠️</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-red-800">
                                    {language === 'ar' ? 'حدث خطأ' : 'Error Occurred'}
                                </h3>
                                <div className="mt-1 text-red-700">{error}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-2xl">
                                <span className="text-2xl">🚀</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {registrations.hackathon ? '1' : '0'}
                                </h3>
                                <p className="text-gray-600">
                                    {language === 'ar' ? 'تسجيل الهاكثون' : 'Hackathon Registration'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-4 rounded-2xl">
                                <span className="text-2xl">🎯</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {registrations.conference ? '1' : '0'}
                                </h3>
                                <p className="text-gray-600">
                                    {language === 'ar' ? 'تسجيل المؤتمر' : 'Conference Registration'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 rounded-2xl">
                                <span className="text-2xl">🛠️</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {registrations.workshops.length}
                                </h3>
                                <p className="text-gray-600">
                                    {language === 'ar' ? 'تسجيلات الورش' : 'Workshop Registrations'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Hackathon Registration */}
                    <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center space-x-4 rtl:space-x-reverse mb-6">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-2xl">
                                <span className="text-2xl">🚀</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {language === 'ar' ? 'تسجيل الهاكثون' : 'Hackathon Registration'}
                            </h2>
                        </div>
                        
                        {registrations.hackathon ? (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-700">
                                        {language === 'ar' ? 'الحالة:' : 'Status:'}
                                    </span>
                                    {getStatusBadge(registrations.hackathon.status)}
                                </div>
                                
                                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                        <span className="text-blue-600 text-xl">👤</span>
                                        <div>
                                            <p className="font-semibold text-gray-900">{registrations.hackathon.full_name}</p>
                                            <p className="text-gray-600">{registrations.hackathon.email}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                        <span className="text-green-600 text-xl">📅</span>
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {language === 'ar' ? 'تاريخ التسجيل:' : 'Registration Date:'}
                                            </p>
                                            <p className="text-gray-600">{formatDate(registrations.hackathon.created_at)}</p>
                                        </div>
                                    </div>
                                </div>

                                {registrations.hackathon.rejection_reason && (
                                    <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-4">
                                        <div className="flex items-start space-x-3 rtl:space-x-reverse">
                                            <span className="text-red-600 text-xl">❌</span>
                                            <div>
                                                <p className="font-semibold text-red-800">
                                                    {language === 'ar' ? 'سبب الرفض:' : 'Rejection Reason:'}
                                                </p>
                                                <p className="text-red-700 mt-1">{registrations.hackathon.rejection_reason}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {registrations.hackathon.status !== 'rejected' && (
                                    <Link 
                                        to="/hackathon-registration"
                                        className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                                    >
                                        {language === 'ar' ? 'مراجعة الطلب' : 'Review Application'}
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                                    <span className="text-4xl text-gray-400">🚀</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    {language === 'ar' ? 'لم تسجل في الهاكثون بعد' : 'Not registered for hackathon yet'}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {language === 'ar' 
                                        ? 'انضم إلى الهاكثون وابدأ رحلتك نحو الابتكار'
                                        : 'Join the hackathon and start your innovation journey'
                                    }
                                </p>
                                <Link 
                                    to="/hackathon-registration"
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 inline-block"
                                >
                                    {language === 'ar' ? 'سجل الآن' : 'Register Now'}
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Conference Registration */}
                    <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center space-x-4 rtl:space-x-reverse mb-6">
                            <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-4 rounded-2xl">
                                <span className="text-2xl">🎯</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {language === 'ar' ? 'تسجيل المؤتمر' : 'Conference Registration'}
                            </h2>
                        </div>
                        
                        {registrations.conference ? (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-700">
                                        {language === 'ar' ? 'الحالة:' : 'Status:'}
                                    </span>
                                    {getStatusBadge(registrations.conference.status)}
                                </div>
                                
                                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                        <span className="text-green-600 text-xl">👤</span>
                                        <div>
                                            <p className="font-semibold text-gray-900">{registrations.conference.full_name}</p>
                                            <p className="text-gray-600">{registrations.conference.email}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                        <span className="text-blue-600 text-xl">🎪</span>
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {language === 'ar' ? 'الجلسة المختارة:' : 'Selected Session:'}
                                            </p>
                                            <p className="text-gray-600">{registrations.conference.session_choice}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                        <span className="text-purple-600 text-xl">📅</span>
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {language === 'ar' ? 'تاريخ التسجيل:' : 'Registration Date:'}
                                            </p>
                                            <p className="text-gray-600">{formatDate(registrations.conference.created_at)}</p>
                                        </div>
                                    </div>
                                </div>

                                {registrations.conference.rejection_reason && (
                                    <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-4">
                                        <div className="flex items-start space-x-3 rtl:space-x-reverse">
                                            <span className="text-red-600 text-xl">❌</span>
                                            <div>
                                                <p className="font-semibold text-red-800">
                                                    {language === 'ar' ? 'سبب الرفض:' : 'Rejection Reason:'}
                                                </p>
                                                <p className="text-red-700 mt-1">{registrations.conference.rejection_reason}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {registrations.conference.status !== 'rejected' && (
                                    <Link 
                                        to="/conference-registration"
                                        className="block w-full bg-gradient-to-r from-green-500 to-teal-600 text-white text-center py-3 rounded-2xl font-semibold hover:from-green-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105"
                                    >
                                        {language === 'ar' ? 'مراجعة الطلب' : 'Review Application'}
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                                    <span className="text-4xl text-gray-400">🎯</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    {language === 'ar' ? 'لم تسجل في المؤتمر بعد' : 'Not registered for conference yet'}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {language === 'ar' 
                                        ? 'انضم إلى المؤتمر واستمع إلى الخبراء والمتحدثين'
                                        : 'Join the conference and listen to experts and speakers'
                                    }
                                </p>
                                <Link 
                                    to="/conference-registration"
                                    className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-8 py-3 rounded-2xl font-semibold hover:from-green-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 inline-block"
                                >
                                    {language === 'ar' ? 'سجل الآن' : 'Register Now'}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Workshop Registrations */}
                <div className="mt-12">
                    <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
                        <div className="flex items-center space-x-4 rtl:space-x-reverse mb-8">
                            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 rounded-2xl">
                                <span className="text-2xl">🛠️</span>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                {language === 'ar' ? 'تسجيلات الورش' : 'Workshop Registrations'}
                            </h2>
                        </div>
                        
                        {registrations.workshops.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {registrations.workshops.map((workshop, index) => (
                                    <div key={index} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="font-bold text-gray-900 text-lg">{workshop.workshop?.title}</h3>
                                            {getStatusBadge(workshop.status)}
                                        </div>
                                        
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                                <span className="text-orange-600 text-xl">👨‍🏫</span>
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {language === 'ar' ? 'المدرب:' : 'Instructor:'}
                                                    </p>
                                                    <p className="text-gray-600">{workshop.workshop?.instructor}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                                <span className="text-blue-600 text-xl">📅</span>
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {language === 'ar' ? 'تاريخ التسجيل:' : 'Registration Date:'}
                                                    </p>
                                                    <p className="text-gray-600">{formatDate(workshop.created_at)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {workshop.rejection_reason && (
                                            <div className="mt-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4">
                                                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                                                    <span className="text-red-600 text-xl">❌</span>
                                                    <div>
                                                        <p className="font-semibold text-red-800">
                                                            {language === 'ar' ? 'سبب الرفض:' : 'Rejection Reason:'}
                                                        </p>
                                                        <p className="text-red-700 mt-1">{workshop.rejection_reason}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="bg-gray-100 rounded-full p-8 w-32 h-32 mx-auto mb-8 flex items-center justify-center">
                                    <span className="text-6xl text-gray-400">🛠️</span>
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                                    {language === 'ar' ? 'لم تسجل في أي ورشة بعد' : 'No workshop registrations yet'}
                                </h3>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                    {language === 'ar' 
                                        ? 'اكتشف الورش المتاحة وطور مهاراتك في مجالات مختلفة'
                                        : 'Discover available workshops and develop your skills in different areas'
                                    }
                                </p>
                                <Link 
                                    to="/workshop-registration"
                                    className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 inline-block"
                                >
                                    {language === 'ar' ? 'تصفح الورش المتاحة' : 'Browse Available Workshops'}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Available Workshops */}
                {availableWorkshops.length > 0 && (
                    <div className="mt-12">
                        <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
                            <div className="flex items-center space-x-4 rtl:space-x-reverse mb-8">
                                <div className="bg-gradient-to-r from-emerald-500 to-cyan-600 text-white p-4 rounded-2xl">
                                    <span className="text-2xl">🌟</span>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900">
                                    {language === 'ar' ? 'الورش المتاحة' : 'Available Workshops'}
                                </h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {availableWorkshops.map((workshop) => (
                                    <div key={workshop.id} className="bg-gradient-to-br from-emerald-50 to-cyan-50 border border-emerald-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                        <div className="mb-4">
                                            <h3 className="font-bold text-gray-900 text-lg mb-2">{workshop.title}</h3>
                                            <p className="text-gray-600 text-sm leading-relaxed">{workshop.description}</p>
                                        </div>
                                        
                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                                <span className="text-emerald-600 text-lg">👨‍🏫</span>
                                                <div>
                                                    <p className="font-semibold text-gray-900 text-sm">
                                                        {language === 'ar' ? 'المدرب:' : 'Instructor:'}
                                                    </p>
                                                    <p className="text-gray-600 text-sm">{workshop.instructor}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                                <span className="text-blue-600 text-lg">⏰</span>
                                                <div>
                                                    <p className="font-semibold text-gray-900 text-sm">
                                                        {language === 'ar' ? 'التوقيت:' : 'Schedule:'}
                                                    </p>
                                                    <p className="text-gray-600 text-sm">
                                                        {formatDate(workshop.start_time)} - {formatDate(workshop.end_time)}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {workshop.max_participants && (
                                                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                                    <span className="text-purple-600 text-lg">👥</span>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 text-sm">
                                                            {language === 'ar' ? 'الحد الأقصى:' : 'Max Participants:'}
                                                        </p>
                                                        <p className="text-gray-600 text-sm">{workshop.max_participants}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <Link 
                                            to={`/workshop-registration?workshop_id=${workshop.id}`}
                                            className="block w-full bg-gradient-to-r from-emerald-500 to-cyan-600 text-white text-center py-3 rounded-2xl font-semibold hover:from-emerald-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105"
                                        >
                                            {language === 'ar' ? 'سجل في هذه الورشة' : 'Register for this Workshop'}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
