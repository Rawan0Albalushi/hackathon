import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import ScrollToTop from './ScrollToTop';

const Layout = ({ children }) => {
    const { language, toggleLanguage, t } = useLanguage();
    const { user, logout, isAdmin } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path) => {
        return location.pathname === path;
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const handleLinkClick = () => {
        closeMobileMenu();
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    };

    const handleLogout = async () => {
        await logout();
        // Redirect to home page after logout
        navigate('/');
    };

    useEffect(() => {
        // Add page transition effect
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.classList.add('page-transition-enter');
            setTimeout(() => {
                mainContent.classList.add('page-transition-enter-active');
                mainContent.classList.remove('page-transition-enter');
            }, 10);
        }
    }, [location.pathname]);

    const navigationItems = [
        { path: '/', label: t('home') },
        { path: '/hackathon-info', label: t('hackathon') },
        { path: '/workshop-info', label: t('workshop') },
        { path: '/conference-info', label: t('conference') }
    ];

    // Admin portal hidden from navigation
    // if (isAdmin()) {
    //     navigationItems.push({ path: '/admin-portal', label: 'لوحة الإدارة' });
    // }

    return (
        <div className="min-h-screen">
            <ScrollToTop />
            {/* Modern Navigation - Hidden for Admin */}
            {!location.pathname.startsWith('/admin') && (
                <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200/50 relative overflow-hidden">
                    {/* Occasional Pattern Background */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none">
                        <img 
                            src="/images/Occasional pattern.png" 
                            alt="Pattern" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    
                    {/* Decorative Pattern Elements */}
                    <div className="absolute top-0 right-0 w-32 h-20 opacity-10 pointer-events-none">
                        <img 
                            src="/images/Occasional pattern.png" 
                            alt="Pattern" 
                            className="w-full h-full object-cover transform rotate-12"
                        />
                    </div>
                    <div className="absolute bottom-0 left-0 w-24 h-16 opacity-8 pointer-events-none">
                        <img 
                            src="/images/Occasional pattern.png" 
                            alt="Pattern" 
                            className="w-full h-full object-cover transform -rotate-12"
                        />
                    </div>
                    
                    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 relative z-10">
                        <div className="flex justify-between items-center h-16 sm:h-20">
                            {/* Logo with gradient bar design - Positioned at start */}
                            <div className="flex items-center relative flex-shrink-0">
                                {/* Decorative Pattern behind Logo */}
                                <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-16 h-12 opacity-15 pointer-events-none">
                                    <img 
                                        src="/images/Occasional pattern.png" 
                                        alt="Pattern" 
                                        className="w-full h-full object-cover transform rotate-45"
                                    />
                                </div>
                                
                                <Link to="/" className="relative z-10" onClick={handleLinkClick}>
                                    <div className="flex items-center">
                                        {/* Logo Image - Responsive */}
                                        <div className="w-40 h-20 sm:w-48 sm:h-24 md:w-56 md:h-28 lg:w-64 lg:h-36 flex items-center justify-center relative">
                                            {/* Subtle pattern overlay on logo */}
                                            <div className="absolute inset-0 opacity-5 pointer-events-none">
                                                <img 
                                                    src="/images/Occasional pattern.png" 
                                                    alt="Pattern" 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <img 
                                                src="/images/logo_horizontal_colored.png" 
                                                alt={language === 'ar' ? 'ملتقى الابتكار' : 'Innovation Forum'} 
                                                className="h-full w-full object-contain hover-float relative z-10"
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            
                            {/* Desktop Navigation */}
                            <div className="hidden lg:flex items-center space-x-2 rtl:space-x-reverse relative">
                                {/* Decorative Pattern behind Navigation */}
                                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 w-20 h-16 opacity-8 pointer-events-none">
                                    <img 
                                        src="/images/Occasional pattern.png" 
                                        alt="Pattern" 
                                        className="w-full h-full object-cover transform -rotate-30"
                                    />
                                </div>
                                
                                {navigationItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={handleLinkClick}
                                        className={`px-5 py-3 rounded-2xl text-sm font-semibold transition-colors duration-200 relative overflow-hidden ${
                                            isActive(item.path) 
                                                ? 'text-white' 
                                                : 'text-gray-700 hover:text-orange-600 hover:bg-gray-100'
                                        }`}
                                        style={isActive(item.path) ? {background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'} : {}}
                                    >
                                        {/* Subtle pattern overlay for active items */}
                                        {isActive(item.path) && (
                                            <div className="absolute inset-0 opacity-10 pointer-events-none">
                                                <img 
                                                    src="/images/Occasional pattern.png" 
                                                    alt="Pattern" 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <span className="relative z-10">{item.label}</span>
                                    </Link>
                                ))}
                                
                                <div className="mx-4 h-8 w-px bg-gray-300"></div>
                                
                                {/* User Section */}
                                {user ? (
                                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                        {/* User Profile */}
                                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md" 
                                                 style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}>
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="text-sm">
                                                <div className="font-semibold text-gray-900">
                                                    {user.name}
                                                </div>
                                                <div className="text-xs text-gray-500 font-medium">
                                                    {user.role === 'admin' ? 'مدير' : 'مستخدم'}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Logout Button */}
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            <span>خروج</span>
                                        </button>
                                    </div>
                                ) : (
                                    /* Login Button */
                                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                        <Link
                                            to="/login"
                                            className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                            </svg>
                                            <span>{language === 'ar' ? 'تسجيل الدخول' : 'Login'}</span>
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-200"
                                            style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}
                                        >
                                            {language === 'ar' ? 'إنشاء حساب' : 'Register'}
                                        </Link>
                                    </div>
                                )}
                                
                                {/* Language Toggle Button with more spacing */}
                                <div className="ml-6 rtl:ml-0 rtl:mr-6">
                                    <button
                                        onClick={toggleLanguage}
                                        className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-200"
                                        style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}
                                    >
                                        {language === 'ar' ? 'EN' : 'عربي'}
                                    </button>
                                </div>
                            </div>

                            {/* Tablet Navigation */}
                            <div className="hidden md:flex lg:hidden items-center space-x-2 rtl:space-x-reverse">
                                {navigationItems.slice(0, 2).map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={handleLinkClick}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                            isActive(item.path) 
                                                ? 'text-white' 
                                                : 'text-gray-700 hover:text-orange-600 hover:bg-gray-100'
                                        }`}
                                        style={isActive(item.path) ? {background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'} : {}}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                
                                <div className="ml-4 rtl:ml-0 rtl:mr-4">
                                    <button
                                        onClick={toggleLanguage}
                                        className="px-3 py-2 rounded-lg text-sm font-medium text-white transition-all duration-300"
                                        style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}
                                    >
                                        {language === 'ar' ? 'EN' : 'عربي'}
                                    </button>
                                </div>
                                
                                <button
                                    onClick={toggleMobileMenu}
                                    className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-gray-100 transition-all duration-300"
                                >
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>

                            {/* Mobile menu button - Enhanced */}
                            <div className="md:hidden flex items-center space-x-2 rtl:space-x-reverse">
                                {/* Mobile Menu Toggle Button - Smaller for mobile */}
                                <button
                                    onClick={toggleMobileMenu}
                                    className="relative inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-orange-600 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 transition-all duration-300 active:scale-95"
                                    aria-expanded={isMobileMenuOpen}
                                    aria-label={language === 'ar' ? 'فتح القائمة الرئيسية' : 'Open main menu'}
                                >
                                    {/* Animated Hamburger Icon - Smaller */}
                                    <div className="relative w-5 h-5">
                                        <span className={`absolute top-0.5 left-0 w-5 h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : 'rotate-0 translate-y-0'}`}></span>
                                        <span className={`absolute top-2 left-0 w-5 h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                                        <span className={`absolute top-3.5 left-0 w-5 h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : 'rotate-0 translate-y-0'}`}></span>
                                    </div>
                                </button>
                                
                                {/* Language Toggle Button - Smaller for mobile */}
                                <button
                                    onClick={toggleLanguage}
                                    className="px-2 py-1.5 rounded-lg text-xs font-bold text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 active:scale-95"
                                    style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}
                                >
                                    {language === 'ar' ? 'EN' : 'عربي'}
                                </button>
                            </div>
                        </div>

                            {/* Mobile Navigation Menu - Enhanced */}
                        <div className={`${isMobileMenuOpen ? 'block animate-fadeInDown' : 'hidden'} md:hidden transition-all duration-300`}>
                            <div className="px-3 pt-4 pb-6 space-y-2 bg-white rounded-xl mt-4 mb-4 shadow-xl border border-gray-100 relative overflow-hidden backdrop-blur-sm">
                                {/* Enhanced Pattern Background */}
                                <div className="absolute inset-0 opacity-5 pointer-events-none">
                                    <img 
                                        src="/images/Occasional pattern.png" 
                                        alt="Pattern" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                
                                {/* Decorative Pattern Elements - Enhanced */}
                                <div className="absolute top-0 right-0 w-20 h-16 opacity-10 pointer-events-none">
                                    <img 
                                        src="/images/Occasional pattern.png" 
                                        alt="Pattern" 
                                        className="w-full h-full object-cover transform rotate-45"
                                    />
                                </div>
                                <div className="absolute bottom-0 left-0 w-16 h-12 opacity-8 pointer-events-none">
                                    <img 
                                        src="/images/Occasional pattern.png" 
                                        alt="Pattern" 
                                        className="w-full h-full object-cover transform -rotate-45"
                                    />
                                </div>
                                
                                {/* Mobile Menu Header */}
                                <div className="text-center pb-3 border-b border-gray-100 relative z-10">
                                    <h3 className="text-base font-bold text-gray-800">
                                        {language === 'ar' ? 'القائمة الرئيسية' : 'Main Menu'}
                                    </h3>
                                </div>
                                {/* Navigation Items - Enhanced */}
                                <div className="space-y-2">
                                    {navigationItems.map((item, index) => (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={handleLinkClick}
                                            className={`group flex items-center px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 relative z-10 transform hover:scale-105 active:scale-95 ${
                                                isActive(item.path) 
                                                    ? 'text-white shadow-md' 
                                                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50 hover:shadow-sm'
                                            }`}
                                            style={isActive(item.path) ? {background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'} : {}}
                                        >
                                            {/* Enhanced Indicator */}
                                            <div className={`w-2.5 h-2.5 rounded-full mr-3 rtl:mr-0 rtl:ml-3 transition-all duration-300 ${
                                                isActive(item.path) ? 'bg-white shadow-sm' : 'bg-orange-500 group-hover:bg-orange-600'
                                            }`}></div>
                                            
                                            {/* Menu Item Text */}
                                            <span className="flex-1">{item.label}</span>
                                            
                                            {/* Arrow Icon */}
                                            <svg className={`w-4 h-4 transition-transform duration-300 ${
                                                isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-orange-500'
                                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    ))}
                                </div>
                                
                                {/* User Info in Mobile Menu - Enhanced */}
                                {user ? (
                                    <div className="pt-4 border-t border-gray-200 relative z-10">
                                        <div className="bg-gradient-to-r from-gray-50 to-orange-50 rounded-xl p-3 shadow-sm">
                                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                                {/* Enhanced User Avatar */}
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white" style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}>
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-bold text-gray-900 text-base">{user.name}</div>
                                                    <div className="text-xs text-gray-600 font-medium">
                                                        {user.role === 'admin' ? '👑 مدير النظام' : '👤 مستخدم عادي'}
                                                    </div>
                                                </div>
                                                {/* Enhanced Logout Button */}
                                                <button
                                                    onClick={handleLogout}
                                                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500 text-white hover:bg-red-600 hover:shadow-md transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center space-x-1 rtl:space-x-reverse"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    <span>خروج</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Login/Register Buttons in Mobile Menu - Enhanced */
                                    <div className="pt-4 border-t border-gray-200 relative z-10">
                                        <div className="space-y-3">
                                            {/* Login Button */}
                                            <Link
                                                to="/login"
                                                onClick={handleLinkClick}
                                                className="group flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-orange-50 hover:to-orange-100 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-orange-100 group-hover:bg-orange-200 flex items-center justify-center transition-colors duration-300">
                                                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-bold text-gray-900 text-sm">{language === 'ar' ? 'تسجيل الدخول' : 'Login'}</div>
                                                    <div className="text-xs text-gray-600">{language === 'ar' ? 'ادخل إلى حسابك' : 'Access your account'}</div>
                                                </div>
                                                <svg className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                            
                                            {/* Register Button */}
                                            <Link
                                                to="/register"
                                                onClick={handleLinkClick}
                                                className="group flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 text-white rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                                                style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}
                                            >
                                                <div className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-colors duration-300">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-bold text-sm">{language === 'ar' ? 'إنشاء حساب' : 'Register'}</div>
                                                    <div className="text-xs text-white/80">{language === 'ar' ? 'انضم إلينا الآن' : 'Join us now'}</div>
                                                </div>
                                                <svg className="w-4 h-4 text-white/80 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Mobile Menu Footer - Enhanced */}
                                <div className="pt-4 border-t border-gray-200 relative z-10">
                                    <div className="text-center">
                                        <div className="text-xs text-gray-600 font-semibold mb-1">
                                            {language === 'ar' ? 'منصة إبداعية للابتكار' : 'Creative Innovation Platform'}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {language === 'ar' ? 'نحو مستقبل رقمي أفضل' : 'Towards a Better Digital Future'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            )}

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer - Hidden for Admin */}
            {!location.pathname.startsWith('/admin') && (
                <footer className="bg-gray-800 text-white py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <p className="text-gray-300">
                                {language === 'ar' 
                                    ? '2025 منصة مكسب - Maksab Platform' 
                                    : '2025 Maksab Platform'
                                }
                            </p>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

export default Layout;