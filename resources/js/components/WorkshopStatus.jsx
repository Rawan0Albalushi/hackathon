import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const WorkshopStatus = ({ registration, onEdit }) => {
    const { t, language } = useLanguage();

    const getStatusConfig = (status) => {
        const configs = {
            'pending': {
                bg: 'bg-gradient-to-r from-yellow-400 to-orange-400',
                text: 'text-white',
                icon: '⏳',
                title: language === 'ar' ? 'قيد المراجعة' : 'Under Review',
                description: language === 'ar' 
                    ? 'طلبك قيد المراجعة من قبل فريقنا المختص' 
                    : 'Your application is being reviewed by our team'
            },
            'approved': {
                bg: 'bg-gradient-to-r from-green-400 to-emerald-500',
                text: 'text-white',
                icon: '✅',
                title: language === 'ar' ? 'تم القبول' : 'Approved',
                description: language === 'ar' 
                    ? 'مبروك! تم قبولك للمشاركة في الورشة' 
                    : 'Congratulations! Your application has been approved'
            },
            'rejected': {
                bg: 'bg-gradient-to-r from-red-400 to-pink-500',
                text: 'text-white',
                icon: '❌',
                title: language === 'ar' ? 'تم الرفض' : 'Rejected',
                description: language === 'ar' 
                    ? 'نعتذر، لم يتم قبول طلبك هذه المرة' 
                    : 'Sorry, your application was not approved this time'
            }
        };
        return configs[status] || configs['pending'];
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

    const getBackgroundText = (background) => {
        const backgrounds = {
            'programming': language === 'ar' ? 'برمجة' : 'Programming',
            'accounting': language === 'ar' ? 'محاسبة' : 'Accounting',
            'engineering': language === 'ar' ? 'هندسة' : 'Engineering',
            'business': language === 'ar' ? 'إدارة أعمال' : 'Business Administration',
            'design': language === 'ar' ? 'تصميم' : 'Design',
            'marketing': language === 'ar' ? 'تسويق' : 'Marketing',
            'finance': language === 'ar' ? 'مالية' : 'Finance',
            'healthcare': language === 'ar' ? 'صحة' : 'Healthcare',
            'education': language === 'ar' ? 'تعليم' : 'Education',
            'law': language === 'ar' ? 'قانون' : 'Law',
            'psychology': language === 'ar' ? 'علم نفس' : 'Psychology',
            'media': language === 'ar' ? 'إعلام' : 'Media',
            'tourism': language === 'ar' ? 'سياحة' : 'Tourism',
            'agriculture': language === 'ar' ? 'زراعة' : 'Agriculture',
            'other': language === 'ar' ? 'أخرى' : 'Other'
        };
        return backgrounds[background] || background;
    };

    const statusConfig = getStatusConfig(registration.status);

    return (
        <div className="max-w-5xl mx-auto">
            {/* Status Header */}
            <div className={`${statusConfig.bg} ${statusConfig.text} rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-white transform -translate-x-16 -translate-y-16"></div>
                    <div className="absolute bottom-0 right-0 w-24 h-24 rounded-full bg-white transform translate-x-12 translate-y-12"></div>
                    <div className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full bg-white transform -translate-x-8 -translate-y-8"></div>
                </div>
                
                <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div className="flex items-center space-x-6 rtl:space-x-reverse">
                            <div className="text-5xl animate-bounce">
                                {statusConfig.icon}
                            </div>
                            <div>
                                <h2 className="text-3xl lg:text-4xl font-bold mb-3">
                                    {statusConfig.title}
                                </h2>
                                <p className="text-xl opacity-95 leading-relaxed">
                                    {statusConfig.description}
                                </p>
                            </div>
                        </div>
                        <div className="text-center lg:text-right bg-white/20 backdrop-blur-sm rounded-2xl p-4 min-w-[200px]">
                            <div className="text-sm opacity-80 mb-1">
                                {language === 'ar' ? 'تاريخ التسجيل' : 'Registration Date'}
                            </div>
                            <div className="font-bold text-lg">
                                {formatDate(registration.created_at)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Registration Details */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 animate-in slide-in-from-top-4">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3"></div>
                <div className="p-8 lg:p-12">
                    <div className="flex items-center mb-8">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-2xl mr-4">
                            <span className="text-2xl">🎓</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">
                            {language === 'ar' ? 'تفاصيل التسجيل في الورشة' : 'Workshop Registration Details'}
                        </h3>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Personal Information */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <span className="text-blue-600 text-lg">👤</span>
                                </div>
                                <h4 className="text-xl font-bold text-gray-800">
                                    {language === 'ar' ? 'المعلومات الشخصية' : 'Personal Information'}
                                </h4>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100 hover:shadow-md transition-shadow duration-200">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-700 flex items-center">
                                            <span className="mr-2">📝</span>
                                            {language === 'ar' ? 'الاسم الكامل:' : 'Full Name:'}
                                        </span>
                                        <span className="text-gray-900 font-medium">{registration.full_name}</span>
                                    </div>
                                </div>
                                
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-100 hover:shadow-md transition-shadow duration-200">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-700 flex items-center">
                                            <span className="mr-2">📧</span>
                                            {language === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}
                                        </span>
                                        <span className="text-gray-900 font-medium">{registration.email}</span>
                                    </div>
                                </div>
                                
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-100 hover:shadow-md transition-shadow duration-200">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-700 flex items-center">
                                            <span className="mr-2">📱</span>
                                            {language === 'ar' ? 'رقم الهاتف:' : 'Phone:'}
                                        </span>
                                        <span className="text-gray-900 font-medium">{registration.phone}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Workshop Information */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                <div className="bg-purple-100 p-2 rounded-lg">
                                    <span className="text-purple-600 text-lg">🎓</span>
                                </div>
                                <h4 className="text-xl font-bold text-gray-800">
                                    {language === 'ar' ? 'معلومات الورشة' : 'Workshop Information'}
                                </h4>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-2xl border border-indigo-100 hover:shadow-md transition-shadow duration-200">
                                    <span className="font-semibold text-gray-700 flex items-center mb-3">
                                        <span className="mr-2">🎯</span>
                                        {language === 'ar' ? 'اسم الورشة:' : 'Workshop Name:'}
                                    </span>
                                    <span className="text-gray-900 font-medium bg-white/50 px-3 py-2 rounded-lg inline-block">
                                        {registration.workshop?.title || 'N/A'}
                                    </span>
                                </div>
                                
                                <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-2xl border border-pink-100 hover:shadow-md transition-shadow duration-200">
                                    <span className="font-semibold text-gray-700 flex items-center mb-3">
                                        <span className="mr-2">🎓</span>
                                        {language === 'ar' ? 'الخلفية التعليمية:' : 'Educational Background:'}
                                    </span>
                                    <span className="text-gray-900 font-medium bg-white/50 px-3 py-2 rounded-lg inline-block">
                                        {getBackgroundText(registration.background)}
                                    </span>
                                </div>
                                
                                {registration.reason && (
                                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-100 hover:shadow-md transition-shadow duration-200">
                                        <span className="font-semibold text-gray-700 flex items-center mb-3">
                                            <span className="mr-2">💭</span>
                                            {language === 'ar' ? 'سبب المشاركة:' : 'Reason for Participation:'}
                                        </span>
                                        <p className="text-gray-900 font-medium bg-white/50 px-3 py-2 rounded-lg">
                                            {registration.reason}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="mt-8 space-y-6">
                        {/* Rejection Reason */}
                        {registration.status === 'rejected' && registration.rejection_reason && (
                            <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl border border-red-200 hover:shadow-md transition-shadow duration-200">
                                <div className="flex items-center mb-4">
                                    <div className="bg-red-100 p-3 rounded-lg mr-4">
                                        <span className="text-red-600 text-xl">❌</span>
                                    </div>
                                    <h4 className="text-xl font-bold text-red-800">
                                        {language === 'ar' ? 'سبب الرفض' : 'Rejection Reason'}
                                    </h4>
                                </div>
                                <p className="text-red-700 font-medium bg-white/50 px-4 py-3 rounded-lg">
                                    {registration.rejection_reason}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Status-specific messages */}
            {registration.status === 'pending' && (
                <div className="mt-8 p-8 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                        <div className="bg-yellow-100 p-4 rounded-2xl">
                            <span className="text-3xl animate-pulse">⏳</span>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-2xl font-bold text-yellow-800 mb-3">
                                {language === 'ar' ? 'ما التالي؟' : 'What\'s Next?'}
                            </h4>
                            <p className="text-yellow-700 text-lg leading-relaxed">
                                {language === 'ar' 
                                    ? 'سيتم مراجعة طلبك خلال 2-3 أيام عمل. ستتلقى إشعاراً عبر البريد الإلكتروني عند اتخاذ القرار.'
                                    : 'Your application will be reviewed within 2-3 business days. You will receive an email notification when a decision is made.'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {registration.status === 'approved' && (
                <div className="mt-8 p-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                        <div className="bg-green-100 p-4 rounded-2xl">
                            <span className="text-3xl animate-bounce">🎉</span>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-2xl font-bold text-green-800 mb-3">
                                {language === 'ar' ? 'مبروك!' : 'Congratulations!'}
                            </h4>
                            <p className="text-green-700 text-lg leading-relaxed">
                                {language === 'ar' 
                                    ? 'تم قبولك للمشاركة في الورشة. ستتلقى مزيداً من التفاصيل حول الورشة قريباً.'
                                    : 'You have been accepted to participate in the workshop. You will receive more details about the workshop soon.'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkshopStatus;
