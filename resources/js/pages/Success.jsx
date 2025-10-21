import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Success = () => {
    const { t, language } = useLanguage();
    const location = useLocation();
    const { type, message } = location.state || {};

    const getEventInfo = () => {
        switch (type) {
            case 'hackathon':
                return {
                    title: language === 'ar' ? 'تم التسجيل في الهاكثون بنجاح!' : 'Successfully registered for Hackathon!',
                    description: language === 'ar' 
                        ? 'شكراً لك على التسجيل في الهاكثون. سنتواصل معك قريباً مع تفاصيل الحدث.'
                        : 'Thank you for registering for the hackathon. We will contact you soon with event details.',
                    icon: '💻',
                    color: 'from-purple-500 to-pink-500'
                };
            case 'workshop':
                return {
                    title: language === 'ar' ? 'تم التسجيل في الورشة بنجاح!' : 'Successfully registered for Workshop!',
                    description: language === 'ar' 
                        ? 'شكراً لك على التسجيل في الورشة. سنرسل لك تفاصيل الورشة عبر البريد الإلكتروني.'
                        : 'Thank you for registering for the workshop. We will send you workshop details via email.',
                    icon: '🎓',
                    color: 'from-blue-500 to-cyan-500'
                };
            case 'conference':
                return {
                    title: language === 'ar' ? 'تم التسجيل في المؤتمر بنجاح!' : 'Successfully registered for Conference!',
                    description: language === 'ar' 
                        ? 'شكراً لك على التسجيل في المؤتمر. سنرسل لك تفاصيل المؤتمر والجلسات.'
                        : 'Thank you for registering for the conference. We will send you conference and session details.',
                    icon: '🎤',
                    color: 'from-green-500 to-teal-500'
                };
            default:
                return {
                    title: t('registrationSuccess'),
                    description: t('registrationSuccessMessage'),
                    icon: '✅',
                    color: 'from-indigo-500 to-purple-500'
                };
        }
    };

    const eventInfo = getEventInfo();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm animate-pulse">
                                <span className="text-5xl">{eventInfo.icon}</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            {eventInfo.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-4xl mx-auto">
                            {eventInfo.description}
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 text-sm">
                            <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                                {language === 'ar' ? 'تم التسجيل بنجاح' : 'Registration Successful'}
                            </div>
                            <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                                {language === 'ar' ? 'تأكيد عبر البريد' : 'Email Confirmation'}
                            </div>
                            <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                                {language === 'ar' ? 'تفاصيل قريباً' : 'Details Coming Soon'}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute top-20 left-10 w-16 h-16 bg-purple-400 rounded-full opacity-30 animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-24 h-24 bg-indigo-400 rounded-full opacity-30 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-pink-400 rounded-full opacity-30 animate-pulse delay-500"></div>
            </div>

            {/* Success Content */}
            <div className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2"></div>
                        <div className="p-8 md:p-12">
                            {/* Success Icon */}
                            <div className="text-center mb-8">
                                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${eventInfo.color} text-white text-3xl mb-4 animate-bounce`}>
                                    {eventInfo.icon}
                                </div>
                                <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-emerald-600 mx-auto rounded-full"></div>
                            </div>

                            {/* Success Message */}
                            <div className="text-center mb-8">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    {language === 'ar' ? 'تهانينا! تم التسجيل بنجاح' : 'Congratulations! Registration Successful'}
                                </h2>
                                <p className="text-lg text-gray-600">
                                    {language === 'ar' 
                                        ? 'شكراً لك على التسجيل. سنتواصل معك قريباً مع تفاصيل الحدث.'
                                        : 'Thank you for registering. We will contact you soon with event details.'
                                    }
                                </p>
                            </div>

                            {/* Next Steps */}
                            <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-2xl p-6 mb-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                                    {language === 'ar' ? 'ما التالي؟' : 'What\'s Next?'}
                                </h3>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <span className="text-green-600 text-xl">📧</span>
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">
                                            {language === 'ar' ? 'رسالة تأكيد' : 'Confirmation Email'}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {language === 'ar' 
                                                ? 'ستتلقى رسالة تأكيد عبر البريد الإلكتروني'
                                                : 'You will receive a confirmation email'
                                            }
                                        </p>
                                    </div>
                                    
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <span className="text-blue-600 text-xl">📅</span>
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">
                                            {language === 'ar' ? 'تفاصيل الحدث' : 'Event Details'}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {language === 'ar' 
                                                ? 'سنرسل لك تفاصيل الحدث قبل أسبوع من الموعد'
                                                : 'We will send you event details one week before'
                                            }
                                        </p>
                                    </div>
                                    
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <span className="text-purple-600 text-xl">💬</span>
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">
                                            {language === 'ar' ? 'الدعم' : 'Support'}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {language === 'ar' 
                                                ? 'يمكنك التواصل معنا في أي وقت'
                                                : 'You can contact us anytime'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/"
                                    className={`inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r ${eventInfo.color} hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                                >
                                    {t('backToHome')}
                                </Link>
                                
                                <button
                                    onClick={() => window.print()}
                                    className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-lg font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                                >
                                    {language === 'ar' ? 'طباعة' : 'Print'}
                                </button>
                            </div>

                            {/* Contact Info */}
                            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                                <p className="text-sm text-gray-500">
                                    {language === 'ar' 
                                        ? 'للمساعدة، تواصل معنا على: support@innovationforum.om'
                                        : 'For assistance, contact us at: support@innovationforum.om'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Success;
