import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import Form from '../components/Form';
import { submitHackathonRegistration } from '../utils/api';

const HackathonRegistration = () => {
    const { t, language } = useLanguage();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

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
            placeholder: language === 'ar' ? 'example@email.com' : 'example@email.com'
        },
        {
            name: 'phone',
            label: t('phone'),
            type: 'tel',
            required: true,
            placeholder: language === 'ar' ? '+966501234567' : '+966501234567'
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
                navigate('/success', { 
                    state: { 
                        type: 'hackathon',
                        message: t('registrationSuccess')
                    } 
                });
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
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <span className="text-4xl">🚀</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            {language === 'ar' ? 'هاكاثون "ابتكر من الدقم"' : 'Hackathon "Innovate from Duqm"'}
                        </h1>
                        <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-4xl mx-auto">
                            {language === 'ar' 
                                ? 'منصة إبداعية تجمع المبرمجين والمصممين ورواد الأعمال لتطوير حلول حقيقية'
                                : 'Creative platform bringing together programmers, designers and entrepreneurs to develop real solutions'
                            }
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 text-sm">
                            <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                                {language === 'ar' ? '4 ساعات من الإبداع' : '4 Hours of Innovation'}
                            </div>
                            <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                                {language === 'ar' ? 'تحديات مفاجئة' : 'Surprise Challenges'}
                            </div>
                            <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                                {language === 'ar' ? 'ذكاء اصطناعي' : 'AI Technology'}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute top-20 left-10 w-16 h-16 bg-pink-400 rounded-full opacity-30 animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-24 h-24 bg-purple-400 rounded-full opacity-30 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-cyan-400 rounded-full opacity-30 animate-pulse delay-500"></div>
            </div>

            {/* Form Section */}
            <div className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2"></div>
                        <div className="p-8 md:p-12">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    {language === 'ar' ? 'نموذج التسجيل في الهاكثون' : 'Hackathon Registration Form'}
                                </h2>
                                <p className="text-lg text-gray-600">
                                    {language === 'ar' 
                                        ? 'املأ النموذج أدناه للمشاركة في الهاكثون'
                                        : 'Fill out the form below to participate in the hackathon'
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
                </div>
            </div>

            {/* Info Section */}
            <div className="py-16 bg-gradient-to-br from-gray-50 to-purple-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="text-4xl mb-4">⏰</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {language === 'ar' ? '4 ساعات مكثفة' : '4 Intensive Hours'}
                            </h3>
                            <p className="text-gray-600">
                                {language === 'ar' 
                                    ? 'وقت محدود لتحويل الأفكار إلى حلول عملية'
                                    : 'Limited time to transform ideas into practical solutions'
                                }
                            </p>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="text-4xl mb-4">🎯</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {language === 'ar' ? 'تحديات مفاجئة' : 'Surprise Challenges'}
                            </h3>
                            <p className="text-gray-600">
                                {language === 'ar' 
                                    ? 'تحديات حقيقية في مجالات الطاقة والبيئة والنقل'
                                    : 'Real challenges in energy, environment, and transport sectors'
                                }
                            </p>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="text-4xl mb-4">🤖</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {language === 'ar' ? 'ذكاء اصطناعي' : 'AI Technology'}
                            </h3>
                            <p className="text-gray-600">
                                {language === 'ar' 
                                    ? 'استخدام تقنيات الذكاء الاصطناعي في الحلول'
                                    : 'Using artificial intelligence technologies in solutions'
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
