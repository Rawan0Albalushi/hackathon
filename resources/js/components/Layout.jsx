import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import ScrollToTop from './ScrollToTop';

const Layout = ({ children }) => {
    const { language, toggleLanguage, t } = useLanguage();
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

    const handleLinkClick = () => {
        closeMobileMenu();
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    };

    const navigationItems = [
        { path: '/', label: t('home') },
        { path: '/hackathon', label: t('hackathon') },
        { path: '/workshop', label: t('workshop') },
        { path: '/conference', label: t('conference') },
        { path: '/admin', label: t('adminDashboard') }
    ];

    return (
        <div className="min-h-screen">
            <ScrollToTop />
            {/* Modern Navigation - Hidden for Admin */}
            {!location.pathname.startsWith('/admin') && (
                <nav className="bg-white/95 backdrop-blur-md shadow-xl sticky top-0 z-50 border-b border-gray-200/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-20">
                            {/* Logo with gradient */}
                            <div className="flex items-center">
                                <Link to="/" className="flex-shrink-0 group" onClick={handleLinkClick}>
                                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                                            <span className="text-white font-bold text-xl">I</span>
                                        </div>
                                        <div>
                                            <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                                {language === 'ar' ? 'ملتقى الابتكار 2025' : 'Innovation Forum 2025'}
                                            </h1>
                                            <p className="text-xs text-gray-500 font-medium">
                                                {language === 'ar' ? 'منصة إبداعية' : 'Creative Platform'}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            
                            {/* Desktop Navigation */}
                            <div className="hidden lg:flex items-center space-x-1 rtl:space-x-reverse">
                                {navigationItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={handleLinkClick}
                                        className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                                            isActive(item.path) 
                                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                                                : 'text-gray-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50'
                                        }`}
                                    >
                                        {item.label}
                                        {isActive(item.path) && (
                                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                                        )}
                                    </Link>
                                ))}
                                
                                <div className="mx-2 h-6 w-px bg-gray-300"></div>
                                
                                <button
                                    onClick={toggleLanguage}
                                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
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
                                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
                                                : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                
                                <button
                                    onClick={toggleLanguage}
                                    className="px-3 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
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
                                    className="px-3 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
                                >
                                    {language === 'ar' ? 'EN' : 'عربي'}
                                </button>
                                
                                <button
                                    onClick={toggleMobileMenu}
                                    className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
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
                        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden transition-all duration-300 ease-in-out`}>
                            <div className="px-4 pt-4 pb-6 space-y-2 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-2xl mt-4 mb-4 shadow-lg border border-gray-200/50">
                                {navigationItems.map((item, index) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={handleLinkClick}
                                        className={`flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 transform hover:scale-105 ${
                                            isActive(item.path) 
                                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                                                : 'text-gray-700 hover:text-indigo-600 hover:bg-white hover:shadow-md'
                                        }`}
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className={`w-2 h-2 rounded-full mr-3 rtl:mr-0 rtl:ml-3 ${
                                            isActive(item.path) ? 'bg-white' : 'bg-indigo-500'
                                        }`}></div>
                                        {item.label}
                                    </Link>
                                ))}
                                
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