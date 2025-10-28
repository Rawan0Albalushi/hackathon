import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { initScrollAnimations } from '../utils/scrollAnimations';

const HackathonInfo = () => {
    const { t, language } = useLanguage();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const observer = initScrollAnimations();
        return () => {
            if (observer) observer.disconnect();
        };
    }, [language]);

    const hackathonData = {
        title: language === 'ar' ? 'هاكاثون "ابتكر من الدقم"' : 'Hackathon "Innovate from Duqm"',
        subtitle: language === 'ar' ? 'منصة إبداعية تجمع المبرمجين والمصممين ورواد الأعمال' : 'Creative platform bringing together programmers, designers and entrepreneurs',
        description: language === 'ar' 
            ? 'لتطوير حلول حقيقية لتحديات واقعية في مجالات الطاقة والبيئة والنقل والسياحة. يتميّز الهاكاثون بعنصر المفاجأة، حيث تُعلن التحديات لحظة الانطلاق دون استعداد مسبق، وتعمل الفرق خلال ٤ ساعات على تحليلها وبناء حلول ذكية باستخدام تقنيات الذكاء الاصطناعي.'
            : 'To develop real solutions for real challenges in energy, environment, transport and tourism sectors. The hackathon features surprise elements, with challenges announced at launch without prior preparation, and teams work for 4 hours to analyze and build smart solutions using artificial intelligence technologies.',
        features: language === 'ar' 
            ? [
                { title: 'تحديات مفاجئة', description: 'تحديات حقيقية تُعلن لحظة الانطلاق', icon: '🎯' },
                { title: '4 ساعات من العمل المكثف', description: 'عمل جماعي مكثف لإنتاج الحلول', icon: '⏰' },
                { title: 'استخدام الذكاء الاصطناعي', description: 'تطبيق تقنيات الذكاء الاصطناعي في الحلول', icon: '🤖' },
                { title: 'حلول قابلة للتطبيق', description: 'حلول عملية قابلة للتطبيق في الواقع', icon: '💡' }
            ]
            : [
                { title: 'Surprise Challenges', description: 'Real challenges announced at launch', icon: '🎯' },
                { title: '4 Hours Intensive Work', description: 'Intensive teamwork to produce solutions', icon: '⏰' },
                { title: 'AI Technology Usage', description: 'Applying AI technologies in solutions', icon: '🤖' },
                { title: 'Practical Solutions', description: 'Practical solutions applicable in reality', icon: '💡' }
            ],
        schedule: language === 'ar' 
            ? [
                { time: '09:00 - 09:30', activity: 'التسجيل والترحيب', description: 'استقبال المشاركين وتوزيع المواد' },
                { time: '09:30 - 10:00', activity: 'كلمة الافتتاح', description: 'كلمة ترحيبية وتوضيح القواعد' },
                { time: '10:00 - 10:30', activity: 'إعلان التحديات', description: 'كشف التحديات المطلوب حلها' },
                { time: '10:30 - 14:30', activity: 'فترة العمل', description: '4 ساعات من العمل المكثف على الحلول' },
                { time: '14:30 - 15:30', activity: 'عرض المشاريع', description: 'عرض الحلول المطورة أمام لجنة التحكيم' },
                { time: '15:30 - 16:00', activity: 'النتائج والجوائز', description: 'إعلان الفائزين وتسليم الجوائز' }
            ]
            : [
                { time: '09:00 - 09:30', activity: 'Registration & Welcome', description: 'Participant reception and material distribution' },
                { time: '09:30 - 10:00', activity: 'Opening Speech', description: 'Welcome speech and rule clarification' },
                { time: '10:00 - 10:30', activity: 'Challenge Announcement', description: 'Revealing challenges to be solved' },
                { time: '10:30 - 14:30', activity: 'Working Period', description: '4 hours of intensive work on solutions' },
                { time: '14:30 - 15:30', activity: 'Project Presentation', description: 'Presenting developed solutions to judges' },
                { time: '15:30 - 16:00', activity: 'Results & Awards', description: 'Announcing winners and awarding prizes' }
            ],
        requirements: language === 'ar' 
            ? [
                'خبرة في البرمجة أو التصميم أو إدارة المشاريع',
                'القدرة على العمل ضمن فريق',
                'الرغبة في التعلم والتطوير',
                'جهاز كمبيوتر محمول (اختياري)',
                'اتصال بالإنترنت'
            ]
            : [
                'Experience in programming, design, or project management',
                'Ability to work in a team',
                'Desire to learn and develop',
                'Laptop computer (optional)',
                'Internet connection'
            ],
        prizes: language === 'ar' 
            ? [
                { place: 'المركز الأول', prize: '5000 ريال عماني + شهادة', icon: '🥇' },
                { place: 'المركز الثاني', prize: '3000 ريال عماني + شهادة', icon: '🥈' },
                { place: 'المركز الثالث', prize: '2000 ريال عماني + شهادة', icon: '🥉' },
                { place: 'أفضل فكرة ابتكارية', prize: '1000 ريال عماني + شهادة', icon: '💡' }
            ]
            : [
                { place: '1st Place', prize: '5000 OMR + Certificate', icon: '🥇' },
                { place: '2nd Place', prize: '3000 OMR + Certificate', icon: '🥈' },
                { place: '3rd Place', prize: '2000 OMR + Certificate', icon: '🥉' },
                { place: 'Best Innovative Idea', prize: '1000 OMR + Certificate', icon: '💡' }
            ]
    };

    return (
        <div className="min-h-screen relative" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background */}
            <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom, #FFF5EB 0%, #FFE5F0 25%, #E8F4F8 50%, #F0E8F5 75%, #FFF5EB 100%)'}}></div>
            
            {/* Hero Section */}
            <section className="relative py-8 sm:py-10 lg:py-12 overflow-hidden">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <div className="text-center mb-8 sm:mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 animate-bounce">
                            <span className="text-3xl sm:text-4xl lg:text-5xl">🚀</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 animate-fade-in-down">
                            {hackathonData.title}
                        </h1>
                        <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-6 animate-fade-in-up animate-delay-200">
                            {hackathonData.subtitle}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in-up animate-delay-400">
                            <Link
                                to="/hackathon"
                                className="ripple-effect button-press text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}
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
            <section className="py-8 sm:py-10 lg:py-12 relative scroll-animate">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-center">
                            {language === 'ar' ? 'عن الهاكثون' : 'About the Hackathon'}
                        </h2>
                        <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
                            {hackathonData.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-8 sm:py-10 lg:py-12 relative scroll-animate">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
                        {language === 'ar' ? 'المميزات الرئيسية' : 'Key Features'}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {hackathonData.features.map((feature, index) => (
                            <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up" style={{animationDelay: `${index * 100}ms`}}>
                                <div className="text-center">
                                    <div className="text-4xl sm:text-5xl mb-4 animate-bounce">{feature.icon}</div>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                    <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Schedule Section */}
            <section className="py-8 sm:py-10 lg:py-12 relative scroll-animate bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
                        {language === 'ar' ? 'البرنامج الزمني' : 'Schedule'}
                    </h2>
                    <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl">
                        <div className="space-y-4 sm:space-y-6">
                            {hackathonData.schedule.map((item, index) => (
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
            <section className="py-8 sm:py-10 lg:py-12 relative scroll-animate">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
                        {language === 'ar' ? 'المتطلبات' : 'Requirements'}
                    </h2>
                    <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {hackathonData.requirements.map((requirement, index) => (
                                <div key={index} className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition-all duration-300 animate-fade-in-up" style={{animationDelay: `${index * 100}ms`}}>
                                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 rtl:mr-0 rtl:ml-3">
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

            {/* Prizes Section */}
            <section className="py-8 sm:py-10 lg:py-12 relative scroll-animate bg-gradient-to-br from-yellow-50 to-orange-50">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
                        {language === 'ar' ? 'الجوائز' : 'Prizes'}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {hackathonData.prizes.map((prize, index) => (
                            <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up text-center" style={{animationDelay: `${index * 100}ms`}}>
                                <div className="text-4xl sm:text-5xl mb-4 animate-bounce">{prize.icon}</div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">{prize.place}</h3>
                                <p className="text-sm sm:text-base text-gray-600 font-medium">{prize.prize}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-8 sm:py-10 lg:py-12 text-white relative scroll-animate rounded-2xl sm:rounded-3xl mx-2 sm:mx-4 mb-2 sm:mb-4" style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}>
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative max-w-4xl mx-auto text-center px-3 sm:px-4 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 animate-fade-in-down">
                        {language === 'ar' ? 'انضم إلى الهاكثون الآن' : 'Join the Hackathon Now'}
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-5 sm:mb-6 animate-fade-in-up animate-delay-200">
                        {language === 'ar' 
                            ? 'لا تفوت فرصة المشاركة في هذا الحدث المميز وتطوير مهاراتك في مجال التكنولوجيا'
                            : 'Don\'t miss the opportunity to participate in this special event and develop your technology skills'
                        }
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in-up animate-delay-400">
                        <Link
                            to="/hackathon"
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

export default HackathonInfo;
