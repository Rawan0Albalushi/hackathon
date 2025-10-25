import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import Form from '../components/Form';
import HackathonStatus from '../components/HackathonStatus';
import { submitHackathonRegistration } from '../utils/api';

const HackathonRegistration = () => {
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
            
            if (data.success && data.data.hackathon) {
                setExistingRegistration(data.data.hackathon);
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
            name: 'age',
            label: t('age'),
            type: 'number',
            required: true,
            placeholder: language === 'ar' ? '25' : '25'
        },
        {
            name: 'city',
            label: language === 'ar' ? 'المحافظة / الولاية / المنطقة' : 'Governorate / State / Region',
            type: 'text',
            required: true,
            placeholder: language === 'ar' ? 'مسقط - بوشر' : 'Muscat - Bausher'
        },
        {
            name: 'background',
            label: t('background'),
            type: 'select',
            required: true,
            options: [
                { value: 'computer_science', label: language === 'ar' ? 'علوم الحاسب' : 'Computer Science' },
                { value: 'engineering', label: language === 'ar' ? 'الهندسة' : 'Engineering' },
                { value: 'business', label: language === 'ar' ? 'إدارة الأعمال' : 'Business' },
                { value: 'design', label: language === 'ar' ? 'التصميم' : 'Design' },
                { value: 'other', label: language === 'ar' ? 'أخرى' : 'Other' }
            ]
        },
        {
            name: 'skills',
            label: t('skills'),
            type: 'checkbox-group',
            required: true,
            options: [
                { value: 'programming', label: t('programming') },
                { value: 'design', label: t('design') },
                { value: 'data_analysis', label: t('dataAnalysis') },
                { value: 'marketing', label: t('marketing') },
                { value: 'project_management', label: t('projectManagement') },
                { value: 'other', label: language === 'ar' ? 'أخرى' : 'Other' }
            ]
        },
        {
            name: 'other_skills',
            label: language === 'ar' ? 'المهارات الأخرى' : 'Other Skills',
            type: 'textarea',
            required: false,
            placeholder: language === 'ar' 
                ? 'اكتب مهاراتك الأخرى هنا...' 
                : 'Write your other skills here...'
        },
    ];

    const handleSubmit = async (formData) => {
        setIsLoading(true);
        try {
            const response = await submitHackathonRegistration(formData);
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
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
            {/* Hero Section */}
            <div className="relative text-white overflow-hidden" style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}>
                <div className="absolute inset-0 bg-black opacity-10"></div>
                
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-20 h-20 rounded-full opacity-20 animate-pulse" style={{background: '#D85584'}}></div>
                    <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full opacity-20 animate-pulse delay-1000" style={{background: '#F4A321'}}></div>
                    <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full opacity-20 animate-pulse delay-500" style={{background: '#096289'}}></div>
                    <div className="absolute top-1/3 right-1/3 w-12 h-12 rounded-full opacity-20 animate-pulse delay-700" style={{background: '#FF6B6B'}}></div>
                    <div className="absolute bottom-1/3 left-1/3 w-24 h-24 rounded-full opacity-20 animate-pulse delay-300" style={{background: '#4ECDC4'}}></div>
                </div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <div className="flex justify-center mb-8">
                            <div className="w-24 h-24 bg-white/30 rounded-3xl flex items-center justify-center backdrop-blur-sm shadow-2xl transform hover:scale-110 transition-transform duration-300">
                                <span className="text-5xl animate-bounce">🚀</span>
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight drop-shadow-lg">
                            {language === 'ar' ? 'هاكاثون "ابتكر من الدقم"' : 'Hackathon "Innovate from Duqm"'}
                        </h1>
                        <p className="text-2xl md:text-3xl mb-10 max-w-5xl mx-auto font-medium" style={{color: '#F4A321'}}>
                            {language === 'ar' 
                                ? 'منصة إبداعية تجمع المبرمجين والمصممين ورواد الأعمال لتطوير حلول حقيقية'
                                : 'Creative platform bringing together programmers, designers and entrepreneurs to develop real solutions'
                            }
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 text-lg">
                            <div className="bg-white/25 px-6 py-3 rounded-2xl backdrop-blur-sm shadow-lg hover:bg-white/35 transition-all duration-300">
                                <span className="mr-2">⏰</span>
                                {language === 'ar' ? '4 ساعات من الإبداع' : '4 Hours of Innovation'}
                            </div>
                            <div className="bg-white/25 px-6 py-3 rounded-2xl backdrop-blur-sm shadow-lg hover:bg-white/35 transition-all duration-300">
                                <span className="mr-2">🎯</span>
                                {language === 'ar' ? 'تحديات مفاجئة' : 'Surprise Challenges'}
                            </div>
                            <div className="bg-white/25 px-6 py-3 rounded-2xl backdrop-blur-sm shadow-lg hover:bg-white/35 transition-all duration-300">
                                <span className="mr-2">🤖</span>
                                {language === 'ar' ? 'ذكاء اصطناعي' : 'AI Technology'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loadingRegistration ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                            <span className="ml-4 text-lg text-gray-600">
                                {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                            </span>
                        </div>
                    ) : existingRegistration ? (
                        <HackathonStatus 
                            registration={existingRegistration} 
                            onEdit={handleEditRegistration}
                        />
                    ) : (
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
                            <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 h-3"></div>
                            <div className="p-8 md:p-12">
                                <div className="text-center mb-10">
                                    <div className="flex justify-center mb-6">
                                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-3xl shadow-lg">
                                            <span className="text-4xl">🚀</span>
                                        </div>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                        {language === 'ar' ? 'نموذج التسجيل في الهاكثون' : 'Hackathon Registration Form'}
                                    </h2>
                                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                                        {language === 'ar' 
                                            ? 'املأ النموذج أدناه للمشاركة في الهاكثون وابدأ رحلتك نحو الابتكار'
                                            : 'Fill out the form below to participate in the hackathon and start your innovation journey'
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
            <div className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            {language === 'ar' ? 'لماذا تشارك معنا؟' : 'Why Join Us?'}
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {language === 'ar' 
                                ? 'انضم إلى مجتمع من المبدعين والمطورين لإنشاء حلول مبتكرة'
                                : 'Join a community of creators and developers to build innovative solutions'
                            }
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">⏰</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                {language === 'ar' ? '4 ساعات مكثفة' : '4 Intensive Hours'}
                            </h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                {language === 'ar' 
                                    ? 'وقت محدود لتحويل الأفكار إلى حلول عملية وابتكارية'
                                    : 'Limited time to transform ideas into practical and innovative solutions'
                                }
                            </p>
                        </div>
                        
                        <div className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">🎯</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                {language === 'ar' ? 'تحديات مفاجئة' : 'Surprise Challenges'}
                            </h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                {language === 'ar' 
                                    ? 'تحديات حقيقية في مجالات الطاقة والبيئة والنقل والاستدامة'
                                    : 'Real challenges in energy, environment, transport, and sustainability sectors'
                                }
                            </p>
                        </div>
                        
                        <div className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">🤖</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                {language === 'ar' ? 'ذكاء اصطناعي' : 'AI Technology'}
                            </h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                {language === 'ar' 
                                    ? 'استخدام أحدث تقنيات الذكاء الاصطناعي في تطوير الحلول'
                                    : 'Using cutting-edge artificial intelligence technologies in solution development'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HackathonRegistration;
