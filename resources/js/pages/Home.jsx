import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { initScrollAnimations, staggerAnimation, typeWriter } from '../utils/scrollAnimations';

const Home = () => {
    const { t, language } = useLanguage();
    const { user, isAuthenticated } = useAuth();
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);

    useEffect(() => {
        // Initialize scroll animations
        const observer = initScrollAnimations();
        
        // Typewriter effect for title
        if (titleRef.current) {
            const titleText = language === 'ar' ? 'ملتقى الابتكار 2025' : 'Innovation Forum 2025';
            setTimeout(() => {
                typeWriter(titleRef.current, titleText, 100);
            }, 500);
        }
        
        // Typewriter effect for subtitle
        if (subtitleRef.current) {
            const subtitleText = language === 'ar' 
                ? 'منصة إبداعية تجمع المبرمجين والمصممين ورواد الأعمال لتطوير حلول حقيقية'
                : 'Creative platform bringing together programmers, designers and entrepreneurs to develop real solutions';
            setTimeout(() => {
                typeWriter(subtitleRef.current, subtitleText, 50);
            }, 2000);
        }

        return () => {
            if (observer) observer.disconnect();
        };
    }, [language]);

    const hackathonInfo = {
        title: language === 'ar' ? 'هاكاثون "ابتكر من الدقم"' : 'Hackathon "Innovate from Duqm"',
        subtitle: language === 'ar' ? 'منصة إبداعية تجمع المبرمجين والمصممين ورواد الأعمال' : 'Creative platform bringing together programmers, designers and entrepreneurs',
        description: language === 'ar' 
            ? 'لتطوير حلول حقيقية لتحديات واقعية في مجالات الطاقة والبيئة والنقل والسياحة. يتميّز الهاكاثون بعنصر المفاجأة، حيث تُعلن التحديات لحظة الانطلاق دون استعداد مسبق، وتعمل الفرق خلال ٤ ساعات على تحليلها وبناء حلول ذكية باستخدام تقنيات الذكاء الاصطناعي.'
            : 'To develop real solutions for real challenges in energy, environment, transport and tourism sectors. The hackathon features surprise elements, with challenges announced at launch without prior preparation, and teams work for 4 hours to analyze and build smart solutions using artificial intelligence technologies.',
        features: language === 'ar' 
            ? ['تحديات مفاجئة', '4 ساعات من العمل المكثف', 'استخدام الذكاء الاصطناعي', 'حلول قابلة للتطبيق']
            : ['Surprise Challenges', '4 Hours Intensive Work', 'AI Technology Usage', 'Practical Solutions'],
        icon: '🚀',
        color: 'from-purple-600 to-pink-600'
    };

    const workshopInfo = {
        title: language === 'ar' ? 'الورش التدريبية' : 'Training Workshops',
        subtitle: language === 'ar' ? 'ورش تأهيلية تسبق الهاكاثون' : 'Preparatory workshops before the hackathon',
        description: language === 'ar'
            ? 'تهدف إلى صقل مهارات المشاركين في تحليل المشكلات، تطوير الحلول، والعمل الجماعي. توفر للمشاركين المعرفة والأدوات اللازمة لتحويل التحديات إلى فرص ابتكارية، وتزيد جاهزيتهم لتقديم حلول مؤثرة خلال الهاكاثون.'
            : 'Aim to hone participants\' skills in problem analysis, solution development, and teamwork. Provide participants with the knowledge and tools needed to transform challenges into innovative opportunities, and increase their readiness to present impactful solutions during the hackathon.',
        features: language === 'ar'
            ? ['تحليل المشكلات', 'تطوير الحلول', 'العمل الجماعي', 'الأدوات اللازمة']
            : ['Problem Analysis', 'Solution Development', 'Teamwork', 'Essential Tools'],
        icon: '🎓',
        color: 'from-blue-600 to-cyan-600'
    };

    const conferenceInfo = {
        title: language === 'ar' ? 'ملتقى الابتكار 2025' : 'Innovation Forum 2025',
        subtitle: language === 'ar' ? 'المؤتمر الصحفي - النسخة الثالثة' : 'Press Conference - Third Edition',
        description: language === 'ar'
            ? 'في إطار جهود تعزيز بيئة الابتكار وريادة الأعمال في سلطنة عُمان، تنطلق النسخة الثالثة من ملتقى الابتكار كأحد أهم الفعاليات الوطنية التي تجمع نخبة من المؤسسات الحكومية والخاصة والأكاديمية، تحت مظلة واحدة تسعى إلى تحفيز العقول الشابة وتحويل الأفكار الإبداعية إلى مشاريع واقعية.'
            : 'As part of efforts to enhance the innovation and entrepreneurship environment in the Sultanate of Oman, the third edition of the Innovation Forum launches as one of the most important national events that brings together elite government, private and academic institutions under one umbrella that seeks to stimulate young minds and transform creative ideas into real projects.',
        features: language === 'ar'
            ? ['مؤسسات حكومية وخاصة', 'تحفيز العقول الشابة', 'تحويل الأفكار إلى مشاريع', 'دعم الابتكار']
            : ['Government & Private Institutions', 'Stimulating Young Minds', 'Transforming Ideas into Projects', 'Innovation Support'],
        icon: '🎤',
        color: 'from-green-600 to-teal-600'
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white overflow-hidden animate-gradient">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 
                            ref={titleRef}
                            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight gradient-text animate-fade-in-down"
                        >
                        </h1>
                        <p 
                            ref={subtitleRef}
                            className="text-xl md:text-2xl text-indigo-200 mb-8 max-w-4xl mx-auto animate-fade-in-up animate-delay-300"
                        >
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-500">
                            {!isAuthenticated() ? (
                                <>
                                    <Link
                                        to="/login"
                                        className="ripple-effect button-press bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover-pulse-glow"
                                    >
                                        {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="ripple-effect button-press bg-white text-indigo-900 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover-float"
                                    >
                                        {language === 'ar' ? 'إنشاء حساب' : 'Create Account'}
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/hackathon"
                                        className="ripple-effect button-press bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover-pulse-glow"
                                    >
                                        {language === 'ar' ? 'سجل في الهاكثون' : 'Register for Hackathon'}
                                    </Link>
                                    <Link
                                        to="/workshop"
                                        className="ripple-effect button-press bg-white text-indigo-900 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover-float"
                                    >
                                        {language === 'ar' ? 'سجل في الورشة' : 'Register for Workshop'}
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Enhanced Floating Elements */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-pink-500 rounded-full opacity-20 animate-pulse hover-float"></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500 rounded-full opacity-20 animate-pulse delay-1000 hover-float"></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-cyan-500 rounded-full opacity-20 animate-pulse delay-500 hover-float"></div>
                <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-yellow-400 rounded-full opacity-30 animate-bounce delay-700"></div>
                <div className="absolute bottom-1/3 left-1/3 w-8 h-8 bg-green-400 rounded-full opacity-40 animate-ping"></div>
            </div>

            {/* Hackathon Section */}
            <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50 scroll-animate">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6 animate-fade-in-left">
                            <div className="flex items-center space-x-4 rtl:space-x-reverse hover-float">
                                <div className="text-6xl animate-bounce">{hackathonInfo.icon}</div>
                                <div>
                                    <h2 className="text-4xl font-bold text-gray-900 gradient-text">{hackathonInfo.title}</h2>
                                    <p className="text-xl text-purple-600 font-semibold animate-fade-in-up animate-delay-200">{hackathonInfo.subtitle}</p>
                                </div>
                            </div>
                            
                            <p className="text-lg text-gray-700 leading-relaxed animate-fade-in-up animate-delay-300">
                                {hackathonInfo.description}
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4">
                                {hackathonInfo.features.map((feature, index) => (
                                    <div key={index} className="flex items-center space-x-3 rtl:space-x-reverse animate-fade-in-up" style={{animationDelay: `${400 + index * 100}ms`}}>
                                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                                        <span className="text-gray-700 font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <Link
                                to="/hackathon"
                                className={`ripple-effect button-press inline-block bg-gradient-to-r ${hackathonInfo.color} text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover-pulse-glow animate-fade-in-up animate-delay-700`}
                            >
                                {language === 'ar' ? 'سجل الآن في الهاكثون' : 'Register Now for Hackathon'}
                            </Link>
                        </div>
                        
                        <div className="relative animate-fade-in-right">
                            <div className="card-hover bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white animate-gradient">
                                    <h3 className="text-2xl font-bold mb-4 animate-fade-in-down">
                                        {language === 'ar' ? '4 ساعات من الإبداع' : '4 Hours of Innovation'}
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3 rtl:space-x-reverse animate-fade-in-left animate-delay-200">
                                            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                            <span>{language === 'ar' ? 'تحديات مفاجئة' : 'Surprise Challenges'}</span>
                                        </div>
                                        <div className="flex items-center space-x-3 rtl:space-x-reverse animate-fade-in-left animate-delay-300">
                                            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                            <span>{language === 'ar' ? 'ذكاء اصطناعي' : 'Artificial Intelligence'}</span>
                                        </div>
                                        <div className="flex items-center space-x-3 rtl:space-x-reverse animate-fade-in-left animate-delay-400">
                                            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                            <span>{language === 'ar' ? 'حلول قابلة للتطبيق' : 'Practical Solutions'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Workshop Section */}
            <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50 scroll-animate">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="relative order-2 lg:order-1 animate-fade-in-left">
                            <div className="card-hover bg-white rounded-3xl shadow-2xl p-8 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white animate-gradient">
                                    <h3 className="text-2xl font-bold mb-4 animate-fade-in-down">
                                        {language === 'ar' ? 'ورش تأهيلية' : 'Preparatory Workshops'}
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3 rtl:space-x-reverse animate-fade-in-right animate-delay-200">
                                            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                            <span>{language === 'ar' ? 'تحليل المشكلات' : 'Problem Analysis'}</span>
                                        </div>
                                        <div className="flex items-center space-x-3 rtl:space-x-reverse animate-fade-in-right animate-delay-300">
                                            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                            <span>{language === 'ar' ? 'تطوير الحلول' : 'Solution Development'}</span>
                                        </div>
                                        <div className="flex items-center space-x-3 rtl:space-x-reverse animate-fade-in-right animate-delay-400">
                                            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                            <span>{language === 'ar' ? 'العمل الجماعي' : 'Teamwork'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-6 order-1 lg:order-2 animate-fade-in-right">
                            <div className="flex items-center space-x-4 rtl:space-x-reverse hover-float">
                                <div className="text-6xl animate-bounce">{workshopInfo.icon}</div>
                                <div>
                                    <h2 className="text-4xl font-bold text-gray-900 gradient-text">{workshopInfo.title}</h2>
                                    <p className="text-xl text-blue-600 font-semibold animate-fade-in-up animate-delay-200">{workshopInfo.subtitle}</p>
                                </div>
                            </div>
                            
                            <p className="text-lg text-gray-700 leading-relaxed animate-fade-in-up animate-delay-300">
                                {workshopInfo.description}
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4">
                                {workshopInfo.features.map((feature, index) => (
                                    <div key={index} className="flex items-center space-x-3 rtl:space-x-reverse animate-fade-in-up" style={{animationDelay: `${400 + index * 100}ms`}}>
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                        <span className="text-gray-700 font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <Link
                                to="/workshop"
                                className={`ripple-effect button-press inline-block bg-gradient-to-r ${workshopInfo.color} text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover-pulse-glow animate-fade-in-up animate-delay-700`}
                            >
                                {language === 'ar' ? 'سجل في الورشة' : 'Register for Workshop'}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Conference Section */}
            <section className="py-20 bg-gradient-to-br from-green-50 to-teal-50 scroll-animate">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6 animate-fade-in-left">
                            <div className="flex items-center space-x-4 rtl:space-x-reverse hover-float">
                                <div className="text-6xl animate-bounce">{conferenceInfo.icon}</div>
                                <div>
                                    <h2 className="text-4xl font-bold text-gray-900 gradient-text">{conferenceInfo.title}</h2>
                                    <p className="text-xl text-green-600 font-semibold animate-fade-in-up animate-delay-200">{conferenceInfo.subtitle}</p>
                                </div>
                            </div>
                            
                            <p className="text-lg text-gray-700 leading-relaxed animate-fade-in-up animate-delay-300">
                                {conferenceInfo.description}
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4">
                                {conferenceInfo.features.map((feature, index) => (
                                    <div key={index} className="flex items-center space-x-3 rtl:space-x-reverse animate-fade-in-up" style={{animationDelay: `${400 + index * 100}ms`}}>
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-gray-700 font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <Link
                                to="/conference"
                                className={`ripple-effect button-press inline-block bg-gradient-to-r ${conferenceInfo.color} text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover-pulse-glow animate-fade-in-up animate-delay-700`}
                            >
                                {language === 'ar' ? 'سجل في المؤتمر' : 'Register for Conference'}
                            </Link>
                        </div>
                        
                        <div className="relative animate-fade-in-right">
                            <div className="card-hover bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl p-6 text-white animate-gradient">
                                    <h3 className="text-2xl font-bold mb-4 animate-fade-in-down">
                                        {language === 'ar' ? 'ملتقى الابتكار' : 'Innovation Forum'}
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3 rtl:space-x-reverse animate-fade-in-left animate-delay-200">
                                            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                            <span>{language === 'ar' ? 'مؤسسات حكومية وخاصة' : 'Government & Private Institutions'}</span>
                                        </div>
                                        <div className="flex items-center space-x-3 rtl:space-x-reverse animate-fade-in-left animate-delay-300">
                                            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                            <span>{language === 'ar' ? 'تحفيز العقول الشابة' : 'Stimulating Young Minds'}</span>
                                        </div>
                                        <div className="flex items-center space-x-3 rtl:space-x-reverse animate-fade-in-left animate-delay-400">
                                            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                            <span>{language === 'ar' ? 'تحويل الأفكار إلى مشاريع' : 'Transforming Ideas into Projects'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white animate-gradient scroll-animate">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-down gradient-text">
                        {language === 'ar' ? 'انضم إلى رحلة الابتكار' : 'Join the Innovation Journey'}
                    </h2>
                    <p className="text-xl text-indigo-200 mb-8 animate-fade-in-up animate-delay-200">
                        {language === 'ar' 
                            ? 'فرصة مثالية لإبراز الإبداع، تعزيز العمل الجماعي، وتحويل الأفكار إلى مشاريع قابلة للتطبيق'
                            : 'Perfect opportunity to showcase creativity, enhance teamwork, and transform ideas into practical projects'
                        }
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-400">
                        <Link
                            to="/hackathon"
                            className="ripple-effect button-press bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover-pulse-glow"
                        >
                            {language === 'ar' ? 'ابدأ رحلتك الآن' : 'Start Your Journey Now'}
                        </Link>
                        <Link
                            to="/workshop"
                            className="ripple-effect button-press bg-white text-indigo-900 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover-float"
                        >
                            {language === 'ar' ? 'تعلم المزيد' : 'Learn More'}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
