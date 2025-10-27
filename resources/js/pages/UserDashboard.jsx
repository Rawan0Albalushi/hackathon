import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import QRCodeDisplay from '../components/QRCodeDisplay';

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
                style: {background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'},
                text: 'text-white',
                icon: '⏳',
                label: language === 'ar' ? 'قيد المراجعة' : 'Under Review'
            },
            'approved': {
                style: {background: 'linear-gradient(135deg, #096289 0%, #003C72 100%)'},
                text: 'text-white',
                icon: '✅',
                label: language === 'ar' ? 'مقبول' : 'Approved'
            },
            'rejected': {
                style: {background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)'},
                text: 'text-white',
                icon: '❌',
                label: language === 'ar' ? 'مرفوض' : 'Rejected'
            }
        };

        const config = statusConfig[status] || statusConfig['pending'];

        return (
            <div className={`${config.text} px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center space-x-2 rtl:space-x-reverse`} style={config.style}>
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
            <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(to bottom, #FFF5EB 0%, #FFE5F0 25%, #E8F4F8 50%, #F0E8F5 75%, #FFF5EB 100%)'}}>
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 mx-auto" style={{borderColor: 'rgba(244, 163, 33, 0.2)'}}></div>
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent mx-auto absolute top-0 left-1/2 transform -translate-x-1/2" style={{borderColor: '#F4A321'}}></div>
                    </div>
                    <p className="mt-6 text-gray-700 text-lg font-medium">
                        {language === 'ar' ? 'جاري تحميل لوحة التحكم...' : 'Loading Dashboard...'}
                    </p>
                    <div className="mt-4 flex justify-center space-x-1">
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{backgroundColor: '#F4A321'}}></div>
                        <div className="w-2 h-2 rounded-full animate-bounce delay-100" style={{backgroundColor: '#D85584'}}></div>
                        <div className="w-2 h-2 rounded-full animate-bounce delay-200" style={{backgroundColor: '#096289'}}></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative" style={{background: 'linear-gradient(to bottom, #FFF5EB 0%, #FFE5F0 25%, #E8F4F8 50%, #F0E8F5 75%, #FFF5EB 100%)'}}>
            {/* Header Section */}
            <div className="text-white py-16 animate-gradient rounded-3xl mx-4 mt-4" style={{background: 'linear-gradient(135deg, #003C72 0%, #096289 50%, #D85584 100%)'}}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-3xl logo-icon-enhanced">
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
                    <div className="mb-8 bg-white/80 backdrop-blur-sm border border-red-200/50 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <div className="p-3 rounded-full shadow-lg" style={{background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)'}}>
                                <span className="text-white text-xl">⚠️</span>
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
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20">
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="text-white p-4 rounded-2xl shadow-lg" style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}>
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

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20">
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="text-white p-4 rounded-2xl shadow-lg" style={{background: 'linear-gradient(135deg, #096289 0%, #003C72 100%)'}}>
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

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20">
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="text-white p-4 rounded-2xl shadow-lg" style={{background: 'linear-gradient(135deg, #D85584 0%, #F4A321 100%)'}}>
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
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20">
                        <div className="flex items-center space-x-4 rtl:space-x-reverse mb-6">
                            <div className="text-white p-4 rounded-2xl shadow-lg" style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}>
                                <span className="text-2xl">🚀</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {language === 'ar' ? 'تسجيل الهاكثون' : 'Hackathon Registration'}
                            </h2>
                        </div>
                        
                        {registrations.hackathon ? (
                            <div className="space-y-6">
                                {/* Status Header */}
                                <div className="flex justify-between items-center p-4 rounded-2xl" style={{background: 'linear-gradient(135deg, rgba(244, 163, 33, 0.1) 0%, rgba(216, 85, 132, 0.1) 100%)'}}>
                                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                        <div className="p-2 rounded-full" style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}>
                                            <span className="text-white text-lg">🚀</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">
                                                {language === 'ar' ? 'تسجيل الهاكثون' : 'Hackathon Registration'}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {language === 'ar' ? 'رقم الطلب:' : 'Application ID:'} #{registrations.hackathon.id}
                                            </p>
                                        </div>
                                    </div>
                                    {getStatusBadge(registrations.hackathon.status)}
                                </div>
                                
                                {/* Registration Details */}
                                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 space-y-6 border border-white/30">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                            <div className="p-3 rounded-full shadow-lg" style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}>
                                                <span className="text-white text-xl">👤</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 text-lg">{registrations.hackathon.full_name}</p>
                                                <p className="text-gray-600">{registrations.hackathon.email}</p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {language === 'ar' ? 'المشارك' : 'Participant'}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                            <div className="p-3 rounded-full shadow-lg" style={{background: 'linear-gradient(135deg, #096289 0%, #003C72 100%)'}}>
                                                <span className="text-white text-xl">📅</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {language === 'ar' ? 'تاريخ التسجيل' : 'Registration Date'}
                                                </p>
                                                <p className="text-gray-600">{formatDate(registrations.hackathon.created_at)}</p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {language === 'ar' ? 'تم التسجيل' : 'Registered'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Skills Section */}
                                    {registrations.hackathon.skills && typeof registrations.hackathon.skills === 'string' && (
                                        <div className="border-t border-gray-200 pt-6">
                                            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                                                <div className="p-2 rounded-full" style={{background: 'linear-gradient(135deg, #D85584 0%, #F4A321 100%)'}}>
                                                    <span className="text-white text-lg">🛠️</span>
                                                </div>
                                                <h4 className="font-semibold text-gray-900">
                                                    {language === 'ar' ? 'المهارات المذكورة' : 'Mentioned Skills'}
                                                </h4>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {registrations.hackathon.skills.split(',').map((skill, index) => (
                                                    <span key={index} className="px-3 py-1 rounded-full text-sm font-medium text-white" style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}>
                                                        {skill.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {registrations.hackathon.rejection_reason && (
                                    <div className="bg-white/60 backdrop-blur-sm border border-red-200/50 rounded-2xl p-4">
                                        <div className="flex items-start space-x-3 rtl:space-x-reverse">
                                            <div className="p-2 rounded-full shadow-lg" style={{background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)'}}>
                                                <span className="text-white text-lg">❌</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-red-800">
                                                    {language === 'ar' ? 'سبب الرفض:' : 'Rejection Reason:'}
                                                </p>
                                                <p className="text-red-700 mt-1">{registrations.hackathon.rejection_reason}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* QR Code Display for Approved Hackathon Registration */}
                                {registrations.hackathon.status === 'approved' && registrations.hackathon.qr_code && (
                                    <div className="mt-6">
                                        <QRCodeDisplay 
                                            qrCode={registrations.hackathon.qr_code}
                                            type="hackathon"
                                            registrationId={registrations.hackathon.id}
                                            isCheckedIn={registrations.hackathon.is_checked_in}
                                            checkedInAt={registrations.hackathon.checked_in_at}
                                        />
                                    </div>
                                )}

                                {registrations.hackathon.status !== 'rejected' && (
                                    <Link 
                                        to="/hackathon-registration"
                                        className="block w-full text-white text-center py-3 rounded-2xl font-semibold transition-all duration-300 transform  shadow-lg"
                                        style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}
                                    >
                                        {language === 'ar' ? 'مراجعة الطلب' : 'Review Application'}
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-lg" style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}>
                                    <span className="text-4xl text-white">🚀</span>
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
                                    className="text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 transform  inline-block shadow-lg"
                                    style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}
                                >
                                    {language === 'ar' ? 'سجل الآن' : 'Register Now'}
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Conference Registration */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20">
                        <div className="flex items-center space-x-4 rtl:space-x-reverse mb-6">
                            <div className="text-white p-4 rounded-2xl shadow-lg" style={{background: 'linear-gradient(135deg, #096289 0%, #003C72 100%)'}}>
                                <span className="text-2xl">🎯</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {language === 'ar' ? 'تسجيل المؤتمر' : 'Conference Registration'}
                            </h2>
                        </div>
                        
                        {registrations.conference ? (
                            <div className="space-y-6">
                                {/* Status Header */}
                                <div className="flex justify-between items-center p-4 rounded-2xl" style={{background: 'linear-gradient(135deg, rgba(9, 98, 137, 0.1) 0%, rgba(0, 60, 114, 0.1) 100%)'}}>
                                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                        <div className="p-2 rounded-full" style={{background: 'linear-gradient(135deg, #096289 0%, #003C72 100%)'}}>
                                            <span className="text-white text-lg">🎯</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">
                                                {language === 'ar' ? 'تسجيل المؤتمر' : 'Conference Registration'}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {language === 'ar' ? 'رقم الطلب:' : 'Application ID:'} #{registrations.conference.id}
                                            </p>
                                        </div>
                                    </div>
                                    {getStatusBadge(registrations.conference.status)}
                                </div>
                                
                                {/* Registration Details */}
                                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 space-y-6 border border-white/30">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                            <div className="p-3 rounded-full shadow-lg" style={{background: 'linear-gradient(135deg, #096289 0%, #003C72 100%)'}}>
                                                <span className="text-white text-xl">👤</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 text-lg">{registrations.conference.full_name}</p>
                                                <p className="text-gray-600">{registrations.conference.email}</p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {language === 'ar' ? 'المشارك' : 'Participant'}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                            <div className="p-3 rounded-full shadow-lg" style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}>
                                                <span className="text-white text-xl">📅</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {language === 'ar' ? 'تاريخ التسجيل' : 'Registration Date'}
                                                </p>
                                                <p className="text-gray-600">{formatDate(registrations.conference.created_at)}</p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {language === 'ar' ? 'تم التسجيل' : 'Registered'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Session Choice Section */}
                                    <div className="border-t border-gray-200 pt-6">
                                        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                                            <div className="p-2 rounded-full" style={{background: 'linear-gradient(135deg, #D85584 0%, #F4A321 100%)'}}>
                                                <span className="text-white text-lg">🎪</span>
                                            </div>
                                            <h4 className="font-semibold text-gray-900">
                                                {language === 'ar' ? 'الجلسة المختارة' : 'Selected Session'}
                                            </h4>
                                        </div>
                                        <div className="bg-white/40 rounded-xl p-4 border border-white/50">
                                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                                <div className="w-3 h-3 rounded-full" style={{background: 'linear-gradient(135deg, #096289 0%, #003C72 100%)'}}></div>
                                                <p className="font-medium text-gray-900 text-lg">{registrations.conference.session_choice}</p>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-2">
                                                {language === 'ar' ? 'ستحضر هذه الجلسة في المؤتمر' : 'You will attend this session at the conference'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {registrations.conference.rejection_reason && (
                                    <div className="bg-white/60 backdrop-blur-sm border border-red-200/50 rounded-2xl p-4">
                                        <div className="flex items-start space-x-3 rtl:space-x-reverse">
                                            <div className="p-2 rounded-full shadow-lg" style={{background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)'}}>
                                                <span className="text-white text-lg">❌</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-red-800">
                                                    {language === 'ar' ? 'سبب الرفض:' : 'Rejection Reason:'}
                                                </p>
                                                <p className="text-red-700 mt-1">{registrations.conference.rejection_reason}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* QR Code Display for Approved Conference Registration */}
                                {registrations.conference.status === 'approved' && registrations.conference.qr_code && (
                                    <div className="mt-6">
                                        <QRCodeDisplay 
                                            qrCode={registrations.conference.qr_code}
                                            type="conference"
                                            registrationId={registrations.conference.id}
                                            isCheckedIn={registrations.conference.is_checked_in}
                                            checkedInAt={registrations.conference.checked_in_at}
                                        />
                                    </div>
                                )}

                                {registrations.conference.status !== 'rejected' && (
                                    <Link 
                                        to="/conference-registration"
                                        className="block w-full text-white text-center py-3 rounded-2xl font-semibold transition-all duration-300 transform  shadow-lg"
                                        style={{background: 'linear-gradient(135deg, #096289 0%, #003C72 100%)'}}
                                    >
                                        {language === 'ar' ? 'مراجعة الطلب' : 'Review Application'}
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-lg" style={{background: 'linear-gradient(135deg, #096289 0%, #003C72 100%)'}}>
                                    <span className="text-4xl text-white">🎯</span>
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
                                    className="text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 transform  inline-block shadow-lg"
                                    style={{background: 'linear-gradient(135deg, #096289 0%, #003C72 100%)'}}
                                >
                                    {language === 'ar' ? 'سجل الآن' : 'Register Now'}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Workshop Registrations - Redesigned */}
                <div className="mt-12">
                    {/* Section Header with Enhanced Design */}
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 rounded-3xl blur-xl"></div>
                        <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-6 rtl:space-x-reverse">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-60"></div>
                                        <div className="relative p-4 rounded-2xl shadow-xl" style={{background: 'linear-gradient(135deg, #D85584 0%, #F4A321 100%)'}}>
                                            <span className="text-white text-3xl">🛠️</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-4xl font-bold text-gray-900 mb-2">
                                            {language === 'ar' ? 'تسجيلات الورش' : 'Workshop Registrations'}
                                        </h2>
                                        <p className="text-gray-600 text-lg">
                                            {language === 'ar' 
                                                ? 'إدارة ومتابعة تسجيلاتك في الورش التدريبية'
                                                : 'Manage and track your workshop registrations'
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-5xl font-bold text-gray-900 mb-1">{registrations.workshops.length}</div>
                                    <div className="text-sm text-gray-600 font-medium">
                                        {language === 'ar' ? 'ورشة مسجلة' : 'Workshops'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {registrations.workshops.length > 0 ? (
                        <div className="space-y-8">
                            {/* Enhanced Workshop Cards */}
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                {registrations.workshops.map((workshop, index) => {
                                    // Dynamic card styling based on status
                                    const getCardStyle = (status) => {
                                        switch(status) {
                                            case 'approved':
                                                return {
                                                    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                                    border: 'border-green-200/50',
                                                    bg: 'bg-green-50/30',
                                                    shadow: 'shadow-green-200/20'
                                                };
                                            case 'pending':
                                                return {
                                                    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                                                    border: 'border-yellow-200/50',
                                                    bg: 'bg-yellow-50/30',
                                                    shadow: 'shadow-yellow-200/20'
                                                };
                                            case 'rejected':
                                                return {
                                                    gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                                                    border: 'border-red-200/50',
                                                    bg: 'bg-red-50/30',
                                                    shadow: 'shadow-red-200/20'
                                                };
                                            default:
                                                return {
                                                    gradient: 'linear-gradient(135deg, #D85584 0%, #F4A321 100%)',
                                                    border: 'border-pink-200/50',
                                                    bg: 'bg-pink-50/30',
                                                    shadow: 'shadow-pink-200/20'
                                                };
                                        }
                                    };

                                    const cardStyle = getCardStyle(workshop.status);

                                    return (
                                        <div key={index} className={`relative group ${cardStyle.bg} backdrop-blur-sm rounded-3xl p-8 border ${cardStyle.border} hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 `}>
                                            {/* Animated Background */}
                                            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{background: cardStyle.gradient}}></div>
                                            
                                            {/* Card Content */}
                                            <div className="relative z-10">
                                                {/* Workshop Header */}
                                                <div className="flex justify-between items-start mb-8">
                                                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                                        <div className="relative">
                                                            <div className="absolute inset-0 rounded-2xl blur-lg opacity-60" style={{background: cardStyle.gradient}}></div>
                                                            <div className="relative p-4 rounded-2xl shadow-xl" style={{background: cardStyle.gradient}}>
                                                                <span className="text-white text-2xl">🛠️</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-gray-900 text-2xl mb-2 group-hover:text-white transition-colors duration-500">
                                                                {workshop.workshop?.title}
                                                            </h3>
                                                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                                                <span className="text-sm text-gray-500 group-hover:text-white/80 transition-colors duration-500">
                                                                    {language === 'ar' ? 'رقم التسجيل:' : 'Registration ID:'}
                                                                </span>
                                                                <span className="text-sm font-mono bg-white/80 group-hover:bg-white px-3 py-1 rounded-lg shadow-sm">
                                                                    #{workshop.id}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="transform  transition-transform duration-300">
                                                        {getStatusBadge(workshop.status)}
                                                    </div>
                                                </div>
                                                
                                                {/* Workshop Description */}
                                                {workshop.workshop?.description && (
                                                    <div className="mb-8">
                                                        <div className="bg-white/70 group-hover:bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/60 group-hover:border-white/80 transition-all duration-500">
                                                            <p className="text-gray-700 text-sm leading-relaxed group-hover:text-gray-800 transition-colors duration-500">
                                                                {workshop.workshop.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {/* Enhanced Workshop Details */}
                                                <div className="space-y-6 mb-8">
                                                    {/* Instructor & Date Row */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="flex items-center space-x-4 rtl:space-x-reverse p-5 bg-white/60 group-hover:bg-white/80 rounded-2xl border border-white/70 group-hover:border-white/90 transition-all duration-500">
                                                            <div className="p-3 rounded-xl shadow-lg" style={{background: cardStyle.gradient}}>
                                                                <span className="text-white text-lg">👨‍🏫</span>
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-gray-900 text-sm group-hover:text-gray-800 transition-colors duration-500">
                                                                    {language === 'ar' ? 'المدرب' : 'Instructor'}
                                                                </p>
                                                                <p className="text-gray-700 font-medium group-hover:text-gray-800 transition-colors duration-500">
                                                                    {workshop.workshop?.instructor}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex items-center space-x-4 rtl:space-x-reverse p-5 bg-white/60 group-hover:bg-white/80 rounded-2xl border border-white/70 group-hover:border-white/90 transition-all duration-500">
                                                            <div className="p-3 rounded-xl shadow-lg" style={{background: cardStyle.gradient}}>
                                                                <span className="text-white text-lg">📅</span>
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-gray-900 text-sm group-hover:text-gray-800 transition-colors duration-500">
                                                                    {language === 'ar' ? 'تاريخ التسجيل' : 'Registration Date'}
                                                                </p>
                                                                <p className="text-gray-700 font-medium group-hover:text-gray-800 transition-colors duration-500">
                                                                    {formatDate(workshop.created_at)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Workshop Schedule */}
                                                    {workshop.workshop?.start_time && workshop.workshop?.end_time && (
                                                        <div className="bg-white/60 group-hover:bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/70 group-hover:border-white/90 transition-all duration-500">
                                                            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-5">
                                                                <div className="p-2 rounded-xl shadow-lg" style={{background: cardStyle.gradient}}>
                                                                    <span className="text-white text-lg">⏰</span>
                                                                </div>
                                                                <h4 className="font-semibold text-gray-900 text-lg group-hover:text-gray-800 transition-colors duration-500">
                                                                    {language === 'ar' ? 'مواعيد الورشة' : 'Workshop Schedule'}
                                                                </h4>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div className="flex items-center justify-between p-4 bg-white/70 group-hover:bg-white/90 rounded-xl border border-white/80 group-hover:border-white transition-all duration-500">
                                                                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                                                        <div className="w-3 h-3 rounded-full shadow-sm" style={{background: cardStyle.gradient}}></div>
                                                                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-800 transition-colors duration-500">
                                                                            {language === 'ar' ? 'وقت البداية' : 'Start Time'}
                                                                        </span>
                                                                    </div>
                                                                    <span className="text-sm font-semibold text-gray-900 group-hover:text-gray-800 transition-colors duration-500">
                                                                        {formatDate(workshop.workshop.start_time)}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center justify-between p-4 bg-white/70 group-hover:bg-white/90 rounded-xl border border-white/80 group-hover:border-white transition-all duration-500">
                                                                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                                                        <div className="w-3 h-3 rounded-full shadow-sm" style={{background: cardStyle.gradient}}></div>
                                                                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-800 transition-colors duration-500">
                                                                            {language === 'ar' ? 'وقت النهاية' : 'End Time'}
                                                                        </span>
                                                                    </div>
                                                                    <span className="text-sm font-semibold text-gray-900 group-hover:text-gray-800 transition-colors duration-500">
                                                                        {formatDate(workshop.workshop.end_time)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Max Participants */}
                                                    {workshop.workshop?.max_participants && (
                                                        <div className="flex items-center space-x-4 rtl:space-x-reverse p-5 bg-white/60 group-hover:bg-white/80 rounded-2xl border border-white/70 group-hover:border-white/90 transition-all duration-500">
                                                            <div className="p-3 rounded-xl shadow-lg" style={{background: cardStyle.gradient}}>
                                                                <span className="text-white text-lg">👥</span>
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-gray-900 text-sm group-hover:text-gray-800 transition-colors duration-500">
                                                                    {language === 'ar' ? 'الحد الأقصى للمشاركين' : 'Maximum Participants'}
                                                                </p>
                                                                <p className="text-gray-700 font-medium group-hover:text-gray-800 transition-colors duration-500">
                                                                    {workshop.workshop.max_participants}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            
                                                {/* QR Code Display for Approved Workshop Registration */}
                                                {workshop.status === 'approved' && workshop.qr_code && (
                                                    <div className="mt-6">
                                                        <QRCodeDisplay 
                                                            qrCode={workshop.qr_code}
                                                            type="workshop"
                                                            registrationId={workshop.id}
                                                            isCheckedIn={workshop.is_checked_in}
                                                            checkedInAt={workshop.checked_in_at}
                                                        />
                                                    </div>
                                                )}

                                                {/* Rejection Reason */}
                                                {workshop.rejection_reason && (
                                                    <div className="mt-6 bg-red-50/80 group-hover:bg-red-50/90 backdrop-blur-sm border border-red-200/60 group-hover:border-red-200/80 rounded-2xl p-6 transition-all duration-500">
                                                        <div className="flex items-start space-x-4 rtl:space-x-reverse">
                                                            <div className="p-2 rounded-full shadow-lg" style={{background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)'}}>
                                                                <span className="text-white text-lg">❌</span>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-red-800 text-sm">
                                                                    {language === 'ar' ? 'سبب الرفض:' : 'Rejection Reason:'}
                                                                </p>
                                                                <p className="text-red-700 mt-2 text-sm leading-relaxed">
                                                                    {workshop.rejection_reason}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 rounded-full blur-2xl"></div>
                                <div className="relative rounded-full p-12 w-40 h-40 mx-auto flex items-center justify-center shadow-2xl" style={{background: 'linear-gradient(135deg, #D85584 0%, #F4A321 100%)'}}>
                                    <span className="text-white text-7xl">🛠️</span>
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">
                                {language === 'ar' ? 'لم تسجل في أي ورشة بعد' : 'No workshop registrations yet'}
                            </h3>
                            <p className="text-gray-600 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
                                {language === 'ar' 
                                    ? 'اكتشف الورش المتاحة وطور مهاراتك في مجالات مختلفة من خلال ورش تدريبية متخصصة'
                                    : 'Discover available workshops and develop your skills in different areas through specialized training workshops'
                                }
                            </p>
                            <Link 
                                to="/workshop-registration"
                                className="inline-block text-white px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform  shadow-xl hover:shadow-2xl"
                                style={{background: 'linear-gradient(135deg, #D85584 0%, #F4A321 100%)'}}
                            >
                                {language === 'ar' ? 'تصفح الورش المتاحة' : 'Browse Available Workshops'}
                            </Link>
                        </div>
                    )}
                </div>

                {/* Available Workshops */}
                {availableWorkshops.length > 0 && (() => {
                    // Filter out workshops that are already registered
                    const registeredWorkshopIds = registrations.workshops.map(w => w.workshop?.id).filter(Boolean);
                    const availableWorkshopsFiltered = availableWorkshops.filter(workshop => 
                        !registeredWorkshopIds.includes(workshop.id)
                    );
                    
                    return availableWorkshopsFiltered.length > 0 && (
                        <div className="mt-12">
                            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-white/20">
                                <div className="flex items-center space-x-4 rtl:space-x-reverse mb-8">
                                    <div className="text-white p-4 rounded-2xl shadow-lg" style={{background: 'linear-gradient(135deg, #F4A321 0%, #096289 100%)'}}>
                                        <span className="text-2xl">🌟</span>
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900">
                                            {language === 'ar' ? 'الورش المتاحة' : 'Available Workshops'}
                                        </h2>
                                        <p className="text-gray-600 mt-2">
                                            {language === 'ar' 
                                                ? `متاح ${availableWorkshopsFiltered.length} ورشة للتسجيل`
                                                : `${availableWorkshopsFiltered.length} workshops available for registration`
                                            }
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {availableWorkshopsFiltered.map((workshop) => (
                                    <div key={workshop.id} className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                        {/* Workshop Header */}
                                        <div className="mb-6">
                                            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-3">
                                                <div className="p-2 rounded-full shadow-lg" style={{background: 'linear-gradient(135deg, #F4A321 0%, #096289 100%)'}}>
                                                    <span className="text-white text-lg">🌟</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-lg">{workshop.title}</h3>
                                                    <p className="text-sm text-gray-600">
                                                        {language === 'ar' ? 'ورشة متاحة' : 'Available Workshop'}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-sm leading-relaxed bg-white/40 rounded-xl p-3 border border-white/50">
                                                {workshop.description}
                                            </p>
                                        </div>
                                        
                                        {/* Workshop Details */}
                                        <div className="space-y-4 mb-6">
                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                                    <div className="p-2 rounded-full" style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}>
                                                        <span className="text-white text-lg">👨‍🏫</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 text-sm">
                                                            {language === 'ar' ? 'المدرب' : 'Instructor'}
                                                        </p>
                                                        <p className="text-gray-600 text-sm">{workshop.instructor}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                                    <div className="p-2 rounded-full" style={{background: 'linear-gradient(135deg, #096289 0%, #003C72 100%)'}}>
                                                        <span className="text-white text-lg">⏰</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 text-sm">
                                                            {language === 'ar' ? 'التوقيت' : 'Schedule'}
                                                        </p>
                                                        <p className="text-gray-600 text-sm">
                                                            {formatDate(workshop.start_time)} - {formatDate(workshop.end_time)}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                {workshop.max_participants && (
                                                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                                        <div className="p-2 rounded-full" style={{background: 'linear-gradient(135deg, #D85584 0%, #F4A321 100%)'}}>
                                                            <span className="text-white text-lg">👥</span>
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900 text-sm">
                                                                {language === 'ar' ? 'الحد الأقصى للمشاركين' : 'Max Participants'}
                                                            </p>
                                                            <p className="text-gray-600 text-sm">{workshop.max_participants}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <Link 
                                            to={`/workshop-registration?workshop_id=${workshop.id}`}
                                            className="block w-full text-white text-center py-3 rounded-2xl font-semibold transition-all duration-300 transform  shadow-lg"
                                            style={{background: 'linear-gradient(135deg, #F4A321 0%, #096289 100%)'}}
                                        >
                                            {language === 'ar' ? 'سجل في هذه الورشة' : 'Register for this Workshop'}
                                        </Link>
                                    </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
};

export default UserDashboard;
