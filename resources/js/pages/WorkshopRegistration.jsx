import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import Form from '../components/Form';
import WorkshopStatus from '../components/WorkshopStatus';
import { submitWorkshopRegistration, handleApiErrorWithToast } from '../utils/api';
import { showRegistrationSuccess, showFormLoading, showFormError, showValidationError } from '../utils/messageUtils';

const WorkshopRegistration = () => {
    const { t, language } = useLanguage();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [workshops, setWorkshops] = useState([]);
    const [selectedWorkshops, setSelectedWorkshops] = useState([]);
    const [existingRegistration, setExistingRegistration] = useState(null);
    const [loadingRegistration, setLoadingRegistration] = useState(true);
    const [userRegistrations, setUserRegistrations] = useState([]);
    const [workshopsWithStatus, setWorkshopsWithStatus] = useState([]);

    useEffect(() => {
        fetchWorkshops();
        const workshopId = searchParams.get('workshop_id');
        if (workshopId) {
            setSelectedWorkshops([workshopId]);
        }
    }, [searchParams]);

    // Check for existing registration
    useEffect(() => {
        if (user) {
            fetchExistingRegistration();
        } else {
            setLoadingRegistration(false);
        }
    }, [user]);

    const fetchWorkshops = async () => {
        try {
            const response = await fetch('/api/user/workshops', {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success) {
                setWorkshops(data.data);
                // Also fetch user registrations to get status
                await fetchUserRegistrations();
            }
        } catch (err) {
            console.error('فشل في تحميل الورش');
        }
    };

    const fetchUserRegistrations = async () => {
        try {
            const response = await fetch('/api/user/registrations', {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success && data.data.workshops) {
                setUserRegistrations(data.data.workshops);
                // Combine workshops with registration status
                combineWorkshopsWithStatus(data.data.workshops);
            }
        } catch (error) {
            console.error('Error fetching user registrations:', error);
        }
    };

    const combineWorkshopsWithStatus = (registrations) => {
        const workshopsWithStatus = workshops.map(workshop => {
            const registration = registrations.find(reg => reg.workshop_id == workshop.id);
            return {
                ...workshop,
                registration: registration || null,
                isRegistered: !!registration,
                registrationStatus: registration?.status || null
            };
        });
        setWorkshopsWithStatus(workshopsWithStatus);
    };

    const toggleWorkshopSelection = (workshopId) => {
        // Check if workshop is already registered
        const workshop = workshopsWithStatus.find(w => w.id == workshopId);
        if (workshop && workshop.isRegistered) {
            alert(language === 'ar' 
                ? 'لقد قمت بالتسجيل في هذه الورشة مسبقاً' 
                : 'You have already registered for this workshop');
            return;
        }

        setSelectedWorkshops(prev => {
            if (prev.includes(workshopId)) {
                // إزالة الورشة من القائمة
                return prev.filter(id => id !== workshopId);
            } else {
                // إضافة الورشة إلى القائمة
                return [...prev, workshopId];
            }
        });
    };

    const handleWorkshopChange = (values) => {
        console.log('Workshop selection changed from form:', values);
        setSelectedWorkshops(values);
    };

    // Force update form when selectedWorkshops changes
    React.useEffect(() => {
        console.log('Selected workshops changed, updating form:', selectedWorkshops);
    }, [selectedWorkshops]);

    // Update form data when selectedWorkshops changes
    React.useEffect(() => {
        console.log('Selected workshops updated:', selectedWorkshops);
    }, [selectedWorkshops]);

    // Combine workshops with status when workshops or userRegistrations change
    React.useEffect(() => {
        if (workshops.length > 0 && userRegistrations.length >= 0) {
            combineWorkshopsWithStatus(userRegistrations);
        }
    }, [workshops, userRegistrations]);

    const fetchExistingRegistration = async () => {
        try {
            const response = await fetch('/api/user/registrations', {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success && data.data.workshops && data.data.workshops.length > 0) {
                // Check if there's a registration for the selected workshop
                const workshopId = searchParams.get('workshop_id');
                if (workshopId) {
                    const existingReg = data.data.workshops.find(reg => reg.workshop_id == workshopId);
                    if (existingReg) {
                        setExistingRegistration(existingReg);
                    }
                } else {
                    // If no specific workshop selected, show the first registration
                    setExistingRegistration(data.data.workshops[0]);
                }
            }
        } catch (error) {
            console.error('Error fetching registration:', error);
        } finally {
            setLoadingRegistration(false);
        }
    };

    const handleEditRegistration = () => {
        // Navigate to edit form or show edit modal
        // For now, we'll just reset the existing registration to allow re-registration
        setExistingRegistration(null);
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'pending':
                return {
                    text: language === 'ar' ? 'في الانتظار' : 'Pending',
                    color: 'bg-yellow-100 text-yellow-800',
                    icon: '⏳'
                };
            case 'approved':
                return {
                    text: language === 'ar' ? 'مقبول' : 'Approved',
                    color: 'bg-green-100 text-green-800',
                    icon: '✅'
                };
            case 'rejected':
                return {
                    text: language === 'ar' ? 'مرفوض' : 'Rejected',
                    color: 'bg-red-100 text-red-800',
                    icon: '❌'
                };
            default:
                return {
                    text: language === 'ar' ? 'غير محدد' : 'Unknown',
                    color: 'bg-gray-100 text-gray-800',
                    icon: '❓'
                };
        }
    };

    const fields = [
        {
            name: 'workshop_ids',
            label: language === 'ar' ? 'الورش المختارة للتسجيل' : 'Selected Workshops for Registration',
            type: 'checkbox-group',
            required: true,
            options: workshopsWithStatus
                .filter(workshop => !workshop.isRegistered)
                .map(workshop => ({
                    value: workshop.id,
                    label: workshop.title
                })),
            value: selectedWorkshops,
            onChange: handleWorkshopChange
        },
        {
            name: 'full_name',
            label: t('fullName'),
            type: 'text',
            required: true,
            placeholder: language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'
        },
        {
            name: 'email',
            label: t('email'),
            type: 'email',
            required: true,
            readonly: true,
            placeholder: language === 'ar' ? 'example@email.com' : 'example@email.com',
            value: user?.email || ''
        },
        {
            name: 'phone',
            label: t('phone'),
            type: 'tel',
            required: true,
            countryCode: '+968',
            placeholder: language === 'ar' ? '12345678' : '12345678'
        },
        {
            name: 'background',
            label: t('background'),
            type: 'select',
            required: true,
            options: [
                { value: 'programming', label: language === 'ar' ? 'برمجة' : 'Programming' },
                { value: 'accounting', label: language === 'ar' ? 'محاسبة' : 'Accounting' },
                { value: 'engineering', label: language === 'ar' ? 'هندسة' : 'Engineering' },
                { value: 'business', label: language === 'ar' ? 'إدارة أعمال' : 'Business Administration' },
                { value: 'design', label: language === 'ar' ? 'تصميم' : 'Design' },
                { value: 'marketing', label: language === 'ar' ? 'تسويق' : 'Marketing' },
                { value: 'finance', label: language === 'ar' ? 'مالية' : 'Finance' },
                { value: 'healthcare', label: language === 'ar' ? 'صحة' : 'Healthcare' },
                { value: 'education', label: language === 'ar' ? 'تعليم' : 'Education' },
                { value: 'law', label: language === 'ar' ? 'قانون' : 'Law' },
                { value: 'psychology', label: language === 'ar' ? 'علم نفس' : 'Psychology' },
                { value: 'media', label: language === 'ar' ? 'إعلام' : 'Media' },
                { value: 'tourism', label: language === 'ar' ? 'سياحة' : 'Tourism' },
                { value: 'agriculture', label: language === 'ar' ? 'زراعة' : 'Agriculture' },
                { value: 'other', label: language === 'ar' ? 'أخرى' : 'Other' }
            ]
        },
        {
            name: 'reason',
            label: t('reason'),
            type: 'textarea',
            required: false,
            placeholder: language === 'ar' 
                ? 'اكتب سبب رغبتك في حضور الورشة...' 
                : 'Tell us why you want to attend this workshop...'
        }
    ];

    const handleSubmit = async (formData) => {
        if (selectedWorkshops.length === 0) {
            showValidationError(
                language === 'ar' 
                    ? 'يرجى اختيار ورشة واحدة على الأقل من الورش المتاحة أعلاه' 
                    : 'Please select at least one workshop from the available workshops above'
            );
            return;
        }

        setIsLoading(true);
        const loadingToastId = showFormLoading(
            language === 'ar' ? 'جاري تسجيل الورش...' : 'Registering workshops...'
        );

        try {
            // Add workshop_ids to form data
            const dataWithWorkshops = {
                ...formData,
                workshop_ids: selectedWorkshops
            };
            
            const response = await submitWorkshopRegistration(dataWithWorkshops);
            if (response.success) {
                // Hide loading toast
                if (window.hideToast) window.hideToast(loadingToastId);
                
                // Show success message for multiple workshops
                const workshopCount = selectedWorkshops.length;
                showRegistrationSuccess('workshop', workshopCount, {
                    position: 'top-center',
                    duration: 5000
                });
                
                // Update the existing registration state
                setExistingRegistration(response.data);
                // Refresh user registrations to update workshop status
                await fetchUserRegistrations();
                // Clear selected workshops
                setSelectedWorkshops([]);
                // Don't navigate to success page, show the status instead
            } else {
                // Hide loading toast
                if (window.hideToast) window.hideToast(loadingToastId);
                showFormError(response.message || t('registrationFailed'));
            }
        } catch (error) {
            console.error('Registration error:', error);
            // Hide loading toast
            if (window.hideToast) window.hideToast(loadingToastId);
            
            // Use enhanced error handling
            handleApiErrorWithToast(error, () => {
                // Retry function
                handleSubmit(formData);
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
            {/* Hero Section */}
            <div className="relative text-white overflow-hidden" style={{background: 'linear-gradient(135deg, #096289 0%, #003C72 100%)'}}>
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-12 sm:py-16 lg:py-20">
                    <div className="text-center">
                        <div className="flex justify-center mb-4 sm:mb-6">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <span className="text-3xl sm:text-4xl">🎓</span>
                            </div>
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-2" style={{lineHeight: '1.1', paddingBottom: '0.5rem'}}>
                            {language === 'ar' ? 'الورش التدريبية' : 'Training Workshops'}
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-6 sm:mb-8 max-w-4xl mx-auto px-2" style={{color: '#F4A321'}}>
                            {language === 'ar' 
                                ? 'ورش تأهيلية تسبق الهاكثون لصقل المهارات وتطوير الحلول'
                                : 'Preparatory workshops before the hackathon to hone skills and develop solutions'
                            }
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm px-2">
                            <div className="bg-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                                {language === 'ar' ? 'تحليل المشكلات' : 'Problem Analysis'}
                            </div>
                            <div className="bg-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                                {language === 'ar' ? 'تطوير الحلول' : 'Solution Development'}
                            </div>
                            <div className="bg-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm">
                                {language === 'ar' ? 'العمل الجماعي' : 'Teamwork'}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Floating Elements - Responsive */}
                <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full opacity-20 sm:opacity-30 animate-pulse" style={{background: '#096289'}}></div>
                <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-12 h-12 sm:w-18 sm:h-18 lg:w-24 lg:h-24 rounded-full opacity-20 sm:opacity-30 animate-pulse delay-1000" style={{background: '#003C72'}}></div>
                <div className="absolute top-1/2 left-1/6 sm:left-1/4 w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 rounded-full opacity-20 sm:opacity-30 animate-pulse delay-500" style={{background: '#D85584'}}></div>
            </div>

            {/* Available Workshops Section */}
            <div className="py-12 sm:py-16 bg-white">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <div className="text-center mb-8 sm:mb-10 lg:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2" style={{lineHeight: '1.1', paddingBottom: '0.5rem'}}>
                            {language === 'ar' ? 'الورش التدريبية' : 'Training Workshops'}
                        </h2>
                        <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto px-2">
                            {language === 'ar' 
                                ? 'اختر الورش التي تريد المشاركة فيها لتطوير مهاراتك - الورش المسجلة فيها تظهر بحالة التسجيل، والورش الجديدة متاحة للتسجيل'
                                : 'Choose the workshops you want to participate in to develop your skills - registered workshops show their status, new workshops are available for registration'
                            }
                        </p>
                    </div>

                    {/* Registered Workshops Section */}
                    {workshopsWithStatus.filter(w => w.isRegistered).length > 0 && (
                        <div className="mb-8 sm:mb-10 lg:mb-12">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center px-2">
                                {language === 'ar' ? 'الورش المسجلة فيها' : 'Registered Workshops'}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {workshopsWithStatus
                                    .filter(workshop => workshop.isRegistered)
                                    .map((workshop) => {
                                        // تحديد الألوان حسب الحالة
                                        const getStatusColors = (status) => {
                                            switch (status) {
                                                case 'pending':
                                                    return {
                                                        bg: 'bg-gradient-to-br from-yellow-50 to-orange-50',
                                                        border: 'border-yellow-200',
                                                        badge: 'bg-yellow-100 text-yellow-800',
                                                        detailBg: 'bg-white/70',
                                                        detailBorder: 'border-yellow-100'
                                                    };
                                                case 'approved':
                                                    return {
                                                        bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
                                                        border: 'border-green-200',
                                                        badge: 'bg-green-100 text-green-800',
                                                        detailBg: 'bg-white/70',
                                                        detailBorder: 'border-green-100'
                                                    };
                                                case 'rejected':
                                                    return {
                                                        bg: 'bg-gradient-to-br from-red-50 to-pink-50',
                                                        border: 'border-red-200',
                                                        badge: 'bg-red-100 text-red-800',
                                                        detailBg: 'bg-white/70',
                                                        detailBorder: 'border-red-100'
                                                    };
                                                default:
                                                    return {
                                                        bg: 'bg-gradient-to-br from-gray-50 to-slate-50',
                                                        border: 'border-gray-200',
                                                        badge: 'bg-gray-100 text-gray-800',
                                                        detailBg: 'bg-white/70',
                                                        detailBorder: 'border-gray-100'
                                                    };
                                            }
                                        };

                                        const colors = getStatusColors(workshop.registrationStatus);

                                        return (
                                        <div 
                                            key={workshop.id} 
                                            className={`${colors.bg} rounded-xl sm:rounded-2xl shadow-lg border-2 ${colors.border} overflow-hidden hover:shadow-xl transition-all duration-300`}
                                        >
                                            <div className="p-4 sm:p-6">
                                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-2xl" 
                                                         style={{background: `linear-gradient(135deg, ${workshop.color || '#10B981'} 0%, #059669 100%)`}}>
                                                        {workshop.icon || '🎓'}
                                                    </div>
                                                    <div className={`text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full ${colors.badge}`}>
                                                        {language === 'ar' ? 'مسجل' : 'Registered'}
                                                    </div>
                                                </div>
                                                
                                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                                                    {workshop.title}
                                                </h3>
                                                
                                                {/* Status Section */}
                                                <div className={`mb-3 sm:mb-4 p-2.5 sm:p-3 bg-white rounded-lg border ${colors.detailBorder}`}>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-1.5 sm:space-x-2 rtl:space-x-reverse">
                                                            <span className="text-base sm:text-lg">{getStatusInfo(workshop.registrationStatus).icon}</span>
                                                            <span className="text-xs sm:text-sm font-medium text-gray-700">
                                                                {language === 'ar' ? 'الحالة:' : 'Status:'}
                                                            </span>
                                                        </div>
                                                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusInfo(workshop.registrationStatus).color}`}>
                                                            {getStatusInfo(workshop.registrationStatus).text}
                                                        </span>
                                                    </div>
                                                    {workshop.registrationStatus === 'rejected' && workshop.registration?.rejection_reason && (
                                                        <div className="mt-2 p-2 bg-red-50 rounded text-xs sm:text-sm text-red-700">
                                                            <strong>{language === 'ar' ? 'سبب الرفض:' : 'Rejection Reason:'}</strong> {workshop.registration.rejection_reason}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Registration Details */}
                                                <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                                                    <div className={`${colors.detailBg} rounded-lg p-2.5 sm:p-3 border ${colors.detailBorder}`}>
                                                        <div className="flex items-center space-x-1.5 sm:space-x-2 rtl:space-x-reverse mb-1.5 sm:mb-2">
                                                            <span className="text-blue-600 text-sm sm:text-base">👤</span>
                                                            <span className="text-xs sm:text-sm font-medium text-gray-700">
                                                                {language === 'ar' ? 'المسجل:' : 'Registered by:'}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-900 font-medium text-xs sm:text-sm">
                                                            {workshop.registration?.full_name || 'N/A'}
                                                        </p>
                                                    </div>

                                                    <div className={`${colors.detailBg} rounded-lg p-2.5 sm:p-3 border ${colors.detailBorder}`}>
                                                        <div className="flex items-center space-x-1.5 sm:space-x-2 rtl:space-x-reverse mb-1.5 sm:mb-2">
                                                            <span className="text-green-600 text-sm sm:text-base">📧</span>
                                                            <span className="text-xs sm:text-sm font-medium text-gray-700">
                                                                {language === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-900 font-medium text-xs sm:text-sm">
                                                            {workshop.registration?.email || 'N/A'}
                                                        </p>
                                                    </div>

                                                    <div className={`${colors.detailBg} rounded-lg p-2.5 sm:p-3 border ${colors.detailBorder}`}>
                                                        <div className="flex items-center space-x-1.5 sm:space-x-2 rtl:space-x-reverse mb-1.5 sm:mb-2">
                                                            <span className="text-purple-600 text-sm sm:text-base">🎓</span>
                                                            <span className="text-xs sm:text-sm font-medium text-gray-700">
                                                                {language === 'ar' ? 'الخلفية التعليمية:' : 'Background:'}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-900 font-medium text-xs sm:text-sm">
                                                            {workshop.registration?.background === 'programming' ? (language === 'ar' ? 'برمجة' : 'Programming') :
                                                             workshop.registration?.background === 'accounting' ? (language === 'ar' ? 'محاسبة' : 'Accounting') :
                                                             workshop.registration?.background === 'engineering' ? (language === 'ar' ? 'هندسة' : 'Engineering') :
                                                             workshop.registration?.background === 'business' ? (language === 'ar' ? 'إدارة أعمال' : 'Business Administration') :
                                                             workshop.registration?.background === 'design' ? (language === 'ar' ? 'تصميم' : 'Design') :
                                                             workshop.registration?.background === 'marketing' ? (language === 'ar' ? 'تسويق' : 'Marketing') :
                                                             workshop.registration?.background === 'finance' ? (language === 'ar' ? 'مالية' : 'Finance') :
                                                             workshop.registration?.background === 'healthcare' ? (language === 'ar' ? 'صحة' : 'Healthcare') :
                                                             workshop.registration?.background === 'education' ? (language === 'ar' ? 'تعليم' : 'Education') :
                                                             workshop.registration?.background === 'law' ? (language === 'ar' ? 'قانون' : 'Law') :
                                                             workshop.registration?.background === 'psychology' ? (language === 'ar' ? 'علم نفس' : 'Psychology') :
                                                             workshop.registration?.background === 'media' ? (language === 'ar' ? 'إعلام' : 'Media') :
                                                             workshop.registration?.background === 'tourism' ? (language === 'ar' ? 'سياحة' : 'Tourism') :
                                                             workshop.registration?.background === 'agriculture' ? (language === 'ar' ? 'زراعة' : 'Agriculture') :
                                                             workshop.registration?.background || 'N/A'}
                                                        </p>
                                                    </div>

                                                    {workshop.registration?.reason && (
                                                        <div className={`${colors.detailBg} rounded-lg p-3 border ${colors.detailBorder}`}>
                                                            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                                                                <span className="text-orange-600">💭</span>
                                                                <span className="text-sm font-medium text-gray-700">
                                                                    {language === 'ar' ? 'سبب المشاركة:' : 'Reason:'}
                                                                </span>
                                                            </div>
                                                            <p className="text-gray-900 font-medium text-sm">
                                                                {workshop.registration.reason}
                                                            </p>
                                                        </div>
                                                    )}

                                                    <div className={`${colors.detailBg} rounded-lg p-3 border ${colors.detailBorder}`}>
                                                        <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                                                            <span className="text-indigo-600">📅</span>
                                                            <span className="text-sm font-medium text-gray-700">
                                                                {language === 'ar' ? 'تاريخ التسجيل:' : 'Registration Date:'}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-900 font-medium text-sm">
                                                            {workshop.registration?.created_at ? new Date(workshop.registration.created_at).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            }) : 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <div className={`text-sm text-gray-500 mb-4 ${colors.detailBg} rounded-lg p-2 border ${colors.detailBorder}`}>
                                                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                                        <span>📅</span>
                                                        <span>{workshop.date || (language === 'ar' ? '15 يناير' : 'Jan 15')} • {workshop.time || '10:00 - 12:00'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        );
                                    })}
                            </div>
                        </div>
                    )}

                    {/* Available Workshops Section */}
                    <div className="mb-6 sm:mb-8">
                        <div className="text-center mb-4 sm:mb-6">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 px-2">
                                {language === 'ar' ? 'الورش المتاحة للتسجيل' : 'Available Workshops for Registration'}
                            </h3>
                            {selectedWorkshops.length > 0 && (
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                    <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                        <span className="mr-2">🎯</span>
                                        {language === 'ar' 
                                            ? `${selectedWorkshops.length} ورشة مختارة` 
                                            : `${selectedWorkshops.length} workshop(s) selected`
                                        }
                                    </div>
                                    <button
                                        onClick={() => setSelectedWorkshops([])}
                                        className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200 transition-colors duration-200"
                                    >
                                        <span className="mr-1">🗑️</span>
                                        {language === 'ar' ? 'مسح الكل' : 'Clear All'}
                                    </button>
                                </div>
                            )}
                        </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                        {workshopsWithStatus
                            .filter(workshop => !workshop.isRegistered)
                            .map((workshop, index) => (
                            <div 
                                key={workshop.id} 
                                className={`bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 overflow-hidden border-2 ${
                                    selectedWorkshops.includes(workshop.id)
                                        ? 'border-blue-500 ring-2 ring-blue-200' 
                                        : 'border-gray-200 hover:border-blue-300'
                                }`}
                            >
                                <div className="p-4 sm:p-6">
                                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-2xl" 
                                             style={{background: `linear-gradient(135deg, ${workshop.color || '#096289'} 0%, #003C72 100%)`}}>
                                            {workshop.icon || '🎓'}
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-500">
                                            {workshop.date || (language === 'ar' ? '15 يناير' : 'Jan 15')}
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                                        {workshop.title || (language === 'ar' ? 'تحليل المشكلات' : 'Problem Analysis')}
                                    </h3>
                                    
                                    <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
                                        {workshop.description || (language === 'ar' 
                                            ? 'تعلم كيفية تحليل المشكلات التقنية وإيجاد الحلول المناسبة'
                                            : 'Learn how to analyze technical problems and find appropriate solutions'
                                        )}
                                    </p>
                                    
                                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                                        <div className="flex items-center space-x-1.5 sm:space-x-2 rtl:space-x-reverse">
                                            <span className="text-sm sm:text-base">👨‍🏫</span>
                                            <span className="truncate">{workshop.instructor || (language === 'ar' ? 'د. أحمد محمد' : 'Dr. Ahmed Mohamed')}</span>
                                        </div>
                                        <div className="flex items-center space-x-1.5 sm:space-x-2 rtl:space-x-reverse">
                                            <span className="text-sm sm:text-base">👥</span>
                                            <span>{workshop.capacity || 25} {language === 'ar' ? 'مقعد' : 'seats'}</span>
                                        </div>
                                    </div>

                                    
                                    <div className="flex items-center justify-between">
                                        <div className="text-xs sm:text-sm text-gray-500">
                                            {workshop.time || '10:00 - 12:00'}
                                        </div>
                                        <button
                                            onClick={() => {
                                                toggleWorkshopSelection(workshop.id);
                                                // إزالة أي تسجيل موجود لفتح النموذج
                                                setExistingRegistration(null);
                                                // التمرير إلى نموذج التسجيل إذا تم اختيار ورشة
                                                if (!selectedWorkshops.includes(workshop.id)) {
                                                    setTimeout(() => {
                                                        const formSection = document.querySelector('.registration-form-section');
                                                        if (formSection) {
                                                            formSection.scrollIntoView({ behavior: 'smooth' });
                                                        }
                                                    }, 100);
                                                }
                                            }}
                                            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-200 ${
                                                selectedWorkshops.includes(workshop.id)
                                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                        >
                                            {selectedWorkshops.includes(workshop.id)
                                                ? (language === 'ar' ? '✓ محدد' : '✓ Selected')
                                                : (language === 'ar' ? '+ اختر' : '+ Select')
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {workshopsWithStatus.filter(w => !w.isRegistered).length === 0 && (
                        <div className="text-center py-8 sm:py-12">
                            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🎓</div>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2 px-2">
                                {language === 'ar' ? 'لا توجد ورش متاحة للتسجيل حالياً' : 'No workshops available for registration at the moment'}
                            </h3>
                            <p className="text-sm sm:text-base text-gray-500 px-2">
                                {language === 'ar' 
                                    ? 'جميع الورش متاحة أو لا توجد ورش جديدة'
                                    : 'All workshops are registered or no new workshops available'
                                }
                            </p>
                        </div>
                    )}

                </div>
            </div>

            {/* Content Section */}
            <div className="py-16 registration-form-section">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loadingRegistration ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <span className="ml-4 text-lg text-gray-600">
                                {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                            </span>
                        </div>
                    ) : existingRegistration && selectedWorkshops.length === 0 ? (
                        <WorkshopStatus 
                            registration={existingRegistration} 
                            onEdit={handleEditRegistration}
                        />
                    ) : (
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transition-transform duration-300">
                            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3"></div>
                            <div className="p-8 md:p-12">
                                <div className="text-center mb-10">
                                    <div className="flex justify-center mb-6">
                                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-3xl shadow-lg">
                                            <span className="text-4xl">🎓</span>
                                        </div>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                        {language === 'ar' ? 'نموذج التسجيل في الورش' : 'Workshop Registration Form'}
                                    </h2>
                                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                                        {language === 'ar' 
                                            ? 'املأ النموذج أدناه للمشاركة في الورش التدريبية المختارة'
                                            : 'Fill out the form below to participate in the selected training workshops'
                                        }
                                    </p>
                                </div>

                                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <p className="text-sm text-blue-700">
                                        {language === 'ar' 
                                            ? '💡 يمكنك اختيار عدة ورش من القائمة أعلاه - الورش المسجلة فيها مسبقاً لا تظهر في النموذج'
                                            : '💡 You can select multiple workshops from the list above - previously registered workshops will not appear in the form'
                                        }
                                    </p>
                                </div>

                                {selectedWorkshops.length > 0 && (
                                    <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                            <span className="text-green-600 text-lg">✅</span>
                                            <p className="text-sm text-green-700 font-medium">
                                                {language === 'ar' 
                                                    ? `تم اختيار ${selectedWorkshops.length} ورشة للتسجيل - املأ النموذج أدناه`
                                                    : `${selectedWorkshops.length} workshop(s) selected for registration - fill out the form below`
                                                }
                                            </p>
                                        </div>
                                        <div className="mt-2 text-xs text-green-600">
                                            {language === 'ar' 
                                                ? '💡 يمكنك إضافة ورش أخرى أو إزالة ورش من القائمة أعلاه'
                                                : '💡 You can add more workshops or remove workshops from the list above'
                                            }
                                        </div>
                                    </div>
                                )}

                                <Form
                                    onSubmit={handleSubmit}
                                    fields={fields}
                                    title=""
                                    submitText={t('submit')}
                                    isLoading={isLoading}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Info Section */}
            <div className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="text-4xl mb-4">🔍</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {language === 'ar' ? 'تحليل المشكلات' : 'Problem Analysis'}
                            </h3>
                            <p className="text-gray-600">
                                {language === 'ar' 
                                    ? 'تعلم كيفية تحليل التحديات وتحديد الحلول المناسبة'
                                    : 'Learn how to analyze challenges and identify appropriate solutions'
                                }
                            </p>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="text-4xl mb-4">🛠️</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {language === 'ar' ? 'تطوير الحلول' : 'Solution Development'}
                            </h3>
                            <p className="text-gray-600">
                                {language === 'ar' 
                                    ? 'اكتشف طرق تطوير الحلول الإبداعية والفعالة'
                                    : 'Discover ways to develop creative and effective solutions'
                                }
                            </p>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="text-4xl mb-4">👥</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {language === 'ar' ? 'العمل الجماعي' : 'Teamwork'}
                            </h3>
                            <p className="text-gray-600">
                                {language === 'ar' 
                                    ? 'تعلم مهارات العمل الجماعي والتعاون الفعال'
                                    : 'Learn teamwork skills and effective collaboration'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default WorkshopRegistration;
