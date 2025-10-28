import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { initScrollAnimations } from '../utils/scrollAnimations';

const ConferenceInfo = () => {
    const { t, language } = useLanguage();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const observer = initScrollAnimations();
        return () => {
            if (observer) observer.disconnect();
        };
    }, [language]);

    const conferenceData = {
        title: language === 'ar' ? 'ملتقى الابتكار 2025' : 'Innovation Forum 2025',
        subtitle: language === 'ar' ? 'المؤتمر الصحفي - النسخة الثالثة' : 'Press Conference - Third Edition',
        description: language === 'ar'
            ? 'في إطار جهود تعزيز بيئة الابتكار وريادة الأعمال في سلطنة عُمان، تنطلق النسخة الثالثة من ملتقى الابتكار كأحد أهم الفعاليات الوطنية التي تجمع نخبة من المؤسسات الحكومية والخاصة والأكاديمية، تحت مظلة واحدة تسعى إلى تحفيز العقول الشابة وتحويل الأفكار الإبداعية إلى مشاريع واقعية.'
            : 'As part of efforts to enhance the innovation and entrepreneurship environment in the Sultanate of Oman, the third edition of the Innovation Forum launches as one of the most important national events that brings together elite government, private and academic institutions under one umbrella that seeks to stimulate young minds and transform creative ideas into real projects.',
        features: language === 'ar' 
            ? [
                { title: 'مؤسسات حكومية وخاصة', description: 'مشاركة نخبة من المؤسسات الرائدة', icon: '🏛️' },
                { title: 'تحفيز العقول الشابة', description: 'تطوير قدرات الشباب في الابتكار', icon: '🧠' },
                { title: 'تحويل الأفكار إلى مشاريع', description: 'تحويل الأفكار الإبداعية إلى واقع', icon: '💡' },
                { title: 'دعم الابتكار', description: 'خلق بيئة داعمة للابتكار', icon: '🚀' }
            ]
            : [
                { title: 'Government & Private Institutions', description: 'Participation of elite leading institutions', icon: '🏛️' },
                { title: 'Stimulating Young Minds', description: 'Developing youth capabilities in innovation', icon: '🧠' },
                { title: 'Transforming Ideas into Projects', description: 'Turning creative ideas into reality', icon: '💡' },
                { title: 'Innovation Support', description: 'Creating an innovation-supportive environment', icon: '🚀' }
            ],
        speakers: language === 'ar' 
            ? [
                {
                    name: 'د. أحمد الشنفري',
                    title: 'وزير التكنولوجيا والابتكار',
                    organization: 'وزارة التكنولوجيا والابتكار',
                    bio: 'خبير في مجال التكنولوجيا والابتكار مع خبرة تزيد عن 20 عاماً',
                    image: '/images/speaker1.jpg'
                },
                {
                    name: 'أ. فاطمة العلي',
                    title: 'رئيسة قطاع الابتكار',
                    organization: 'شركة النفط العمانية',
                    bio: 'رائدة في مجال الابتكار المؤسسي والتحول الرقمي',
                    image: '/images/speaker2.jpg'
                },
                {
                    name: 'د. محمد الكندي',
                    title: 'مدير مركز الابتكار',
                    organization: 'جامعة السلطان قابوس',
                    bio: 'أكاديمي وباحث في مجال الذكاء الاصطناعي والابتكار',
                    image: '/images/speaker3.jpg'
                },
                {
                    name: 'أ. سارة الهنائية',
                    title: 'مؤسسة شركة ناشئة',
                    organization: 'شركة تكنولوجيا ناشئة',
                    bio: 'رائدة أعمال شابة ومؤسسة لعدة مشاريع تقنية ناجحة',
                    image: '/images/speaker4.jpg'
                }
            ]
            : [
                {
                    name: 'Dr. Ahmed Al-Shanfari',
                    title: 'Minister of Technology and Innovation',
                    organization: 'Ministry of Technology and Innovation',
                    bio: 'Expert in technology and innovation with over 20 years of experience',
                    image: '/images/speaker1.jpg'
                },
                {
                    name: 'Ms. Fatima Al-Ali',
                    title: 'Head of Innovation Sector',
                    organization: 'Oman Oil Company',
                    bio: 'Pioneer in institutional innovation and digital transformation',
                    image: '/images/speaker2.jpg'
                },
                {
                    name: 'Dr. Mohammed Al-Kindi',
                    title: 'Director of Innovation Center',
                    organization: 'Sultan Qaboos University',
                    bio: 'Academic and researcher in artificial intelligence and innovation',
                    image: '/images/speaker3.jpg'
                },
                {
                    name: 'Ms. Sarah Al-Hinai',
                    title: 'Startup Founder',
                    organization: 'Tech Startup Company',
                    bio: 'Young entrepreneur and founder of several successful tech projects',
                    image: '/images/speaker4.jpg'
                }
            ],
        agenda: language === 'ar' 
            ? [
                { time: '08:00 - 09:00', activity: 'التسجيل والترحيب', description: 'استقبال المشاركين وتوزيع المواد' },
                { time: '09:00 - 09:30', activity: 'كلمة الافتتاح', description: 'كلمة ترحيبية من المنظمين' },
                { time: '09:30 - 10:30', activity: 'الجلسة الأولى: مستقبل الابتكار', description: 'نقاش حول مستقبل الابتكار في سلطنة عُمان' },
                { time: '10:30 - 11:00', activity: 'استراحة', description: 'استراحة قصيرة وتجديد النشاط' },
                { time: '11:00 - 12:00', activity: 'الجلسة الثانية: التكنولوجيا والتحول الرقمي', description: 'دور التكنولوجيا في التحول الرقمي' },
                { time: '12:00 - 13:00', activity: 'الجلسة الثالثة: ريادة الأعمال', description: 'تطوير بيئة ريادة الأعمال في السلطنة' },
                { time: '13:00 - 14:00', activity: 'غداء', description: 'وجبة غداء للمشاركين' },
                { time: '14:00 - 15:00', activity: 'الجلسة الرابعة: الذكاء الاصطناعي', description: 'تطبيقات الذكاء الاصطناعي في الابتكار' },
                { time: '15:00 - 16:00', activity: 'الجلسة الخامسة: الشباب والابتكار', description: 'دور الشباب في دفع عجلة الابتكار' },
                { time: '16:00 - 16:30', activity: 'الختام والتوصيات', description: 'تلخيص النتائج والتوصيات' }
            ]
            : [
                { time: '08:00 - 09:00', activity: 'Registration & Welcome', description: 'Participant reception and material distribution' },
                { time: '09:00 - 09:30', activity: 'Opening Speech', description: 'Welcome speech from organizers' },
                { time: '09:30 - 10:30', activity: 'Session 1: Future of Innovation', description: 'Discussion about the future of innovation in Oman' },
                { time: '10:30 - 11:00', activity: 'Break', description: 'Short break and refreshment' },
                { time: '11:00 - 12:00', activity: 'Session 2: Technology & Digital Transformation', description: 'Role of technology in digital transformation' },
                { time: '12:00 - 13:00', activity: 'Session 3: Entrepreneurship', description: 'Developing entrepreneurship environment in the Sultanate' },
                { time: '13:00 - 14:00', activity: 'Lunch', description: 'Lunch for participants' },
                { time: '14:00 - 15:00', activity: 'Session 4: Artificial Intelligence', description: 'AI applications in innovation' },
                { time: '15:00 - 16:00', activity: 'Session 5: Youth & Innovation', description: 'Role of youth in driving innovation' },
                { time: '16:00 - 16:30', activity: 'Closing & Recommendations', description: 'Summary of results and recommendations' }
            ],
        benefits: language === 'ar' 
            ? [
                'التواصل مع الخبراء والمختصين',
                'التعرف على أحدث الاتجاهات في الابتكار',
                'بناء شبكة علاقات مهنية',
                'الحصول على شهادة مشاركة',
                'فرص للتعاون والشراكة',
                'التعرف على الفرص الاستثمارية'
            ]
            : [
                'Network with experts and specialists',
                'Learn about latest innovation trends',
                'Build professional network',
                'Receive participation certificate',
                'Opportunities for collaboration and partnership',
                'Discover investment opportunities'
            ],
        requirements: language === 'ar' 
            ? [
                'الاهتمام بمجال الابتكار والتكنولوجيا',
                'الرغبة في التعلم والتطوير',
                'العمل في القطاع الحكومي أو الخاص',
                'البحث عن فرص للتعاون',
                'الرغبة في المساهمة في التنمية',
                'الالتزام بحضور الفعالية كاملة'
            ]
            : [
                'Interest in innovation and technology field',
                'Desire to learn and develop',
                'Working in government or private sector',
                'Looking for collaboration opportunities',
                'Willingness to contribute to development',
                'Commitment to attend the full event'
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
                        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-green-500 to-teal-500 rounded-full mb-6 animate-bounce">
                            <span className="text-3xl sm:text-4xl lg:text-5xl">🎤</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 animate-fade-in-down">
                            {conferenceData.title}
                        </h1>
                        <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 animate-fade-in-up animate-delay-200">
                            {conferenceData.subtitle}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-400">
                            <Link
                                to="/conference"
                                className="ripple-effect button-press text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                style={{background: 'linear-gradient(135deg, #003C72 0%, #096289 100%)'}}
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
                            {language === 'ar' ? 'عن المؤتمر' : 'About the Conference'}
                        </h2>
                        <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
                            {conferenceData.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12 sm:py-16 lg:py-20 relative scroll-animate">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">
                        {language === 'ar' ? 'المميزات الرئيسية' : 'Key Features'}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {conferenceData.features.map((feature, index) => (
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

            {/* Speakers Section */}
            <section className="py-12 sm:py-16 lg:py-20 relative scroll-animate bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">
                        {language === 'ar' ? 'المتحدثون' : 'Speakers'}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {conferenceData.speakers.map((speaker, index) => (
                            <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up" style={{animationDelay: `${index * 100}ms`}}>
                                <div className="text-center">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                                        <span className="text-2xl sm:text-3xl">👤</span>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{speaker.name}</h3>
                                    <p className="text-sm sm:text-base text-blue-600 font-semibold mb-1">{speaker.title}</p>
                                    <p className="text-xs sm:text-sm text-gray-500 mb-3">{speaker.organization}</p>
                                    <p className="text-xs sm:text-sm text-gray-600">{speaker.bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Agenda Section */}
            <section className="py-12 sm:py-16 lg:py-20 relative scroll-animate">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">
                        {language === 'ar' ? 'جدول الأعمال' : 'Agenda'}
                    </h2>
                    <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl">
                        <div className="space-y-4 sm:space-y-6">
                            {conferenceData.agenda.map((item, index) => (
                                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition-all duration-300 animate-fade-in-up" style={{animationDelay: `${index * 100}ms`}}>
                                    <div className="flex-shrink-0 mb-3 sm:mb-0 sm:mr-6 rtl:sm:mr-0 rtl:sm:ml-6">
                                        <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
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

            {/* Benefits Section */}
            <section className="py-12 sm:py-16 lg:py-20 relative scroll-animate bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">
                        {language === 'ar' ? 'الفوائد' : 'Benefits'}
                    </h2>
                    <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {conferenceData.benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:shadow-md transition-all duration-300 animate-fade-in-up" style={{animationDelay: `${index * 100}ms`}}>
                                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 rtl:mr-0 rtl:ml-3">
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

            {/* Requirements Section */}
            <section className="py-12 sm:py-16 lg:py-20 relative scroll-animate">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">
                        {language === 'ar' ? 'المتطلبات' : 'Requirements'}
                    </h2>
                    <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {conferenceData.requirements.map((requirement, index) => (
                                <div key={index} className="flex items-center p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl hover:shadow-md transition-all duration-300 animate-fade-in-up" style={{animationDelay: `${index * 100}ms`}}>
                                    <div className="flex-shrink-0 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center mr-3 rtl:mr-0 rtl:ml-3">
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
            <section className="py-12 sm:py-16 lg:py-20 text-white relative scroll-animate rounded-2xl sm:rounded-3xl mx-2 sm:mx-4 mb-2 sm:mb-4" style={{background: 'linear-gradient(135deg, #003C72 0%, #096289 100%)'}}>
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative max-w-4xl mx-auto text-center px-3 sm:px-4 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 animate-fade-in-down">
                        {language === 'ar' ? 'انضم إلى المؤتمر الآن' : 'Join the Conference Now'}
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 animate-fade-in-up animate-delay-200">
                        {language === 'ar' 
                            ? 'لا تفوت فرصة المشاركة في هذا المؤتمر المميز والاستفادة من الخبرات والفرص المتاحة'
                            : 'Don\'t miss the opportunity to participate in this special conference and benefit from the available expertise and opportunities'
                        }
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in-up animate-delay-400">
                        <Link
                            to="/conference"
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

export default ConferenceInfo;
