import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import Form from '../components/Form';
import ConferenceStatus from '../components/ConferenceStatus';
import { submitConferenceRegistration, handleApiErrorWithToast } from '../utils/api';
import { showRegistrationSuccess, showFormLoading, showFormError, showValidationError } from '../utils/messageUtils';

const ConferenceRegistration = () => {
    const { t, language } = useLanguage();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [existingRegistration, setExistingRegistration] = useState(null);
    const [loadingRegistration, setLoadingRegistration] = useState(true);

    // Check for existing registration
    useEffect(() => {
        if (user) {
            fetchExistingRegistration();
        } else {
            setLoadingRegistration(false);
        }
    }, [user]);

    const fetchExistingRegistration = async () => {
        try {
            const response = await fetch('/api/user/registrations', {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success && data.data.conference) {
                setExistingRegistration(data.data.conference);
            }
        } catch (error) {
            console.error('Error fetching registration:', error);
        } finally {
            setLoadingRegistration(false);
        }
    };

    const handleEditRegistration = () => {
        // Navigate to edit form or show edit modal
        // For now, we'll just reset the existing registration to allow re-registration
        setExistingRegistration(null);
    };

    const fields = [
        {
            name: 'full_name',
            label: t('fullName'),
            type: 'text',
            required: true,
            placeholder: language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'
        },
        {
            name: 'email',
            label: t('email'),
            type: 'email',
            required: true,
            readonly: true,
            placeholder: language === 'ar' ? 'example@email.com' : 'example@email.com',
            value: user?.email || ''
        },
        {
            name: 'phone',
            label: t('phone'),
            type: 'tel',
            required: true,
            countryCode: '+968',
            placeholder: language === 'ar' ? '12345678' : '12345678'
        },
        {
            name: 'organization',
            label: t('organization'),
            type: 'text',
            required: false,
            placeholder: language === 'ar' ? 'اسم الشركة أو المؤسسة' : 'Company or Institution name'
        },
        {
            name: 'session_choice',
            label: t('sessionChoice'),
            type: 'select',
            required: true,
            options: [
                { value: 'first', label: t('firstSession') },
                { value: 'second', label: t('secondSession') },
                { value: 'both', label: t('bothSessions') }
            ]
        }
    ];

    const handleSubmit = async (formData) => {
        setIsLoading(true);
        const loadingToastId = showFormLoading(
            language === 'ar' ? 'جاري تسجيل المؤتمر...' : 'Registering for conference...'
        );

        try {
            const response = await submitConferenceRegistration(formData);
            if (response.success) {
                // Hide loading toast
                if (window.hideToast) window.hideToast(loadingToastId);
                
                // Show success message
                showRegistrationSuccess('conference', 1, {
                    position: 'top-center',
                    duration: 5000
                });
                
                // Update the existing registration state
                setExistingRegistration(response.data);
                // Don't navigate to success page, show the status instead
            } else {
                // Hide loading toast
                if (window.hideToast) window.hideToast(loadingToastId);
                showFormError(response.message || t('registrationFailed'));
            }
        } catch (error) {
            console.error('Registration error:', error);
            // Hide loading toast
            if (window.hideToast) window.hideToast(loadingToastId);
            
            // Use enhanced error handling
            handleApiErrorWithToast(error, () => {
                // Retry function
                handleSubmit(formData);
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
            {/* Hero Section */}
            <div className="relative text-white overflow-hidden" style={{background: 'linear-gradient(135deg, #003C72 0%, #096289 100%)'}}>
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-12 sm:py-16 lg:py-20">
                    <div className="text-center">
                        <div className="flex justify-center mb-4 sm:mb-6">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <span className="text-3xl sm:text-4xl">🎤</span>
                            </div>
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-2" style={{lineHeight: '1.1', paddingBottom: '0.5rem'}}>
                            {language === 'ar' ? 'ملتقى الابتكار 2025' : 'Innovation Forum 2025'}
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-6 sm:mb-8 max-w-4xl mx-auto px-2" style={{color: '#F4A321'}}>
                            {language === 'ar' 
                                ? 'المؤتمر الصحفي - النسخة الثالثة من ملتقى الابتكار'
                                : 'Press Conference - Third Edition of Innovation Forum'
                            }
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm px-2">
                            <div className="bg-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                                {language === 'ar' ? 'مؤسسات حكومية وخاصة' : 'Government & Private Institutions'}
                            </div>
                            <div className="bg-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                                {language === 'ar' ? 'تحفيز العقول الشابة' : 'Stimulating Young Minds'}
                            </div>
                            <div className="bg-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                                {language === 'ar' ? 'تحويل الأفكار إلى مشاريع' : 'Transforming Ideas into Projects'}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Floating Star Elements - Responsive */}
                <div className="star-floating absolute top-10 sm:top-20 left-4 sm:left-10 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 opacity-20 sm:opacity-30 animate-pulse"></div>
                <div className="star-floating absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-12 h-12 sm:w-18 sm:h-18 lg:w-24 lg:h-24 opacity-20 sm:opacity-30 animate-pulse delay-1000"></div>
                <div className="star-floating absolute top-1/2 left-1/6 sm:left-1/4 w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 opacity-20 sm:opacity-30 animate-pulse delay-500"></div>
            </div>

            {/* Content Section */}
            <div className="py-12 sm:py-16">
                <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">
                    {loadingRegistration ? (
                        <div className="flex justify-center items-center py-12 sm:py-20">
                            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-green-600"></div>
                            <span className="ml-3 sm:ml-4 text-sm sm:text-lg text-gray-600">
                                {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                            </span>
                        </div>
                    ) : existingRegistration ? (
                        <ConferenceStatus 
                            registration={existingRegistration} 
                            onEdit={handleEditRegistration}
                        />
                    ) : (
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden transition-transform duration-300">
                            <div className="h-2 sm:h-3" style={{background: 'linear-gradient(90deg, #F4A321 0%, #D85584 50%, #096289 100%)'}}></div>
                            <div className="p-4 sm:p-6 md:p-8 lg:p-12">
                                <div className="text-center mb-6 sm:mb-8 lg:mb-10">
                                    <div className="flex justify-center mb-4 sm:mb-6">
                                        <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg">
                                            <span className="text-2xl sm:text-3xl lg:text-4xl">🎤</span>
                                        </div>
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
                                        {language === 'ar' ? 'نموذج التسجيل في المؤتمر' : 'Conference Registration Form'}
                                    </h2>
                                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-2">
                                        {language === 'ar' 
                                            ? 'املأ النموذج أدناه للمشاركة في ملتقى الابتكار'
                                            : 'Fill out the form below to participate in the Innovation Forum'
                                        }
                                    </p>
                                </div>

                                <Form
                                    onSubmit={handleSubmit}
                                    fields={fields}
                                    title=""
                                    submitText={t('submit')}
                                    isLoading={isLoading}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Info Section */}
            <div className="py-12 sm:py-16 bg-gradient-to-br from-gray-50 to-green-50">
                <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🏛️</div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                                {language === 'ar' ? 'مؤسسات حكومية وخاصة' : 'Government & Private Institutions'}
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600">
                                {language === 'ar' 
                                    ? 'لقاء مع نخبة من المؤسسات الحكومية والخاصة والأكاديمية'
                                    : 'Meet with elite government, private and academic institutions'
                                }
                            </p>
                        </div>
                        
                        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🧠</div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                                {language === 'ar' ? 'تحفيز العقول الشابة' : 'Stimulating Young Minds'}
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600">
                                {language === 'ar' 
                                    ? 'تحفيز العقول الشابة وتحويل الأفكار الإبداعية إلى مشاريع واقعية'
                                    : 'Stimulating young minds and transforming creative ideas into real projects'
                                }
                            </p>
                        </div>
                        
                        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 sm:col-span-2 lg:col-span-1">
                            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💡</div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                                {language === 'ar' ? 'تحويل الأفكار إلى مشاريع' : 'Transforming Ideas into Projects'}
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600">
                                {language === 'ar' 
                                    ? 'تحويل الأفكار الإبداعية إلى مشاريع قابلة للتطبيق'
                                    : 'Transforming creative ideas into practical projects'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConferenceRegistration;
