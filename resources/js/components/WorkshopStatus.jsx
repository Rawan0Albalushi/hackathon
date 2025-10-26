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
