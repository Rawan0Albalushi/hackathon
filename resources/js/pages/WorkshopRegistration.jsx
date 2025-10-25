import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import Form from '../components/Form';
import { submitWorkshopRegistration } from '../utils/api';

const WorkshopRegistration = () => {
    const { t, language } = useLanguage();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [workshops, setWorkshops] = useState([]);
    const [selectedWorkshop, setSelectedWorkshop] = useState(null);

    useEffect(() => {
        fetchWorkshops();
        const workshopId = searchParams.get('workshop_id');
        if (workshopId) {
            setSelectedWorkshop(workshopId);
        }
    }, [searchParams]);

    const fetchWorkshops = async () => {
        try {
            const response = await fetch('/api/user/workshops', {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success) {
                setWorkshops(data.data);
            }
        } catch (err) {
            console.error('فشل في تحميل الورش');
        }
    };

    const fields = [
        {
            name: 'workshop_id',
            label: language === 'ar' ? 'اختر الورشة' : 'Select Workshop',
            type: 'select',
            required: true,
            options: workshops.map(workshop => ({
                value: workshop.id,
                label: workshop.title
            })),
            value: selectedWorkshop,
            onChange: (value) => setSelectedWorkshop(value)
        },
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
            name: 'background',
            label: t('background'),
            type: 'select',
            required: true,
            options: [
                { value: 'programming', label: language === 'ar' ? 'برمجة' : 'Programming' },
                { value: 'accounting', label: language === 'ar' ? 'محاسبة' : 'Accounting' },
                { value: 'engineering', label: language === 'ar' ? 'هندسة' : 'Engineering' },
                { value: 'business', label: language === 'ar' ? 'إدارة أعمال' : 'Business Administration' },
                { value: 'design', label: language === 'ar' ? 'تصميم' : 'Design' },
                { value: 'marketing', label: language === 'ar' ? 'تسويق' : 'Marketing' },
                { value: 'finance', label: language === 'ar' ? 'مالية' : 'Finance' },
                { value: 'healthcare', label: language === 'ar' ? 'صحة' : 'Healthcare' },
                { value: 'education', label: language === 'ar' ? 'تعليم' : 'Education' },
                { value: 'law', label: language === 'ar' ? 'قانون' : 'Law' },
                { value: 'psychology', label: language === 'ar' ? 'علم نفس' : 'Psychology' },
                { value: 'media', label: language === 'ar' ? 'إعلام' : 'Media' },
                { value: 'tourism', label: language === 'ar' ? 'سياحة' : 'Tourism' },
                { value: 'agriculture', label: language === 'ar' ? 'زراعة' : 'Agriculture' },
                { value: 'other', label: language === 'ar' ? 'أخرى' : 'Other' }
            ]
        },
        {
            name: 'reason',
            label: t('reason'),
            type: 'textarea',
            required: false,
            placeholder: language === 'ar' 
                ? 'اكتب سبب رغبتك في حضور الورشة...' 
                : 'Tell us why you want to attend this workshop...'
        }
    ];

    const handleSubmit = async (formData) => {
        setIsLoading(true);
        try {
            // Add workshop_id to form data
            const dataWithWorkshop = {
                ...formData,
                workshop_id: selectedWorkshop
            };
            
            const response = await submitWorkshopRegistration(dataWithWorkshop);
            if (response.success) {
                navigate('/success', { 
                    state: { 
                        type: 'workshop',
                        message: t('registrationSuccess')
                    } 
                });
            } else {
                alert(response.message || t('registrationFailed'));
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert(t('networkError'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
            {/* Hero Section */}
            <div className="relative text-white overflow-hidden" style={{background: 'linear-gradient(135deg, #096289 0%, #003C72 100%)'}}>
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <span className="text-4xl">🎓</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            {language === 'ar' ? 'الورش التدريبية' : 'Training Workshops'}
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto" style={{color: '#F4A321'}}>
                            {language === 'ar' 
                                ? 'ورش تأهيلية تسبق الهاكثون لصقل المهارات وتطوير الحلول'
                                : 'Preparatory workshops before the hackathon to hone skills and develop solutions'
                            }
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 text-sm">
                            <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                                {language === 'ar' ? 'تحليل المشكلات' : 'Problem Analysis'}
                            </div>
                            <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                                {language === 'ar' ? 'تطوير الحلول' : 'Solution Development'}
                            </div>
                            <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                                {language === 'ar' ? 'العمل الجماعي' : 'Teamwork'}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute top-20 left-10 w-16 h-16 rounded-full opacity-30 animate-pulse" style={{background: '#096289'}}></div>
                <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full opacity-30 animate-pulse delay-1000" style={{background: '#003C72'}}></div>
                <div className="absolute top-1/2 left-1/4 w-12 h-12 rounded-full opacity-30 animate-pulse delay-500" style={{background: '#D85584'}}></div>
            </div>

            {/* Form Section */}
            <div className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2"></div>
                        <div className="p-8 md:p-12">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    {language === 'ar' ? 'نموذج التسجيل في الورشة' : 'Workshop Registration Form'}
                                </h2>
                                <p className="text-lg text-gray-600">
                                    {language === 'ar' 
                                        ? 'املأ النموذج أدناه للمشاركة في الورشة التدريبية'
                                        : 'Fill out the form below to participate in the training workshop'
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
            <div className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="text-4xl mb-4">🔍</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {language === 'ar' ? 'تحليل المشكلات' : 'Problem Analysis'}
                            </h3>
                            <p className="text-gray-600">
                                {language === 'ar' 
                                    ? 'تعلم كيفية تحليل التحديات وتحديد الحلول المناسبة'
                                    : 'Learn how to analyze challenges and identify appropriate solutions'
                                }
                            </p>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="text-4xl mb-4">🛠️</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {language === 'ar' ? 'تطوير الحلول' : 'Solution Development'}
                            </h3>
                            <p className="text-gray-600">
                                {language === 'ar' 
                                    ? 'اكتشف طرق تطوير الحلول الإبداعية والفعالة'
                                    : 'Discover ways to develop creative and effective solutions'
                                }
                            </p>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="text-4xl mb-4">👥</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {language === 'ar' ? 'العمل الجماعي' : 'Teamwork'}
                            </h3>
                            <p className="text-gray-600">
                                {language === 'ar' 
                                    ? 'تعلم مهارات العمل الجماعي والتعاون الفعال'
                                    : 'Learn teamwork skills and effective collaboration'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkshopRegistration;
