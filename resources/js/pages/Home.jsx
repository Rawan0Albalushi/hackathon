import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { initScrollAnimations, staggerAnimation, typeWriter } from '../utils/scrollAnimations';

const Home = () => {
    const { t, language } = useLanguage();
    const { user, isAuthenticated } = useAuth();
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const [hackathonRegistration, setHackathonRegistration] = useState(null);
    const [allRegistrations, setAllRegistrations] = useState({
        hackathon: null,
        conference: null,
        workshops: []
    });

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
            <div className="relative text-white overflow-hidden animate-gradient rounded-3xl mx-4 mt-4" style={{background: 'linear-gradient(135deg, #003C72 0%, #096289 50%, #D85584 100%)'}}>
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 
                            ref={titleRef}
                            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight gradient-text animate-fade-in-down"
                            style={{lineHeight: '1.1', paddingBottom: '0.75rem'}}
                        >
                        </h1>
                        <p 
                            ref={subtitleRef}
                            className="text-xl md:text-2xl text-orange-200 mb-8 max-w-4xl mx-auto animate-fade-in-up animate-delay-300"
                        >
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-500">
                            {!isAuthenticated() ? (
                                <>
                                    <Link
                                        to="/login"
                                        className="ripple-effect button-press text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover-pulse-glow"
                                        style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}
                                    >
                                        {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="ripple-effect button-press bg-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover-float"
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
                                                        className="ripple-effect button-press text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover-pulse-glow"
                                                        style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}
                                                    >
                                                        {registrationToTrack.text}
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        to="/hackathon"
                                                        className="ripple-effect button-press text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover-pulse-glow"
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
                                                            className="ripple-effect button-press bg-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover-float"
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
                
                {/* Enhanced Floating Elements */}
                <div className="absolute top-20 left-10 w-20 h-20 rounded-full opacity-20 animate-pulse hover-float" style={{background: '#F4A321'}}></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full opacity-20 animate-pulse delay-1000 hover-float" style={{background: '#D85584'}}></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full opacity-20 animate-pulse delay-500 hover-float" style={{background: '#096289'}}></div>
                <div className="absolute top-1/3 right-1/4 w-12 h-12 rounded-full opacity-30 animate-bounce delay-700" style={{background: '#F4A321'}}></div>
                <div className="absolute bottom-1/3 left-1/3 w-8 h-8 rounded-full opacity-40 animate-ping" style={{background: '#D85584'}}></div>
            </div>

            {/* Hackathon Section */}
            <section className="py-20 relative scroll-animate">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6 animate-fade-in-left">
                            <div className="flex items-center space-x-4 rtl:space-x-reverse hover-float">
                                <div className="text-6xl animate-bounce">{hackathonInfo.icon}</div>
                                <div>
                                    <h2 className="text-4xl font-bold text-gray-900 gradient-text">{hackathonInfo.title}</h2>
                                    <p className="text-xl font-semibold animate-fade-in-up animate-delay-200" style={{color: '#D85584'}}>{hackathonInfo.subtitle}</p>
                                </div>
                            </div>
                            
                            <p className="text-lg text-gray-700 leading-relaxed animate-fade-in-up animate-delay-300">
                                {hackathonInfo.description}
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4">
                                {hackathonInfo.features.map((feature, index) => (
                                    <div key={index} className="flex items-center space-x-3 rtl:space-x-reverse animate-fade-in-up" style={{animationDelay: `${400 + index * 100}ms`}}>
                                        <div className="w-2 h-2 rounded-full animate-pulse" style={{background: '#D85584'}}></div>
                                        <span className="text-gray-700 font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            
                            {(() => {
                                const registrationToTrack = getRegistrationToTrack();
                                return (
                                    <Link
                                        to={registrationToTrack ? registrationToTrack.url : "/hackathon"}
                                        className="ripple-effect button-press inline-block text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover-pulse-glow animate-fade-in-up animate-delay-700"
                                        style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}
                                    >
                                        {registrationToTrack 
                                            ? registrationToTrack.text
                                            : (language === 'ar' ? 'سجل الآن في الهاكثون' : 'Register Now for Hackathon')
                                        }
                                    </Link>
                                );
                            })()}
                        </div>
                        
                        <div className="relative animate-fade-in-right">
                            <div className="modern-card card-glow bg-white rounded-3xl p-8 transform rotate-3 hover:rotate-0 transition-all duration-500">
                                {/* Floating Elements */}
                                <div className="floating-element w-16 h-16 top-4 right-4"></div>
                                <div className="floating-element w-8 h-8 bottom-8 left-8"></div>
                                <div className="floating-element w-12 h-12 top-1/2 right-8"></div>
                                
                                <div className="card-content">
                                    <div className="rounded-2xl p-6 text-white animate-gradient relative overflow-hidden" style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}>
                                        {/* Background Pattern */}
                                        <div className="absolute inset-0 opacity-10">
                                            <div className="absolute top-4 right-4 w-20 h-20 border-2 border-white rounded-full"></div>
                                            <div className="absolute bottom-4 left-4 w-16 h-16 border-2 border-white rounded-full"></div>
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white rounded-full"></div>
                                        </div>
                                        
                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="text-2xl font-bold animate-fade-in-down">
                                                    {language === 'ar' ? '4 ساعات من الإبداع' : '4 Hours of Innovation'}
                                                </h3>
                                                <div className="card-icon text-3xl animate-bounce">
                                                    🚀
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                <div className="feature-item flex items-center space-x-3 rtl:space-x-reverse animate-fade-in-left animate-delay-200">
                                                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                                    <span className="font-medium">{language === 'ar' ? 'تحديات مفاجئة' : 'Surprise Challenges'}</span>
                                                </div>
                                                <div className="feature-item flex items-center space-x-3 rtl:space-x-reverse animate-fade-in-left animate-delay-300">
                                                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                                    <span className="font-medium">{language === 'ar' ? 'ذكاء اصطناعي' : 'Artificial Intelligence'}</span>
                                                </div>
                                                <div className="feature-item flex items-center space-x-3 rtl:space-x-reverse animate-fade-in-left animate-delay-400">
                                                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                                    <span className="font-medium">{language === 'ar' ? 'حلول قابلة للتطبيق' : 'Practical Solutions'}</span>
                                                </div>
                                            </div>
                                            
                                            {/* Progress Bar */}
                                            <div className="mt-6 bg-white/20 rounded-full h-2 overflow-hidden">
                                                <div className="bg-white h-full rounded-full animate-pulse" style={{width: '75%'}}></div>
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
            <section className="py-20 relative scroll-animate">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="relative order-2 lg:order-1 animate-fade-in-left">
                            <div className="modern-card card-glow bg-white rounded-3xl p-8 transform -rotate-3 hover:rotate-0 transition-all duration-500">
                                {/* Floating Elements */}
                                <div className="floating-element w-12 h-12 top-6 left-6"></div>
                                <div className="floating-element w-20 h-20 bottom-6 right-6"></div>
                                <div className="floating-element w-10 h-10 top-1/3 left-1/3"></div>
                                
                                <div className="card-content">
                                    <div className="rounded-2xl p-6 text-white animate-gradient relative overflow-hidden" style={{background: 'linear-gradient(135deg, #096289 0%, #003C72 100%)'}}>
                                        {/* Background Pattern */}
                                        <div className="absolute inset-0 opacity-10">
                                            <div className="absolute top-6 left-6 w-24 h-24 border-2 border-white rounded-lg rotate-45"></div>
                                            <div className="absolute bottom-6 right-6 w-20 h-20 border-2 border-white rounded-lg rotate-12"></div>
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white rounded-lg rotate-45"></div>
                                        </div>
                                        
                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="text-2xl font-bold animate-fade-in-down">
                                                    {language === 'ar' ? 'ورش تأهيلية' : 'Preparatory Workshops'}
                                                </h3>
                                                <div className="card-icon text-3xl animate-bounce">
                                                    🎓
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                <div className="feature-item flex items-center space-x-3 rtl:space-x-reverse animate-fade-in-right animate-delay-200">
                                                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                                    <span className="font-medium">{language === 'ar' ? 'تحليل المشكلات' : 'Problem Analysis'}</span>
                                                </div>
                                                <div className="feature-item flex items-center space-x-3 rtl:space-x-reverse animate-fade-in-right animate-delay-300">
                                                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                                    <span className="font-medium">{language === 'ar' ? 'تطوير الحلول' : 'Solution Development'}</span>
                                                </div>
                                                <div className="feature-item flex items-center space-x-3 rtl:space-x-reverse animate-fade-in-right animate-delay-400">
                                                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                                    <span className="font-medium">{language === 'ar' ? 'العمل الجماعي' : 'Teamwork'}</span>
                                                </div>
                                            </div>
                                            
                                            {/* Progress Bar */}
                                            <div className="mt-6 bg-white/20 rounded-full h-2 overflow-hidden">
                                                <div className="bg-white h-full rounded-full animate-pulse" style={{width: '60%'}}></div>
                                            </div>
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
                                    <p className="text-xl font-semibold animate-fade-in-up animate-delay-200" style={{color: '#096289'}}>{workshopInfo.subtitle}</p>
                                </div>
                            </div>
                            
                            <p className="text-lg text-gray-700 leading-relaxed animate-fade-in-up animate-delay-300">
                                {workshopInfo.description}
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4">
                                {workshopInfo.features.map((feature, index) => (
                                    <div key={index} className="flex items-center space-x-3 rtl:space-x-reverse animate-fade-in-up" style={{animationDelay: `${400 + index * 100}ms`}}>
                                        <div className="w-2 h-2 rounded-full animate-pulse" style={{background: '#096289'}}></div>
                                        <span className="text-gray-700 font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            
                            {(() => {
                                const workshopStatus = getWorkshopRegistrationStatus();
                                return (
                                    <Link
                                        to={workshopStatus.url}
                                        className="ripple-effect button-press inline-block text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover-pulse-glow animate-fade-in-up animate-delay-700"
                                        style={{background: 'linear-gradient(135deg, #096289 0%, #003C72 100%)'}}
                                    >
                                        {workshopStatus.text}
                                    </Link>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            </section>

            {/* Conference Section */}
            <section className="py-20 relative scroll-animate">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6 animate-fade-in-left">
                            <div className="flex items-center space-x-4 rtl:space-x-reverse hover-float">
                                <div className="text-6xl animate-bounce">{conferenceInfo.icon}</div>
                                <div>
                                    <h2 className="text-4xl font-bold text-gray-900 gradient-text">{conferenceInfo.title}</h2>
                                    <p className="text-xl font-semibold animate-fade-in-up animate-delay-200" style={{color: '#003C72'}}>{conferenceInfo.subtitle}</p>
                                </div>
                            </div>
                            
                            <p className="text-lg text-gray-700 leading-relaxed animate-fade-in-up animate-delay-300">
                                {conferenceInfo.description}
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4">
                                {conferenceInfo.features.map((feature, index) => (
                                    <div key={index} className="flex items-center space-x-3 rtl:space-x-reverse animate-fade-in-up" style={{animationDelay: `${400 + index * 100}ms`}}>
                                        <div className="w-2 h-2 rounded-full animate-pulse" style={{background: '#003C72'}}></div>
                                        <span className="text-gray-700 font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            
                            {(() => {
                                const conferenceStatus = getConferenceRegistrationStatus();
                                return (
                                    <Link
                                        to={conferenceStatus.url}
                                        className="ripple-effect button-press inline-block text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover-pulse-glow animate-fade-in-up animate-delay-700"
                                        style={{background: 'linear-gradient(135deg, #003C72 0%, #096289 100%)'}}
                                    >
                                        {conferenceStatus.text}
                                    </Link>
                                );
                            })()}
                        </div>
                        
                        <div className="relative animate-fade-in-right">
                            <div className="modern-card card-glow bg-white rounded-3xl p-8 transform rotate-3 hover:rotate-0 transition-all duration-500">
                                {/* Floating Elements */}
                                <div className="floating-element w-14 h-14 top-8 right-8"></div>
                                <div className="floating-element w-6 h-6 bottom-12 left-12"></div>
                                <div className="floating-element w-18 h-18 top-1/2 left-8"></div>
                                
                                <div className="card-content">
                                    <div className="rounded-2xl p-6 text-white animate-gradient relative overflow-hidden" style={{background: 'linear-gradient(135deg, #003C72 0%, #096289 100%)'}}>
                                        {/* Background Pattern */}
                                        <div className="absolute inset-0 opacity-10">
                                            <div className="absolute top-8 right-8 w-16 h-16 border-2 border-white rounded-full"></div>
                                            <div className="absolute bottom-8 left-8 w-12 h-12 border-2 border-white rounded-full"></div>
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 border border-white rounded-full"></div>
                                            <div className="absolute top-4 left-4 w-8 h-8 border border-white rounded-full"></div>
                                            <div className="absolute bottom-4 right-4 w-10 h-10 border border-white rounded-full"></div>
                                        </div>
                                        
                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="text-2xl font-bold animate-fade-in-down">
                                                    {language === 'ar' ? 'ملتقى الابتكار' : 'Innovation Forum'}
                                                </h3>
                                                <div className="card-icon text-3xl animate-bounce">
                                                    🎤
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                <div className="feature-item flex items-center space-x-3 rtl:space-x-reverse animate-fade-in-left animate-delay-200">
                                                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                                    <span className="font-medium">{language === 'ar' ? 'مؤسسات حكومية وخاصة' : 'Government & Private Institutions'}</span>
                                                </div>
                                                <div className="feature-item flex items-center space-x-3 rtl:space-x-reverse animate-fade-in-left animate-delay-300">
                                                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                                    <span className="font-medium">{language === 'ar' ? 'تحفيز العقول الشابة' : 'Stimulating Young Minds'}</span>
                                                </div>
                                                <div className="feature-item flex items-center space-x-3 rtl:space-x-reverse animate-fade-in-left animate-delay-400">
                                                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                                    <span className="font-medium">{language === 'ar' ? 'تحويل الأفكار إلى مشاريع' : 'Transforming Ideas into Projects'}</span>
                                                </div>
                                            </div>
                                            
                                            {/* Progress Bar */}
                                            <div className="mt-6 bg-white/20 rounded-full h-2 overflow-hidden">
                                                <div className="bg-white h-full rounded-full animate-pulse" style={{width: '90%'}}></div>
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
            <section className="py-20 text-white relative scroll-animate rounded-3xl mx-4 mb-4">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-down gradient-text">
                        {language === 'ar' ? 'انضم إلى رحلة الابتكار' : 'Join the Innovation Journey'}
                    </h2>
                    <p className="text-xl mb-8 animate-fade-in-up animate-delay-200" style={{color: '#F4A321'}}>
                        {language === 'ar' 
                            ? 'فرصة مثالية لإبراز الإبداع، تعزيز العمل الجماعي، وتحويل الأفكار إلى مشاريع قابلة للتطبيق'
                            : 'Perfect opportunity to showcase creativity, enhance teamwork, and transform ideas into practical projects'
                        }
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-400">
                        {isAuthenticated ? (
                            <>
                                {/* Dashboard link hidden */}
                                {(() => {
                                    const registrationToTrack = getRegistrationToTrack();
                                    return (
                                        <Link
                                            to={registrationToTrack ? registrationToTrack.url : "/hackathon"}
                                            className="ripple-effect button-press bg-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover-float"
                                            style={{color: '#003C72'}}
                                        >
                                            {registrationToTrack 
                                                ? registrationToTrack.text
                                                : (language === 'ar' ? 'سجل في الهاكثون' : 'Register for Hackathon')
                                            }
                                        </Link>
                                    );
                                })()}
                                {(() => {
                                    const workshopStatus = getWorkshopRegistrationStatus();
                                    return (
                                        <Link
                                            to={workshopStatus.url}
                                            className="ripple-effect button-press bg-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover-float"
                                            style={{color: '#003C72'}}
                                        >
                                            {workshopStatus.text}
                                        </Link>
                                    );
                                })()}
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/hackathon"
                                    className="ripple-effect button-press text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover-pulse-glow"
                                    style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}
                                >
                                    {language === 'ar' ? 'ابدأ رحلتك الآن' : 'Start Your Journey Now'}
                                </Link>
                                {(() => {
                                    const workshopStatus = getWorkshopRegistrationStatus();
                                    return (
                                        <Link
                                            to={workshopStatus.url}
                                            className="ripple-effect button-press bg-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover-float"
                                            style={{color: '#003C72'}}
                                        >
                                            {workshopStatus.hasRegistration ? workshopStatus.text : (language === 'ar' ? 'تعلم المزيد' : 'Learn More')}
                                        </Link>
                                    );
                                })()}
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
