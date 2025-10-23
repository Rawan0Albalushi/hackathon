import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import ScrollToTop from './ScrollToTop';
import { createRipple } from '../utils/scrollAnimations';

const Layout = ({ children }) => {
    const { language, toggleLanguage, t } = useLanguage();
    const { user, logout, isAdmin } = useAuth();
    const location = useLocation();
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

    const handleLinkClick = (event) => {
        createRipple(event);
        closeMobileMenu();
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    };

    const handleButtonClick = (event) => {
        createRipple(event);
    };

    const handleLogout = async () => {
        await logout();
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
        { path: '/hackathon', label: t('hackathon') },
        { path: '/workshop', label: t('workshop') },
        { path: '/conference', label: t('conference') }
    ];

    // Add admin portal if user is admin
    if (isAdmin()) {
        navigationItems.push({ path: '/admin-portal', label: 'لوحة الإدارة' });
    }

    return (
        <div className="min-h-screen">
            <ScrollToTop />
            {/* Modern Navigation - Hidden for Admin */}
            {!location.pathname.startsWith('/admin') && (
                <nav className="bg-white/95 backdrop-blur-md shadow-xl sticky top-0 z-50 border-b border-gray-200/50 nav-slide-down hover:shadow-2xl transition-all duration-500 nav-glass">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-20">
                            {/* Logo with gradient bar design */}
                            <div className="flex items-center animate-fade-in-left logo-container">
                                <Link to="/" className="flex-shrink-0 group ripple-effect" onClick={handleLinkClick}>
                                    <div className="flex items-center space-x-4 rtl:space-x-reverse group-hover:scale-105 transition-transform duration-300">
                                        {/* Square icon with gradient */}
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg logo-icon-enhanced">
                                            <div className="w-1 h-6 bg-white rounded-full"></div>
                                        </div>
                                        <div>
                                            <h1 className="text-xl lg:text-2xl font-bold logo-title">
                                                {language === 'ar' ? 'ملتقى الابتكار 2025' : 'Innovation Forum 2025'}
                                            </h1>
                                            <p className="text-xs font-medium animate-fade-in-up animate-delay-200 logo-subtitle">
                                                {language === 'ar' ? 'منصة إبداعية' : 'Creative Platform'}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            
                            {/* Desktop Navigation */}
                            <div className="hidden lg:flex items-center space-x-2 rtl:space-x-reverse animate-fade-in-right">
                                {navigationItems.map((item, index) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={handleLinkClick}
                                        className={`ripple-effect relative px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 animate-fade-in-up nav-item-hover nav-link-glow ${
                                            isActive(item.path) 
                                                ? 'text-white shadow-lg hover-pulse-glow hover:shadow-xl' 
                                                : 'text-gray-700 hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 hover-float hover:shadow-md'
                                        }`}
                                        style={isActive(item.path) ? {background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)', animationDelay: `${index * 100}ms`} : {animationDelay: `${index * 100}ms`}}
                                    >
                                        {item.label}
                                        {isActive(item.path) && (
                                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                                        )}
                                    </Link>
                                ))}
                                
                                <div className="mx-4 h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent animate-fade-in-up animate-delay-500"></div>
                                
                                {/* User Info */}
                                {user && (
                                    <>
                                        <div className="flex items-center space-x-2 rtl:space-x-reverse animate-fade-in-up animate-delay-600">
                                            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-sm font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="text-sm">
                                                <div className="font-medium text-gray-900">{user.name}</div>
                                                <div className="text-xs text-gray-500">{user.role === 'admin' ? 'مدير' : 'مستخدم'}</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="ripple-effect px-3 py-1 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-all duration-300 animate-fade-in-up animate-delay-700"
                                        >
                                            خروج
                                        </button>
                                        <div className="mx-2 h-6 w-px bg-gray-300"></div>
                                    </>
                                )}
                                
                                <button
                                    onClick={(e) => {
                                        handleButtonClick(e);
                                        toggleLanguage();
                                    }}
                                    className="ripple-effect button-press px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover-pulse-glow animate-fade-in-up animate-delay-800"
                                    style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}
                                >
                                    {language === 'ar' ? 'EN' : 'عربي'}
                                </button>
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
                                
                                <button
                                    onClick={toggleLanguage}
                                    className="px-3 py-2 rounded-lg text-sm font-medium text-white transition-all duration-300"
                                    style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}
                                >
                                    {language === 'ar' ? 'EN' : 'عربي'}
                                </button>
                                
                                <button
                                    onClick={toggleMobileMenu}
                                    className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-gray-100 transition-all duration-300"
                                >
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>

                            {/* Mobile menu button */}
                            <div className="md:hidden flex items-center space-x-2 rtl:space-x-reverse">
                                <button
                                    onClick={toggleLanguage}
                                    className="px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all duration-300"
                                    style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}
                                >
                                    {language === 'ar' ? 'EN' : 'عربي'}
                                </button>
                                
                                <button
                                    onClick={toggleMobileMenu}
                                    className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-orange-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                                    aria-expanded="false"
                                >
                                    <span className="sr-only">{language === 'ar' ? 'فتح القائمة الرئيسية' : 'Open main menu'}</span>
                                    {/* Hamburger icon */}
                                    <svg className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6 transition-transform duration-300`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                    {/* Close icon */}
                                    <svg className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6 transition-transform duration-300`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                            {/* Mobile Navigation Menu */}
                        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden transition-all duration-300 ease-in-out animate-slide-in-top`}>
                            <div className="px-4 pt-4 pb-6 space-y-2 bg-gradient-to-br from-gray-50 to-orange-50 rounded-3xl mt-4 mb-4 shadow-xl border border-gray-200/50 glass backdrop-blur-lg">
                                {navigationItems.map((item, index) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={handleLinkClick}
                                        className={`ripple-effect flex items-center px-5 py-4 rounded-2xl text-base font-semibold transition-all duration-300 transform hover:scale-105 animate-fade-in-up ${
                                            isActive(item.path) 
                                                ? 'text-white shadow-lg hover-pulse-glow hover:shadow-xl' 
                                                : 'text-gray-700 hover:text-orange-600 hover:bg-white hover:shadow-md hover-float hover:shadow-lg'
                                        }`}
                                        style={isActive(item.path) ? {background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)', animationDelay: `${index * 100}ms`} : {animationDelay: `${index * 100}ms`}}
                                    >
                                        <div className={`w-2 h-2 rounded-full mr-3 rtl:mr-0 rtl:ml-3 animate-pulse ${
                                            isActive(item.path) ? 'bg-white' : 'bg-orange-500'
                                        }`}></div>
                                        {item.label}
                                    </Link>
                                ))}
                                
                                {/* User Info in Mobile Menu */}
                                {user && (
                                    <div className="pt-4 border-t border-gray-200 animate-fade-in-up animate-delay-500">
                                        <div className="flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl">
                                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                                <span className="text-white font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.role === 'admin' ? 'مدير' : 'مستخدم'}</div>
                                            </div>
                                            <button
                                                onClick={handleLogout}
                                                className="px-3 py-1 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-all duration-300"
                                            >
                                                خروج
                                            </button>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="pt-4 border-t border-gray-200 animate-fade-in-up animate-delay-600">
                                    <div className="text-xs text-gray-500 text-center font-medium">
                                        {language === 'ar' ? 'منصة إبداعية للابتكار' : 'Creative Innovation Platform'}
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