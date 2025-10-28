import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { initScrollAnimations } from '../utils/scrollAnimations';

const WorkshopInfo = () => {
    const { t, language } = useLanguage();
    const { isAuthenticated } = useAuth();
    const [workshops, setWorkshops] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const observer = initScrollAnimations();
        return () => {
            if (observer) observer.disconnect();
        };
    }, [language]);

    useEffect(() => {
        const fetchWorkshops = async () => {
            if (!isAuthenticated) {
                setWorkshops([]);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/user/workshops', { credentials: 'include' });
                const data = await response.json();
                if (data?.success) {
                    setWorkshops(Array.isArray(data.data) ? data.data : []);
                } else {
                    setError(data?.message || 'فشل في تحميل الورش');
                }
            } catch (e) {
                setError('فشل في تحميل الورش');
            } finally {
                setLoading(false);
            }
        };

        fetchWorkshops();
    }, [isAuthenticated]);

    const workshopData = {
        title: language === 'ar' ? 'الورش التدريبية' : 'Training Workshops',
        subtitle: language === 'ar' ? 'ورش تأهيلية تسبق الهاكثون' : 'Preparatory workshops before the hackathon',
        description: language === 'ar'
            ? 'تهدف إلى صقل مهارات المشاركين في تحليل المشكلات، تطوير الحلول، والعمل الجماعي. توفر للمشاركين المعرفة والأدوات اللازمة لتحويل التحديات إلى فرص ابتكارية، وتزيد جاهزيتهم لتقديم حلول مؤثرة خلال الهاكثون.'
            : 'Aim to hone participants\' skills in problem analysis, solution development, and teamwork. Provide participants with the knowledge and tools needed to transform challenges into innovative opportunities, and increase their readiness to present impactful solutions during the hackathon.',
        workshops: language === 'ar' 
            ? [
                {
                    title: 'ورشة تحليل المشكلات',
                    description: 'تعلم كيفية تحليل المشكلات المعقدة وتحديد الحلول المناسبة',
                    duration: '2 ساعة',
                    level: 'مبتدئ - متوسط',
                    topics: ['تحديد المشكلة', 'تحليل الأسباب الجذرية', 'تطوير الحلول', 'اختبار الحلول'],
                    icon: '🔍'
                },
                {
                    title: 'ورشة تطوير الحلول التقنية',
                    description: 'تعلم أساسيات تطوير الحلول التقنية باستخدام أحدث الأدوات',
                    duration: '3 ساعات',
                    level: 'متوسط - متقدم',
                    topics: ['أساسيات البرمجة', 'قواعد البيانات', 'واجهات المستخدم', 'اختبار البرمجيات'],
                    icon: '💻'
                },
                {
                    title: 'ورشة العمل الجماعي',
                    description: 'تطوير مهارات العمل الجماعي والقيادة في المشاريع التقنية',
                    duration: '2 ساعة',
                    level: 'جميع المستويات',
                    topics: ['إدارة الفريق', 'التواصل الفعال', 'حل النزاعات', 'توزيع المهام'],
                    icon: '👥'
                },
                {
                    title: 'ورشة الذكاء الاصطناعي',
                    description: 'مقدمة في الذكاء الاصطناعي وتطبيقاته في حل المشكلات',
                    duration: '2.5 ساعة',
                    level: 'مبتدئ',
                    topics: ['مقدمة في الذكاء الاصطناعي', 'تعلم الآلة', 'معالجة اللغة الطبيعية', 'التطبيقات العملية'],
                    icon: '🤖'
                }
            ]
            : [
                {
                    title: 'Problem Analysis Workshop',
                    description: 'Learn how to analyze complex problems and identify appropriate solutions',
                    duration: '2 hours',
                    level: 'Beginner - Intermediate',
                    topics: ['Problem Identification', 'Root Cause Analysis', 'Solution Development', 'Solution Testing'],
                    icon: '🔍'
                },
                {
                    title: 'Technical Solution Development',
                    description: 'Learn the basics of developing technical solutions using the latest tools',
                    duration: '3 hours',
                    level: 'Intermediate - Advanced',
                    topics: ['Programming Basics', 'Databases', 'User Interfaces', 'Software Testing'],
                    icon: '💻'
                },
                {
                    title: 'Teamwork Workshop',
                    description: 'Develop teamwork and leadership skills in technical projects',
                    duration: '2 hours',
                    level: 'All Levels',
                    topics: ['Team Management', 'Effective Communication', 'Conflict Resolution', 'Task Distribution'],
                    icon: '👥'
                },
                {
                    title: 'Artificial Intelligence Workshop',
                    description: 'Introduction to artificial intelligence and its applications in problem solving',
                    duration: '2.5 hours',
                    level: 'Beginner',
                    topics: ['AI Introduction', 'Machine Learning', 'Natural Language Processing', 'Practical Applications'],
                    icon: '🤖'
                }
            ],
        benefits: language === 'ar' 
            ? [
                'تحسين مهارات حل المشكلات',
                'تطوير القدرات التقنية',
                'تعزيز العمل الجماعي',
                'اكتساب معرفة عملية',
                'الاستعداد للهاكثون',
                'شهادة مشاركة'
            ]
            : [
                'Improve problem-solving skills',
                'Develop technical capabilities',
                'Enhance teamwork',
                'Gain practical knowledge',
                'Prepare for hackathon',
                'Participation certificate'
            ],
        schedule: language === 'ar' 
            ? [
                { time: '08:00 - 08:30', activity: 'التسجيل والترحيب', description: 'استقبال المشاركين وتوزيع المواد' },
                { time: '08:30 - 10:30', activity: 'ورشة تحليل المشكلات', description: 'تعلم أساسيات تحليل المشكلات' },
                { time: '10:30 - 11:00', activity: 'استراحة', description: 'استراحة قصيرة وتجديد النشاط' },
                { time: '11:00 - 14:00', activity: 'ورشة تطوير الحلول التقنية', description: 'تعلم تطوير الحلول التقنية' },
                { time: '14:00 - 15:00', activity: 'غداء', description: 'وجبة غداء للمشاركين' },
                { time: '15:00 - 17:00', activity: 'ورشة العمل الجماعي', description: 'تطوير مهارات العمل الجماعي' },
                { time: '17:00 - 17:30', activity: 'استراحة', description: 'استراحة قصيرة' },
                { time: '17:30 - 20:00', activity: 'ورشة الذكاء الاصطناعي', description: 'مقدمة في الذكاء الاصطناعي' }
            ]
            : [
                { time: '08:00 - 08:30', activity: 'Registration & Welcome', description: 'Participant reception and material distribution' },
                { time: '08:30 - 10:30', activity: 'Problem Analysis Workshop', description: 'Learn the basics of problem analysis' },
                { time: '10:30 - 11:00', activity: 'Break', description: 'Short break and refreshment' },
                { time: '11:00 - 14:00', activity: 'Technical Solution Development', description: 'Learn technical solution development' },
                { time: '14:00 - 15:00', activity: 'Lunch', description: 'Lunch for participants' },
                { time: '15:00 - 17:00', activity: 'Teamwork Workshop', description: 'Develop teamwork skills' },
                { time: '17:00 - 17:30', activity: 'Break', description: 'Short break' },
                { time: '17:30 - 20:00', activity: 'AI Workshop', description: 'Introduction to artificial intelligence' }
            ],
        requirements: language === 'ar' 
            ? [
                'الرغبة في التعلم والتطوير',
                'خبرة أساسية في استخدام الكمبيوتر',
                'القدرة على العمل ضمن فريق',
                'جهاز كمبيوتر محمول (اختياري)',
                'اتصال بالإنترنت',
                'دفتر ملاحظات'
            ]
            : [
                'Desire to learn and develop',
                'Basic computer usage experience',
                'Ability to work in a team',
                'Laptop computer (optional)',
                'Internet connection',
                'Notebook'
            ]
    };

    return (
        <div className="min-h-screen relative" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background */}
            <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom, #FFF5EB 0%, #FFE5F0 25%, #E8F4F8 50%, #F0E8F5 75%, #FFF5EB 100%)'}}></div>
            
            {/* Hero Section */}
            <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <div className="text-center mb-8 sm:mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mb-6 animate-bounce">
                            <span className="text-3xl sm:text-4xl lg:text-5xl">🎓</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 animate-fade-in-down">
                            {workshopData.title}
                        </h1>
                        <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 animate-fade-in-up animate-delay-200">
                            {workshopData.subtitle}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-400">
                            <Link
                                to="/workshop"
                                className="ripple-effect button-press text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                style={{background: 'linear-gradient(135deg, #096289 0%, #003C72 100%)'}}
                            >
                                {language === 'ar' ? 'سجل الآن' : 'Register Now'}
                            </Link>
                            <Link
                                to="/"
                                className="ripple-effect button-press bg-white text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-200"
                            >
                                {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Description Section */}
            <section className="py-12 sm:py-16 lg:py-20 relative scroll-animate">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 text-center">
                            {language === 'ar' ? 'عن الورش' : 'About the Workshops'}
                        </h2>
                        <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
                            {workshopData.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* Workshops Section */}
            <section className="py-12 sm:py-16 lg:py-20 relative scroll-animate">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">
                        {language === 'ar' ? 'الورش المتاحة' : 'Available Workshops'}
                    </h2>
                    {loading && (
                        <div className="text-center text-gray-600">{language === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}</div>
                    )}
                    {!loading && error && (
                        <div className="text-center text-red-600">{error}</div>
                    )}
                    {!loading && !error && !isAuthenticated && (
                        <div className="text-center text-gray-700">
                            {language === 'ar' ? 'سجّل دخولك لعرض الورش المتاحة' : 'Please sign in to view available workshops'}
                        </div>
                    )}
                    {!loading && !error && isAuthenticated && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                            {workshops.length === 0 && (
                                <div className="col-span-full text-center text-gray-600">
                                    {language === 'ar' ? 'لا توجد ورش متاحة حالياً' : 'No workshops available right now'}
                                </div>
                            )}
                            {workshops.map((workshop, index) => {
                                const start = workshop.start_time ? new Date(workshop.start_time) : null;
                                const end = workshop.end_time ? new Date(workshop.end_time) : null;
                                const dateStr = start ? start.toLocaleDateString() : '';
                                const timeWindow = start && end
                                    ? `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                    : null;

                                return (
                                    <div
                                        key={workshop.id || index}
                                        className="group relative animate-fade-in-up"
                                        style={{animationDelay: `${index * 100}ms`}}
                                    >
                                        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-blue-500/20 via-cyan-400/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
                                        <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow">
                                                        <span className="text-2xl">🎓</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">{workshop.title}</h3>
                                                        {workshop.instructor && (
                                                            <div className="mt-1 text-xs sm:text-sm text-gray-500">
                                                                {language === 'ar' ? `المدرب: ${workshop.instructor}` : `Instructor: ${workshop.instructor}`}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {(dateStr || timeWindow) && (
                                                    <div className="flex flex-col items-end text-right">
                                                        {dateStr && (
                                                            <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-semibold">
                                                                {dateStr}
                                                            </span>
                                                        )}
                                                        {timeWindow && (
                                                            <span className="mt-1 inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-[11px] font-semibold">
                                                                {timeWindow}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {workshop.description && (
                                                <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-3">
                                                    {workshop.description}
                                                </p>
                                            )}

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {typeof workshop.max_participants === 'number' && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 text-purple-700 px-3 py-1 text-xs font-semibold">
                                                        <span>👥</span>
                                                        {language === 'ar' ? `الحد الأقصى: ${workshop.max_participants}` : `Max: ${workshop.max_participants}`}
                                                    </span>
                                                )}
                                                {workshop.requirements && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 px-3 py-1 text-[11px] font-semibold">
                                                        <span>📋</span>
                                                        {language === 'ar' ? 'متطلبات' : 'Requirements'}
                                                    </span>
                                                )}
                                                {workshop.is_active === false && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-600 px-3 py-1 text-[11px] font-semibold">
                                                        {language === 'ar' ? 'غير متاح' : 'Inactive'}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="text-[11px] sm:text-xs text-gray-500">
                                                    {language === 'ar' ? 'اضغط للتسجيل أو لمعرفة المزيد' : 'Tap to register or learn more'}
                                                </div>
                                                <Link
                                                    to="/workshop"
                                                    className="ripple-effect button-press inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#096289] to-[#003C72] text-white px-4 py-2 text-xs sm:text-sm font-semibold shadow hover:shadow-lg transform hover:scale-[1.02] transition"
                                                >
                                                    {language === 'ar' ? 'سجل الآن' : 'Register'}
                                                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-12 sm:py-16 lg:py-20 relative scroll-animate bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">
                        {language === 'ar' ? 'الفوائد' : 'Benefits'}
                    </h2>
                    <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {workshopData.benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition-all duration-300 animate-fade-in-up" style={{animationDelay: `${index * 100}ms`}}>
                                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 rtl:mr-0 rtl:ml-3">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-sm sm:text-base text-gray-700 font-medium">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Schedule Section */}
            <section className="py-12 sm:py-16 lg:py-20 relative scroll-animate">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">
                        {language === 'ar' ? 'البرنامج الزمني' : 'Schedule'}
                    </h2>
                    <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl">
                        <div className="space-y-4 sm:space-y-6">
                            {workshopData.schedule.map((item, index) => (
                                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:shadow-md transition-all duration-300 animate-fade-in-up" style={{animationDelay: `${index * 100}ms`}}>
                                    <div className="flex-shrink-0 mb-3 sm:mb-0 sm:mr-6 rtl:sm:mr-0 rtl:sm:ml-6">
                                        <span className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            {item.time}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{item.activity}</h3>
                                        <p className="text-sm sm:text-base text-gray-600">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Requirements Section */}
            <section className="py-12 sm:py-16 lg:py-20 relative scroll-animate bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">
                        {language === 'ar' ? 'المتطلبات' : 'Requirements'}
                    </h2>
                    <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {workshopData.requirements.map((requirement, index) => (
                                <div key={index} className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition-all duration-300 animate-fade-in-up" style={{animationDelay: `${index * 100}ms`}}>
                                    <div className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3 rtl:mr-0 rtl:ml-3">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-sm sm:text-base text-gray-700 font-medium">{requirement}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-12 sm:py-16 lg:py-20 text-white relative scroll-animate rounded-2xl sm:rounded-3xl mx-2 sm:mx-4 mb-2 sm:mb-4" style={{background: 'linear-gradient(135deg, #096289 0%, #003C72 100%)'}}>
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative max-w-4xl mx-auto text-center px-3 sm:px-4 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 animate-fade-in-down">
                        {language === 'ar' ? 'انضم إلى الورش الآن' : 'Join the Workshops Now'}
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 animate-fade-in-up animate-delay-200">
                        {language === 'ar' 
                            ? 'طور مهاراتك التقنية واستعد للهاكثون من خلال هذه الورش التدريبية المميزة'
                            : 'Develop your technical skills and prepare for the hackathon through these special training workshops'
                        }
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in-up animate-delay-400">
                        <Link
                            to="/workshop"
                            className="ripple-effect button-press bg-white text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                        >
                            {language === 'ar' ? 'سجل الآن' : 'Register Now'}
                        </Link>
                        <Link
                            to="/"
                            className="ripple-effect button-press border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-semibold hover:bg-white hover:text-gray-700 transition-all duration-300 transform hover:scale-105"
                        >
                            {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default WorkshopInfo;
