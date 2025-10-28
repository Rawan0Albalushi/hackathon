import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { initScrollAnimations, staggerAnimation, typeWriter } from '../utils/scrollAnimations';

const Home = () => {
    const { t, language } = useLanguage();
    const { user, isAuthenticated } = useAuth();
    const [hackathonRegistration, setHackathonRegistration] = useState(null);
    const [allRegistrations, setAllRegistrations] = useState({
        hackathon: null,
        conference: null,
        workshops: []
    });

    useEffect(() => {
        // Initialize scroll animations
        const observer = initScrollAnimations();
        
        return () => {
            if (observer) observer.disconnect();
        };
    }, [language]);

    // Check for all registrations
    useEffect(() => {
        if (isAuthenticated) {
            fetchAllRegistrations();
        }
    }, [isAuthenticated]);

    const fetchAllRegistrations = async () => {
        try {
            const response = await fetch('/api/user/registrations', {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success) {
                setAllRegistrations(data.data);
                // Keep hackathon registration for backward compatibility
                setHackathonRegistration(data.data.hackathon);
            }
        } catch (error) {
            console.error('Error fetching registrations:', error);
        }
    };

    // Function to determine which registration to track
    const getRegistrationToTrack = () => {
        if (allRegistrations.hackathon) {
            return {
                type: 'hackathon',
                text: language === 'ar' ? 'متابعة طلب الهاكثون' : 'Track Hackathon Application',
                url: '/hackathon'
            };
        }
        if (allRegistrations.conference) {
            return {
                type: 'conference',
                text: language === 'ar' ? 'متابعة طلب المؤتمر' : 'Track Conference Application',
                url: '/conference'
            };
        }
        if (allRegistrations.workshops && allRegistrations.workshops.length > 0) {
            return {
                type: 'workshops',
                text: language === 'ar' ? 'متابعة طلبات الورش' : 'Track Workshop Applications',
                url: '/workshop'
            };
        }
        return null;
    };

    // Function to get workshop registration status
    const getWorkshopRegistrationStatus = () => {
        if (allRegistrations.workshops && allRegistrations.workshops.length > 0) {
            return {
                hasRegistration: true,
                text: language === 'ar' ? 'متابعة طلبات الورش' : 'Track Workshop Applications',
                url: '/workshop'
            };
        }
        return {
            hasRegistration: false,
            text: language === 'ar' ? 'سجل في الورشة' : 'Register for Workshop',
            url: '/workshop'
        };
    };

    // Function to get conference registration status
    const getConferenceRegistrationStatus = () => {
        if (allRegistrations.conference) {
            return {
                hasRegistration: true,
                text: language === 'ar' ? 'متابعة طلب المؤتمر' : 'Track Conference Application',
                url: '/conference'
            };
        }
        return {
            hasRegistration: false,
            text: language === 'ar' ? 'سجل في المؤتمر' : 'Register for Conference',
            url: '/conference'
        };
    };

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
        <div className="min-h-screen relative">
            {/* Unified Background Gradient */}
            <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom, #FFF5EB 0%, #FFE5F0 25%, #E8F4F8 50%, #F0E8F5 75%, #FFF5EB 100%)'}}></div>
            
            {/* Hero Section */}
            <div className="relative text-white overflow-hidden animate-gradient rounded-2xl sm:rounded-3xl mx-2 sm:mx-4 mt-2 sm:mt-4" style={{background: 'linear-gradient(135deg, #003C72 0%, #096289 50%, #D85584 100%)'}}>
                <div className="absolute inset-0 bg-black opacity-20"></div>
                {/* Background Logo */}
                <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
                    <img 
                        src="/images/logo_vertical_colored.png" 
                        alt="Logo Background" 
                        className="h-full w-auto object-contain animate-pulse"
                        style={{filter: 'blur(20px)'}}
                    />
                </div>
                <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-2 sm:py-3 lg:py-4">
                    {/* Hero Logo with Enhanced Animation */}
                    <div className="flex justify-center mb-1">
                        <div className="relative">
                            <img 
                                src="/images/logo_horizontal_white.png" 
                                alt={language === 'ar' ? 'ملتقى الابتكار' : 'Innovation Forum'} 
                                className="h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[28rem] 2xl:h-[32rem] w-auto object-contain logo-slide-in logo-glow logo-optimized"
                                loading="eager"
                            />
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-20 blur-3xl animate-pulse pointer-events-none"></div>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in-up animate-delay-500 px-2 mt-2">
                            {!isAuthenticated() ? (
                                <>
                                    <Link
                                        to="/login"
                                        className="ripple-effect button-press text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform  hover-pulse-glow w-full sm:w-auto"
                                        style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}
                                    >
                                        {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="ripple-effect button-press bg-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform  hover-float w-full sm:w-auto"
                                        style={{color: '#003C72'}}
                                    >
                                        {language === 'ar' ? 'إنشاء حساب' : 'Create Account'}
                                    </Link>
                                </>
                            ) : (
                                <>
                                    {(() => {
                                        const registrationToTrack = getRegistrationToTrack();
                                        return (
                                            <>
                                                {registrationToTrack ? (
                                                    <Link
                                                        to={registrationToTrack.url}
                                                        className="ripple-effect button-press text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform  hover-pulse-glow w-full sm:w-auto"
                                                        style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}
                                                    >
                                                        {registrationToTrack.text}
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        to="/hackathon"
                                                        className="ripple-effect button-press text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform  hover-pulse-glow w-full sm:w-auto"
                                                        style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}
                                                    >
                                                        {language === 'ar' ? 'سجل في الهاكثون' : 'Register for Hackathon'}
                                                    </Link>
                                                )}
                                                {(() => {
                                                    const workshopStatus = getWorkshopRegistrationStatus();
                                                    return (
                                                        <Link
                                                            to={workshopStatus.url}
                                                            className="ripple-effect button-press bg-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform  hover-float w-full sm:w-auto"
                                                            style={{color: '#003C72'}}
                                                        >
                                                            {workshopStatus.text}
                                                        </Link>
                                                    );
                                                })()}
                                            </>
                                        );
                                    })()}
                                </>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Enhanced Floating Star Elements - Mobile Optimized */}
                <div className="hero-star top-8 sm:top-20 left-3 sm:left-10 w-8 h-8 sm:w-16 sm:h-16 lg:w-20 lg:h-20 opacity-10 sm:opacity-15 lg:opacity-20 animate-pulse hover-float" style={{background: '#F4A321'}}></div>
                <div className="hero-star bottom-8 sm:bottom-20 right-3 sm:right-10 w-12 h-12 sm:w-24 sm:h-24 lg:w-32 lg:h-32 opacity-10 sm:opacity-15 lg:opacity-20 animate-pulse delay-1000 hover-float" style={{background: '#D85584'}}></div>
                <div className="hero-star top-1/2 left-1/8 sm:left-1/4 w-6 h-6 sm:w-12 sm:h-12 lg:w-16 lg:h-16 opacity-10 sm:opacity-15 lg:opacity-20 animate-pulse delay-500 hover-float" style={{background: '#096289'}}></div>
                <div className="hero-star top-1/3 right-1/8 sm:right-1/4 w-4 h-4 sm:w-8 sm:h-8 lg:w-12 lg:h-12 opacity-15 sm:opacity-20 lg:opacity-30 animate-bounce delay-700" style={{background: '#F4A321'}}></div>
                <div className="hero-star bottom-1/3 left-1/6 sm:left-1/3 w-3 h-3 sm:w-6 sm:h-6 lg:w-8 lg:h-8 opacity-20 sm:opacity-25 lg:opacity-40 animate-ping" style={{background: '#D85584'}}></div>
                
                {/* Additional Mobile-Friendly Floating Star Elements */}
                <div className="hero-star top-1/4 left-1/2 w-2 h-2 sm:w-4 sm:h-4 opacity-30 sm:opacity-40 animate-ping delay-300" style={{background: '#096289'}}></div>
                <div className="hero-star bottom-1/4 right-1/2 w-3 h-3 sm:w-5 sm:h-5 opacity-25 sm:opacity-35 animate-bounce delay-900" style={{background: '#F4A321'}}></div>
            </div>

            {/* Hackathon Section */}
            <section className="py-12 sm:py-16 lg:py-20 relative scroll-animate">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
                        <div className="space-y-4 sm:space-y-6 animate-fade-in-left">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 rtl:space-x-reverse hover-float">
                                <div className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl animate-bounce hover-bounce-in">{hackathonInfo.icon}</div>
                                <div className="text-center sm:text-left">
                                    <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 gradient-text animate-fade-in-down">{hackathonInfo.title}</h2>
                                    <p className="text-sm sm:text-base lg:text-lg xl:text-xl font-semibold animate-fade-in-up animate-delay-200" style={{color: '#D85584'}}>{hackathonInfo.subtitle}</p>
                                </div>
                            </div>
                            
                            <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed animate-fade-in-up animate-delay-300 px-2 sm:px-0">
                                {hackathonInfo.description}
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                {hackathonInfo.features.map((feature, index) => (
                                    <div key={index} className="flex items-center space-x-4 sm:space-x-5 rtl:space-x-reverse animate-fade-in-up hover-float" style={{animationDelay: `${400 + index * 100}ms`}}>
                                        <div className="w-2 h-2 sm:w-3 sm:h-3 flex-shrink-0 animate-pulse" style={{background: '#D85584', clipPath: 'polygon(50% 0%, 70% 30%, 100% 50%, 70% 70%, 50% 100%, 30% 70%, 0% 50%, 30% 30%)'}}></div>
                                        <span className="text-xs sm:text-sm lg:text-base text-gray-700 font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-up animate-delay-700">
                                <Link
                                    to="/hackathon-info"
                                    className="ripple-effect button-press inline-block bg-white text-gray-700 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto text-center border-2 border-gray-200"
                                >
                                    {language === 'ar' ? 'معرفة المزيد' : 'Learn More'}
                                </Link>
                                {(() => {
                                    const registrationToTrack = getRegistrationToTrack();
                                    return (
                                        <Link
                                            to={registrationToTrack ? registrationToTrack.url : "/hackathon"}
                                            className="ripple-effect button-press inline-block text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-semibold hover:shadow-xl transition-all duration-300 transform  hover-pulse-glow w-full sm:w-auto text-center"
                                            style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}
                                        >
                                            {registrationToTrack 
                                                ? registrationToTrack.text
                                                : (language === 'ar' ? 'سجل الآن' : 'Register Now')
                                            }
                                        </Link>
                                    );
                                })()}
                            </div>
                        </div>
                        
                        <div className="relative animate-fade-in-right mt-8 lg:mt-0">
                            <div className="modern-card card-glow bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl p-3 sm:p-4 lg:p-6 xl:p-8 transform rotate-1 sm:rotate-2 lg:rotate-3 hover:rotate-0 transition-all duration-500 hover-float overflow-hidden relative">
                                {/* Card Image */}
                                <div className="absolute top-4 right-4 w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 opacity-5 hover:opacity-20 transition-opacity duration-300">
                                    <img 
                                        src="/images/logo_horizontal_white.png" 
                                        alt="Hackathon" 
                                        className="w-full h-full object-contain filter blur-sm hover:blur-none transition-all duration-300"
                                    />
                                </div>
                                {/* Floating Elements - Mobile Optimized - Circles removed for cleaner design */}
                                
                                <div className="card-content">
                                    <div className="rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 text-white animate-gradient relative overflow-hidden" style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}>
                                        {/* Background Pattern - Mobile Optimized - Circles removed - Updated */}
                                        
                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
                                                <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold animate-fade-in-down">
                                                    {language === 'ar' ? '4 ساعات من الإبداع' : '4 Hours of Innovation'}
                                                </h3>
                                                <div className="card-icon text-xl sm:text-2xl lg:text-3xl animate-bounce hover-bounce-in">
                                                    🚀
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                                                <div className="feature-item flex items-center space-x-4 sm:space-x-5 rtl:space-x-reverse animate-fade-in-left animate-delay-200 hover-float">
                                                    <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-white animate-pulse flex-shrink-0" style={{clipPath: 'polygon(50% 0%, 70% 30%, 100% 50%, 70% 70%, 50% 100%, 30% 70%, 0% 50%, 30% 30%)'}}></div>
                                                    <span className="font-medium text-xs sm:text-sm lg:text-base">{language === 'ar' ? 'تحديات مفاجئة' : 'Surprise Challenges'}</span>
                                                </div>
                                                <div className="feature-item flex items-center space-x-4 sm:space-x-5 rtl:space-x-reverse animate-fade-in-left animate-delay-300 hover-float">
                                                    <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-white animate-pulse flex-shrink-0" style={{clipPath: 'polygon(50% 0%, 70% 30%, 100% 50%, 70% 70%, 50% 100%, 30% 70%, 0% 50%, 30% 30%)'}}></div>
                                                    <span className="font-medium text-xs sm:text-sm lg:text-base">{language === 'ar' ? 'ذكاء اصطناعي' : 'Artificial Intelligence'}</span>
                                                </div>
                                                <div className="feature-item flex items-center space-x-4 sm:space-x-5 rtl:space-x-reverse animate-fade-in-left animate-delay-400 hover-float">
                                                    <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-white animate-pulse flex-shrink-0" style={{clipPath: 'polygon(50% 0%, 70% 30%, 100% 50%, 70% 70%, 50% 100%, 30% 70%, 0% 50%, 30% 30%)'}}></div>
                                                    <span className="font-medium text-xs sm:text-sm lg:text-base">{language === 'ar' ? 'حلول قابلة للتطبيق' : 'Practical Solutions'}</span>
                                                </div>
                                            </div>
                                            
                                            {/* Occasional Pattern */}
                                            <div className="mt-3 sm:mt-4 lg:mt-6 relative overflow-hidden rounded-lg">
                                                <img 
                                                    src="/images/Occasional pattern.png" 
                                                    alt="Pattern" 
                                                    className="w-full h-8 sm:h-10 lg:h-12 object-cover opacity-30 hover:opacity-50 transition-opacity duration-300"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Workshop Section */}
            <section className="py-12 sm:py-16 lg:py-20 relative scroll-animate">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
                        <div className="relative order-2 lg:order-1 animate-fade-in-left">
                            <div className="modern-card card-glow bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 transform -rotate-1 sm:-rotate-3 hover:rotate-0 transition-all duration-500 overflow-hidden relative">
                                {/* Card Image */}
                                <div className="absolute bottom-4 left-4 w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 opacity-5 hover:opacity-20 transition-opacity duration-300">
                                    <img 
                                        src="/images/logo_horizontal_white.png" 
                                        alt="Workshop" 
                                        className="w-full h-full object-contain filter blur-sm hover:blur-none transition-all duration-300"
                                    />
                                </div>
                                {/* Floating Elements - Removed circles */}
                                
                                <div className="card-content">
                                    <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white animate-gradient relative overflow-hidden" style={{background: 'linear-gradient(135deg, #096289 0%, #003C72 100%)'}}>
                                        {/* Background Pattern - Circles removed */}
                                        
                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold animate-fade-in-down">
                                                    {language === 'ar' ? 'ورش تأهيلية' : 'Preparatory Workshops'}
                                                </h3>
                                                <div className="card-icon text-2xl sm:text-3xl animate-bounce">
                                                    🎓
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-3 sm:space-y-4">
                                                <div className="feature-item flex items-center space-x-5 rtl:space-x-reverse animate-fade-in-right animate-delay-200">
                                                    <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-white animate-pulse flex-shrink-0" style={{clipPath: 'polygon(50% 0%, 70% 30%, 100% 50%, 70% 70%, 50% 100%, 30% 70%, 0% 50%, 30% 30%)'}}></div>
                                                    <span className="font-medium text-sm sm:text-base">{language === 'ar' ? 'تحليل المشكلات' : 'Problem Analysis'}</span>
                                                </div>
                                                <div className="feature-item flex items-center space-x-5 rtl:space-x-reverse animate-fade-in-right animate-delay-300">
                                                    <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-white animate-pulse flex-shrink-0" style={{clipPath: 'polygon(50% 0%, 70% 30%, 100% 50%, 70% 70%, 50% 100%, 30% 70%, 0% 50%, 30% 30%)'}}></div>
                                                    <span className="font-medium text-sm sm:text-base">{language === 'ar' ? 'تطوير الحلول' : 'Solution Development'}</span>
                                                </div>
                                                <div className="feature-item flex items-center space-x-5 rtl:space-x-reverse animate-fade-in-right animate-delay-400">
                                                    <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-white animate-pulse flex-shrink-0" style={{clipPath: 'polygon(50% 0%, 70% 30%, 100% 50%, 70% 70%, 50% 100%, 30% 70%, 0% 50%, 30% 30%)'}}></div>
                                                    <span className="font-medium text-sm sm:text-base">{language === 'ar' ? 'العمل الجماعي' : 'Teamwork'}</span>
                                                </div>
                                            </div>
                                            
                                            {/* Occasional Pattern */}
                                            <div className="mt-4 sm:mt-6 relative overflow-hidden rounded-lg">
                                                <img 
                                                    src="/images/Occasional pattern.png" 
                                                    alt="Pattern" 
                                                    className="w-full h-8 sm:h-10 lg:h-12 object-cover opacity-30 hover:opacity-50 transition-opacity duration-300"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-4 sm:space-y-6 order-1 lg:order-2 animate-fade-in-right mt-8 lg:mt-0">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 rtl:space-x-reverse hover-float">
                                <div className="text-4xl sm:text-5xl lg:text-6xl animate-bounce">{workshopInfo.icon}</div>
                                <div className="text-center sm:text-left">
                                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 gradient-text">{workshopInfo.title}</h2>
                                    <p className="text-base sm:text-lg lg:text-xl font-semibold animate-fade-in-up animate-delay-200" style={{color: '#096289'}}>{workshopInfo.subtitle}</p>
                                </div>
                            </div>
                            
                            <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed animate-fade-in-up animate-delay-300 px-2 sm:px-0">
                                {workshopInfo.description}
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                {workshopInfo.features.map((feature, index) => (
                                    <div key={index} className="flex items-center space-x-5 rtl:space-x-reverse animate-fade-in-up" style={{animationDelay: `${400 + index * 100}ms`}}>
                                        <div className="w-2 h-2 sm:w-3 sm:h-3 flex-shrink-0 animate-pulse" style={{background: '#096289', clipPath: 'polygon(50% 0%, 70% 30%, 100% 50%, 70% 70%, 50% 100%, 30% 70%, 0% 50%, 30% 30%)'}}></div>
                                        <span className="text-sm sm:text-base text-gray-700 font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-up animate-delay-700">
                                <Link
                                    to="/workshop-info"
                                    className="ripple-effect button-press inline-block bg-white text-gray-700 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto text-center border-2 border-gray-200"
                                >
                                    {language === 'ar' ? 'معرفة المزيد' : 'Learn More'}
                                </Link>
                                {(() => {
                                    const workshopStatus = getWorkshopRegistrationStatus();
                                    return (
                                        <Link
                                            to={workshopStatus.url}
                                            className="ripple-effect button-press inline-block text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-semibold hover:shadow-xl transition-all duration-300 transform  hover-pulse-glow w-full sm:w-auto text-center"
                                            style={{background: 'linear-gradient(135deg, #096289 0%, #003C72 100%)'}}
                                        >
                                            {workshopStatus.text}
                                        </Link>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Conference Section */}
            <section className="py-12 sm:py-16 lg:py-20 relative scroll-animate">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
                        <div className="space-y-4 sm:space-y-6 animate-fade-in-left">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 rtl:space-x-reverse hover-float">
                                <div className="text-4xl sm:text-5xl lg:text-6xl animate-bounce">{conferenceInfo.icon}</div>
                                <div className="text-center sm:text-left">
                                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 gradient-text">{conferenceInfo.title}</h2>
                                    <p className="text-base sm:text-lg lg:text-xl font-semibold animate-fade-in-up animate-delay-200" style={{color: '#003C72'}}>{conferenceInfo.subtitle}</p>
                                </div>
                            </div>
                            
                            <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed animate-fade-in-up animate-delay-300 px-2 sm:px-0">
                                {conferenceInfo.description}
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                {conferenceInfo.features.map((feature, index) => (
                                    <div key={index} className="flex items-center space-x-5 rtl:space-x-reverse animate-fade-in-up" style={{animationDelay: `${400 + index * 100}ms`}}>
                                        <div className="w-2 h-2 sm:w-3 sm:h-3 flex-shrink-0 animate-pulse" style={{background: '#003C72', clipPath: 'polygon(50% 0%, 70% 30%, 100% 50%, 70% 70%, 50% 100%, 30% 70%, 0% 50%, 30% 30%)'}}></div>
                                        <span className="text-sm sm:text-base text-gray-700 font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-up animate-delay-700">
                                <Link
                                    to="/conference-info"
                                    className="ripple-effect button-press inline-block bg-white text-gray-700 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto text-center border-2 border-gray-200"
                                >
                                    {language === 'ar' ? 'معرفة المزيد' : 'Learn More'}
                                </Link>
                                {(() => {
                                    const conferenceStatus = getConferenceRegistrationStatus();
                                    return (
                                        <Link
                                            to={conferenceStatus.url}
                                            className="ripple-effect button-press inline-block text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-semibold hover:shadow-xl transition-all duration-300 transform  hover-pulse-glow w-full sm:w-auto text-center"
                                            style={{background: 'linear-gradient(135deg, #003C72 0%, #096289 100%)'}}
                                        >
                                            {conferenceStatus.text}
                                        </Link>
                                    );
                                })()}
                            </div>
                        </div>
                        
                        <div className="relative animate-fade-in-right mt-8 lg:mt-0">
                            <div className="modern-card card-glow bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 transform rotate-1 sm:rotate-3 hover:rotate-0 transition-all duration-500 overflow-hidden relative">
                                {/* Card Image */}
                                <div className="absolute top-4 left-4 w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 opacity-5 hover:opacity-20 transition-opacity duration-300">
                                    <img 
                                        src="/images/logo_horizontal_white_1.png" 
                                        alt="Conference" 
                                        className="w-full h-full object-contain filter blur-sm hover:blur-none transition-all duration-300"
                                    />
                                </div>
                                {/* Floating Elements - Removed circles */}
                                
                                <div className="card-content">
                                    <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white animate-gradient relative overflow-hidden" style={{background: 'linear-gradient(135deg, #003C72 0%, #096289 100%)'}}>
                                        {/* Background Pattern - Circles removed */}
                                        
                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold animate-fade-in-down">
                                                    {language === 'ar' ? 'ملتقى الابتكار' : 'Innovation Forum'}
                                                </h3>
                                                <div className="card-icon text-2xl sm:text-3xl animate-bounce">
                                                    🎤
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-3 sm:space-y-4">
                                                <div className="feature-item flex items-center space-x-5 rtl:space-x-reverse animate-fade-in-left animate-delay-200">
                                                    <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-white animate-pulse flex-shrink-0" style={{clipPath: 'polygon(50% 0%, 70% 30%, 100% 50%, 70% 70%, 50% 100%, 30% 70%, 0% 50%, 30% 30%)'}}></div>
                                                    <span className="font-medium text-sm sm:text-base">{language === 'ar' ? 'مؤسسات حكومية وخاصة' : 'Government & Private Institutions'}</span>
                                                </div>
                                                <div className="feature-item flex items-center space-x-5 rtl:space-x-reverse animate-fade-in-left animate-delay-300">
                                                    <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-white animate-pulse flex-shrink-0" style={{clipPath: 'polygon(50% 0%, 70% 30%, 100% 50%, 70% 70%, 50% 100%, 30% 70%, 0% 50%, 30% 30%)'}}></div>
                                                    <span className="font-medium text-sm sm:text-base">{language === 'ar' ? 'تحفيز العقول الشابة' : 'Stimulating Young Minds'}</span>
                                                </div>
                                                <div className="feature-item flex items-center space-x-5 rtl:space-x-reverse animate-fade-in-left animate-delay-400">
                                                    <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-white animate-pulse flex-shrink-0" style={{clipPath: 'polygon(50% 0%, 70% 30%, 100% 50%, 70% 70%, 50% 100%, 30% 70%, 0% 50%, 30% 30%)'}}></div>
                                                    <span className="font-medium text-sm sm:text-base">{language === 'ar' ? 'تحويل الأفكار إلى مشاريع' : 'Transforming Ideas into Projects'}</span>
                                                </div>
                                            </div>
                                            
                                            {/* Occasional Pattern */}
                                            <div className="mt-4 sm:mt-6 relative overflow-hidden rounded-lg">
                                                <img 
                                                    src="/images/Occasional pattern.png" 
                                                    alt="Pattern" 
                                                    className="w-full h-8 sm:h-10 lg:h-12 object-cover opacity-30 hover:opacity-50 transition-opacity duration-300"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-12 sm:py-16 lg:py-20 text-white relative scroll-animate rounded-2xl sm:rounded-3xl mx-2 sm:mx-4 mb-2 sm:mb-4" style={{background: 'linear-gradient(135deg, #003C72 0%, #096289 50%, #D85584 100%)'}}>
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative max-w-4xl mx-auto text-center px-3 sm:px-4 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 animate-fade-in-down gradient-text">
                        {language === 'ar' ? 'انضم إلى رحلة الابتكار' : 'Join the Innovation Journey'}
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 animate-fade-in-up animate-delay-200 px-2" style={{color: '#F4A321'}}>
                        {language === 'ar' 
                            ? 'فرصة مثالية لإبراز الإبداع، تعزيز العمل الجماعي، وتحويل الأفكار إلى مشاريع قابلة للتطبيق'
                            : 'Perfect opportunity to showcase creativity, enhance teamwork, and transform ideas into practical projects'
                        }
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in-up animate-delay-400 px-2">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/hackathon-info"
                                    className="ripple-effect button-press border-2 border-white text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-semibold hover:bg-white hover:text-gray-700 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                                >
                                    {language === 'ar' ? 'معرفة المزيد عن الهاكثون' : 'Learn More About Hackathon'}
                                </Link>
                                <Link
                                    to="/workshop-info"
                                    className="ripple-effect button-press border-2 border-white text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-semibold hover:bg-white hover:text-gray-700 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                                >
                                    {language === 'ar' ? 'معرفة المزيد عن الورش' : 'Learn More About Workshops'}
                                </Link>
                                <Link
                                    to="/conference-info"
                                    className="ripple-effect button-press border-2 border-white text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-semibold hover:bg-white hover:text-gray-700 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                                >
                                    {language === 'ar' ? 'معرفة المزيد عن المؤتمر' : 'Learn More About Conference'}
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/hackathon-info"
                                    className="ripple-effect button-press border-2 border-white text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-semibold hover:bg-white hover:text-gray-700 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                                >
                                    {language === 'ar' ? 'معرفة المزيد' : 'Learn More'}
                                </Link>
                                <Link
                                    to="/hackathon"
                                    className="ripple-effect button-press text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform  hover-pulse-glow w-full sm:w-auto"
                                    style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}
                                >
                                    {language === 'ar' ? 'ابدأ رحلتك الآن' : 'Start Your Journey Now'}
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
