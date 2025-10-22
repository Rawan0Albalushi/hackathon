import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

const translations = {
    en: {
        // Navigation
        home: 'Home',
        hackathon: 'Hackathon',
        workshop: 'Workshop',
        conference: 'Conference',
        language: 'Language',
        
        // Home Page
        welcomeTitle: 'Welcome to Tech Event Registration',
        welcomeSubtitle: 'Join our exciting tech events and expand your knowledge',
        registerHackathon: 'Register for Hackathon',
        registerWorkshop: 'Register for Workshop',
        registerConference: 'Register for Conference',
        
        // Forms
        fullName: 'Full Name',
        email: 'Email',
        phone: 'Phone Number',
        age: 'Age',
        city: 'City/Province',
        background: 'Background/Specialization',
        skills: 'Skills',
        projectIdea: 'Project Idea (Optional)',
        reason: 'Reason for attending (Optional)',
        organization: 'Organization/Institution (Optional)',
        sessionChoice: 'Session Choice',
        submit: 'Submit Registration',
        
        // Skills options
        programming: 'Programming',
        design: 'Design',
        dataAnalysis: 'Data Analysis',
        marketing: 'Marketing',
        projectManagement: 'Project Management',
        
        // Session choices
        firstSession: 'First Session',
        secondSession: 'Second Session',
        bothSessions: 'Both Sessions',
        
        // Success messages
        registrationSuccess: 'Registration Successful!',
        registrationSuccessMessage: 'Thank you for registering. We will contact you soon.',
        backToHome: 'Back to Home',
        
        // Validation messages
        required: 'This field is required',
        invalidEmail: 'Please enter a valid email address',
        invalidPhone: 'Please enter a valid phone number',
        minAge: 'Minimum age is 16',
        maxAge: 'Maximum age is 100',
        selectSkills: 'Please select at least one skill',
        
        // Error messages
        registrationFailed: 'Registration failed. Please try again.',
        networkError: 'Network error. Please check your connection.',
        
        // Admin Dashboard
        adminDashboard: 'Admin Dashboard',
        manageRegistrations: 'Manage registrations and statistics',
        totalRegistrations: 'Total Registrations',
        todayRegistrations: 'Today\'s Registrations',
        registrations: 'Registrations',
        search: 'Search...',
        allTypes: 'All Types',
        adminName: 'Name',
        adminEmail: 'Email',
        adminType: 'Type',
        adminDate: 'Date',
        adminStatus: 'Status',
        active: 'Active',
        showing: 'Showing',
        to: 'to',
        of: 'of',
        results: 'results',
        previous: 'Previous',
        next: 'Next',
        lastUpdated: 'Last updated:',
    },
    ar: {
        // Navigation
        home: 'الرئيسية',
        hackathon: 'الهاكثون',
        workshop: 'الورشة',
        conference: 'المؤتمر',
        language: 'اللغة',
        
        // Home Page
        welcomeTitle: 'مرحباً بك في تسجيل الفعاليات التقنية',
        welcomeSubtitle: 'انضم إلى فعالياتنا التقنية المثيرة ووسع معرفتك',
        registerHackathon: 'تسجيل في الهاكثون',
        registerWorkshop: 'تسجيل في الورشة',
        registerConference: 'تسجيل في المؤتمر',
        
        // Forms
        fullName: 'الاسم الكامل',
        email: 'البريد الإلكتروني',
        phone: 'رقم الهاتف',
        age: 'العمر',
        city: 'المدينة/المحافظة',
        background: 'الخلفية/التخصص',
        skills: 'المهارات',
        projectIdea: 'فكرة المشروع (اختياري)',
        reason: 'سبب الرغبة في الحضور (اختياري)',
        organization: 'الجهة أو المؤسسة (اختياري)',
        sessionChoice: 'اختيار الجلسة',
        submit: 'إرسال التسجيل',
        
        // Skills options
        programming: 'برمجة',
        design: 'تصميم',
        dataAnalysis: 'تحليل بيانات',
        marketing: 'تسويق',
        projectManagement: 'إدارة مشاريع',
        
        // Session choices
        firstSession: 'الجلسة الأولى',
        secondSession: 'الجلسة الثانية',
        bothSessions: 'كلا الجلستين',
        
        // Success messages
        registrationSuccess: 'تم التسجيل بنجاح!',
        registrationSuccessMessage: 'شكراً لك على التسجيل. سنتواصل معك قريباً.',
        backToHome: 'العودة للرئيسية',
        
        // Validation messages
        required: 'هذا الحقل مطلوب',
        invalidEmail: 'يرجى إدخال بريد إلكتروني صحيح',
        invalidPhone: 'يرجى إدخال رقم هاتف صحيح',
        minAge: 'الحد الأدنى للعمر هو 16',
        maxAge: 'الحد الأقصى للعمر هو 100',
        selectSkills: 'يرجى اختيار مهارة واحدة على الأقل',
        
        // Error messages
        registrationFailed: 'فشل في التسجيل. يرجى المحاولة مرة أخرى.',
        networkError: 'خطأ في الشبكة. يرجى التحقق من اتصالك.',
        
        // Admin Dashboard
        adminDashboard: 'لوحة تحكم الإدمن',
        manageRegistrations: 'إدارة التسجيلات والإحصائيات',
        totalRegistrations: 'إجمالي التسجيلات',
        todayRegistrations: 'تسجيلات اليوم',
        registrations: 'التسجيلات',
        search: 'البحث...',
        allTypes: 'جميع الأنواع',
        adminName: 'الاسم',
        adminEmail: 'البريد الإلكتروني',
        adminType: 'النوع',
        adminDate: 'التاريخ',
        adminStatus: 'الحالة',
        active: 'نشط',
        showing: 'عرض',
        to: 'إلى',
        of: 'من',
        results: 'نتيجة',
        previous: 'السابق',
        next: 'التالي',
        lastUpdated: 'آخر تحديث:',
    }
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('language') || 'ar';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);

    const t = (key) => {
        return translations[language][key] || key;
    };

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export default LanguageProvider;