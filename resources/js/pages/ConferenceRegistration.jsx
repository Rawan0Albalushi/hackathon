import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import Form from '../components/Form';
import ConferenceStatus from '../components/ConferenceStatus';
import { submitConferenceRegistration } from '../utils/api';

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
        try {
            const response = await submitConferenceRegistration(formData);
            if (response.success) {
                // Update the existing registration state
                setExistingRegistration(response.data);
                // Don't navigate to success page, show the status instead
            } else {
                alert(t('registrationFailed'));
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert(t('networkError'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
            {/* Hero Section */}
            <div className="relative text-white overflow-hidden" style={{background: 'linear-gradient(135deg, #003C72 0%, #096289 100%)'}}>
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <span className="text-4xl">🎤</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{lineHeight: '1.1', paddingBottom: '0.75rem'}}>
                            {language === 'ar' ? 'ملتقى الابتكار 2025' : 'Innovation Forum 2025'}
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto" style={{color: '#F4A321'}}>
                            {language === 'ar' 
                                ? 'المؤتمر الصحفي - النسخة الثالثة من ملتقى الابتكار'
                                : 'Press Conference - Third Edition of Innovation Forum'
                            }
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 text-sm">
                            <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                                {language === 'ar' ? 'مؤسسات حكومية وخاصة' : 'Government & Private Institutions'}
                            </div>
                            <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                                {language === 'ar' ? 'تحفيز العقول الشابة' : 'Stimulating Young Minds'}
                            </div>
                            <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                                {language === 'ar' ? 'تحويل الأفكار إلى مشاريع' : 'Transforming Ideas into Projects'}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute top-20 left-10 w-16 h-16 rounded-full opacity-30 animate-pulse" style={{background: '#003C72'}}></div>
                <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full opacity-30 animate-pulse delay-1000" style={{background: '#096289'}}></div>
                <div className="absolute top-1/2 left-1/4 w-12 h-12 rounded-full opacity-30 animate-pulse delay-500" style={{background: '#D85584'}}></div>
            </div>

            {/* Content Section */}
            <div className="py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loadingRegistration ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                            <span className="ml-4 text-lg text-gray-600">
                                {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                            </span>
                        </div>
                    ) : existingRegistration ? (
                        <ConferenceStatus 
                            registration={existingRegistration} 
                            onEdit={handleEditRegistration}
                        />
                    ) : (
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
                            <div className="h-3" style={{background: 'linear-gradient(90deg, #F4A321 0%, #D85584 50%, #096289 100%)'}}></div>
                            <div className="p-8 md:p-12">
                                <div className="text-center mb-10">
                                    <div className="flex justify-center mb-6">
                                        <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 rounded-3xl shadow-lg">
                                            <span className="text-4xl">🎤</span>
                                        </div>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                        {language === 'ar' ? 'نموذج التسجيل في المؤتمر' : 'Conference Registration Form'}
                                    </h2>
                                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
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
            <div className="py-16 bg-gradient-to-br from-gray-50 to-green-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="text-4xl mb-4">🏛️</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {language === 'ar' ? 'مؤسسات حكومية وخاصة' : 'Government & Private Institutions'}
                            </h3>
                            <p className="text-gray-600">
                                {language === 'ar' 
                                    ? 'لقاء مع نخبة من المؤسسات الحكومية والخاصة والأكاديمية'
                                    : 'Meet with elite government, private and academic institutions'
                                }
                            </p>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="text-4xl mb-4">🧠</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {language === 'ar' ? 'تحفيز العقول الشابة' : 'Stimulating Young Minds'}
                            </h3>
                            <p className="text-gray-600">
                                {language === 'ar' 
                                    ? 'تحفيز العقول الشابة وتحويل الأفكار الإبداعية إلى مشاريع واقعية'
                                    : 'Stimulating young minds and transforming creative ideas into real projects'
                                }
                            </p>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="text-4xl mb-4">💡</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {language === 'ar' ? 'تحويل الأفكار إلى مشاريع' : 'Transforming Ideas into Projects'}
                            </h3>
                            <p className="text-gray-600">
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
