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
        { path: '/hackathon', label: t('hackathon') },
        { path: '/workshop', label: t('workshop') },
        { path: '/conference', label: t('conference') }
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
                <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-20">
                            {/* Logo with gradient bar design */}
                            <div className="flex items-center">
                                <Link to="/" className="flex-shrink-0" onClick={handleLinkClick}>
                                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                        {/* Logo Image */}
                                        <div className="w-56 h-32 lg:w-64 lg:h-36 flex items-center justify-center">
                                            <img 
                                                src="/images/logo_horizontal_colored.png" 
                                                alt={language === 'ar' ? 'ملتقى الابتكار' : 'Innovation Forum'} 
                                                className="h-full w-full object-contain hover-float"
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            
                            {/* Desktop Navigation */}
                            <div className="hidden lg:flex items-center space-x-2 rtl:space-x-reverse">
                                {navigationItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={handleLinkClick}
                                        className={`px-5 py-3 rounded-2xl text-sm font-semibold transition-colors duration-200 ${
                                            isActive(item.path) 
                                                ? 'text-white' 
                                                : 'text-gray-700 hover:text-orange-600 hover:bg-gray-100'
                                        }`}
                                        style={isActive(item.path) ? {background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'} : {}}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                
                                <div className="mx-4 h-8 w-px bg-gray-300"></div>
                                
                                {/* User Section */}
                                {user && (
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
                                )}
                                
                                <button
                                    onClick={toggleLanguage}
                                    className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-200"
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
                        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
                            <div className="px-4 pt-4 pb-6 space-y-2 bg-white rounded-lg mt-4 mb-4 shadow-lg border border-gray-200">
                                {navigationItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={handleLinkClick}
                                        className={`flex items-center px-5 py-4 rounded-lg text-base font-semibold transition-colors duration-200 ${
                                            isActive(item.path) 
                                                ? 'text-white' 
                                                : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
                                        }`}
                                        style={isActive(item.path) ? {background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'} : {}}
                                    >
                                        <div className={`w-2 h-2 rounded-full mr-3 rtl:mr-0 rtl:ml-3 ${
                                            isActive(item.path) ? 'bg-white' : 'bg-orange-500'
                                        }`}></div>
                                        {item.label}
                                    </Link>
                                ))}
                                
                                {/* User Info in Mobile Menu */}
                                {user && (
                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 bg-gray-50 rounded-lg">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{background: 'linear-gradient(135deg, #F4A321 0%, #D85584 100%)'}}>
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.role === 'admin' ? 'مدير' : 'مستخدم'}</div>
                                            </div>
                                            <button
                                                onClick={handleLogout}
                                                className="px-3 py-1 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                                            >
                                                خروج
                                            </button>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="pt-4 border-t border-gray-200">
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