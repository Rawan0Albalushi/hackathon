import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import Form from '../components/Form';
import WorkshopStatus from '../components/WorkshopStatus';
import QRCodeDisplay from '../components/QRCodeDisplay';
import { submitWorkshopRegistration, handleApiErrorWithToast } from '../utils/api';
import { showRegistrationSuccess, showFormLoading, showFormError, showValidationError, clearAllMessages } from '../utils/messageUtils';

const WorkshopRegistration = () => {
    const { t, language } = useLanguage();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [workshops, setWorkshops] = useState([]);
    const [selectedWorkshops, setSelectedWorkshops] = useState([]);
    const [existingRegistration, setExistingRegistration] = useState(null);
    const [showQR, setShowQR] = useState(false);
    const [qrRegistration, setQrRegistration] = useState(null);

    // Improve popup UX: lock background scroll and close on ESC
    useEffect(() => {
        if (showQR) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            const handleKey = (e) => {
                if (e.key === 'Escape') {
                    setShowQR(false);
                    setQrRegistration(null);
                }
            };
            window.addEventListener('keydown', handleKey);
            return () => {
                document.body.style.overflow = originalOverflow;
                window.removeEventListener('keydown', handleKey);
            };
        }
    }, [showQR]);
    const [loadingRegistration, setLoadingRegistration] = useState(true);
    const [userRegistrations, setUserRegistrations] = useState([]);
    const [workshopsWithStatus, setWorkshopsWithStatus] = useState([]);
    const [prefillName, setPrefillName] = useState('');

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
                // Prefill name from the most recent workshop registration if available
                if (data.data.workshops.length > 0) {
                    setPrefillName(data.data.workshops[0].full_name || '');
                } else if (data.data.conference?.full_name) {
                    setPrefillName(data.data.conference.full_name);
                } else if (data.data.hackathon?.full_name) {
                    setPrefillName(data.data.hackathon.full_name);
                } else if (user?.name) {
                    setPrefillName(user.name);
                }
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
                        setPrefillName(existingReg.full_name || '');
                    }
                } else {
                    // If no specific workshop selected, show the first registration
                    setExistingRegistration(data.data.workshops[0]);
                    setPrefillName(data.data.workshops[0]?.full_name || '');
                }
            } else if (data.success) {
                const fallbackName = data.data.hackathon?.full_name
                    || data.data.conference?.full_name
                    || user?.name
                    || '';
                setPrefillName(fallbackName);
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
            name: 'full_name',
            label: t('fullName'),
            type: 'text',
            required: true,
            placeholder: language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name',
            value: prefillName || user?.name || ''
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
            name: 'age',
            label: t('age'),
            type: 'number',
            required: true,
            placeholder: language === 'ar' ? '25' : '25'
        },
        {
            name: 'city',
            label: language === 'ar' ? 'المحافظة / الولاية / المنطقة' : 'Governorate / State / Region',
            type: 'text',
            required: true,
            placeholder: language === 'ar' ? 'مسقط - بوشر' : 'Muscat - Bausher'
        },
        {
            name: 'background',
            label: t('background'),
            type: 'select',
            required: true,
            options: [
                { value: 'computer_science', label: language === 'ar' ? 'علوم الحاسب' : 'Computer Science' },
                { value: 'engineering', label: language === 'ar' ? 'الهندسة' : 'Engineering' },
                { value: 'business', label: language === 'ar' ? 'إدارة الأعمال' : 'Business' },
                { value: 'design', label: language === 'ar' ? 'التصميم' : 'Design' },
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
                // Ensure any lingering loading toasts are cleared before showing success
                if (window.hideToast) window.hideToast(loadingToastId);
                if (clearAllMessages) clearAllMessages();

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
                // Remember submitted name
                if (formData?.full_name) {
                    setPrefillName(formData.full_name);
                }
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 overflow-x-hidden">
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
                
                {/* Floating Star Elements - Responsive */}
                <div className="star-floating absolute top-10 sm:top-20 left-4 sm:left-10 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 opacity-20 sm:opacity-30 animate-pulse"></div>
                <div className="star-floating absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-12 h-12 sm:w-18 sm:h-18 lg:w-24 lg:h-24 opacity-20 sm:opacity-30 animate-pulse delay-1000"></div>
                <div className="star-floating absolute top-1/2 left-1/6 sm:left-1/4 w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 opacity-20 sm:opacity-30 animate-pulse delay-500"></div>
            </div>

            {/* Available Workshops Section removed: selection happens directly in the form below */}

            {/* Content Section */}
            <div className="py-8 lg:py-12 xl:py-16 registration-form-section">
                <div className="max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                    {loadingRegistration ? (
                        <div className="flex justify-center items-center py-12 lg:py-16">
                            <div className="animate-spin rounded-full h-8 w-8 lg:h-12 lg:w-12 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-sm lg:text-base text-gray-600">
                                {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                            </span>
                        </div>
                    ) : (
                        <>
                            {/* Registered workshops status list */}
                            {(() => {
                                const registeredWorkshops = workshopsWithStatus.filter(w => w.isRegistered);
                                if (registeredWorkshops.length === 0) return null;

                                return (
                                    <div className="bg-white rounded-xl lg:rounded-2xl xl:rounded-3xl shadow-2xl overflow-hidden mb-6 lg:mb-8">
                                        <div className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 lg:h-3"></div>
                                        <div className="p-4 lg:p-6 xl:p-8">
                                            <div className="flex items-center justify-between mb-4 lg:mb-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg">
                                                        <span>📋</span>
                                                    </div>
                                                    <h3 className="text-lg lg:text-xl font-bold text-gray-900">
                                                        {language === 'ar' ? 'متابعة طلبات الورش' : 'My Workshop Registrations'}
                                                    </h3>
                                                </div>
                                                <span className="text-xs lg:text-sm text-gray-500">
                                                    {language === 'ar' ? `${registeredWorkshops.length} ورشة` : `${registeredWorkshops.length} workshops`}
                                                </span>
                                            </div>

                                            <div className="divide-y divide-gray-100">
                                                {registeredWorkshops.map((w) => {
                                                    const info = getStatusInfo(w.registration?.status);
                                                    return (
                                                        <div key={`rw-${w.id}`} className="py-3 lg:py-4 flex items-center justify-between">
                                                            <div className="min-w-0 pr-3">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-lg">🎓</span>
                                                                    <p className="text-sm lg:text-base font-semibold text-gray-900 truncate">{w.title}</p>
                                                                </div>
                                                                {w.registration?.created_at && (
                                                                    <p className="text-[11px] lg:text-xs text-gray-500 mt-1">
                                                                        {language === 'ar' ? 'تاريخ الطلب: ' : 'Requested: '} 
                                                                        {new Date(w.registration.created_at).toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' })}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] lg:text-xs font-medium ${info.color}`}>
                                                                    {info.icon} {info.text}
                                                                </span>
                                                                {w.registration?.status === 'approved' && w.registration?.qr_code && (
                                                                    <button type="button" onClick={() => { setQrRegistration(w.registration); setShowQR(true); }} className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs lg:text-sm font-medium">
                                                                        <span>📱</span>
                                                                        <span>{language === 'ar' ? 'عرض QR' : 'View QR'}</span>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Registration form only if there are available workshops */}
                            {(() => {
                                const availableWorkshops = workshopsWithStatus.filter(w => !w.isRegistered);
                                if (availableWorkshops.length === 0) {
                                    return (
                                        <div className="text-center text-gray-600 py-8">
                                            {language === 'ar' ? 'لا توجد ورش متاحة للتسجيل حالياً.' : 'No workshops available for registration at the moment.'}
                                        </div>
                                    );
                                }

                                return (
                                    <div className="bg-white rounded-xl lg:rounded-2xl xl:rounded-3xl shadow-2xl overflow-hidden transition-transform duration-300">
                                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 lg:h-3"></div>
                                        <div className="p-4 lg:p-6 xl:p-8">
                                            <div className="text-center mb-4 lg:mb-6 xl:mb-8">
                                                <div className="flex justify-center mb-3 lg:mb-4">
                                                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 lg:p-4 xl:p-5 rounded-xl lg:rounded-2xl shadow-lg">
                                                        <span className="text-2xl lg:text-3xl xl:text-4xl">🎓</span>
                                                    </div>
                                                </div>
                                                <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-2 lg:mb-3">
                                                    {language === 'ar' ? 'نموذج التسجيل في الورش' : 'Workshop Registration Form'}
                                                </h2>
                                                <p className="text-sm lg:text-base xl:text-lg text-gray-600 max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
                                                    {language === 'ar' 
                                                        ? 'اختر من الورش المتاحة بالأسفل ثم أكمل بياناتك لإرسال الطلب'
                                                        : 'Choose from the available workshops below, then complete your details to submit'}
                                                </p>
                                            </div>

                                            <div className="mb-4 lg:mb-6 p-3 lg:p-4 bg-blue-50 rounded-lg lg:rounded-xl border border-blue-200">
                                                <p className="text-xs lg:text-sm text-blue-700">
                                                    {language === 'ar' 
                                                        ? '💡 يمكنك التسجيل في كل ورشة مرة واحدة فقط. الورش المسجلة لن تظهر هنا.'
                                                        : '💡 You can register for each workshop only once. Already-registered workshops won\'t appear here.'
                                                    }
                                                </p>
                                            </div>

                                            {/* Workshop selection grid inside the same card */}
                                            <div className="mb-4 lg:mb-6">
                                                <h3 className="text-sm lg:text-base font-semibold text-gray-800 mb-3">
                                                    {language === 'ar' ? 'اختر الورش المتاحة' : 'Choose Available Workshops'}
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                                                    {availableWorkshops.map((workshop) => {
                                                        const isSelected = selectedWorkshops.includes(String(workshop.id)) || selectedWorkshops.includes(workshop.id);
                                                        return (
                                                            <button
                                                                key={workshop.id}
                                                                type="button"
                                                                onClick={() => toggleWorkshopSelection(workshop.id)}
                                                                className={[
                                                                    'text-left w-full rounded-xl border p-3 lg:p-4 transition shadow-sm bg-white hover:shadow-md border-gray-200',
                                                                    isSelected ? 'ring-2 ring-blue-500 border-blue-300' : ''
                                                                ].join(' ')}
                                                            >
                                                                <div className="flex items-start justify-between">
                                                                    <div>
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <span className="text-lg">🎓</span>
                                                                            <span className="text-sm lg:text-base font-semibold text-gray-900">{workshop.title}</span>
                                                                        </div>
                                                                        {workshop.description && (
                                                                            <p className="text-[11px] lg:text-xs text-gray-600 line-clamp-2">{workshop.description}</p>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        {isSelected ? (
                                                                            <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-[10px] font-medium">
                                                                                {language === 'ar' ? 'مختارة' : 'Selected'}
                                                                            </span>
                                                                        ) : (
                                                                            <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-[10px] font-medium">
                                                                                {language === 'ar' ? 'اضغط للاختيار' : 'Tap to select'}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {selectedWorkshops.length > 0 && (
                                                <div className="mb-4 lg:mb-6 p-3 lg:p-4 bg-green-50 rounded-lg lg:rounded-xl border border-green-200">
                                                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                                        <span className="text-green-600 text-sm lg:text-base">✅</span>
                                                        <p className="text-xs lg:text-sm text-green-700 font-medium">
                                                            {language === 'ar' 
                                                                ? `تم اختيار ${selectedWorkshops.length} ورشة للتسجيل`
                                                                : `${selectedWorkshops.length} workshop(s) selected for registration`}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            <Form
                                                onSubmit={handleSubmit}
                                                fields={fields}
                                                title=""
                                                submitText={t('submit')}
                                                isLoading={isLoading}
                                                noContainer={true}
                                            />
                                        </div>
                                    </div>
                                );
                            })()}
                        </>
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
                                    : 'Learn teamwork skills and effective collaboration'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* QR Modal */}
                {showQR && qrRegistration && (
                    <div className="fixed inset-0 z-50 grid place-items-center p-3 sm:p-4">
                        <div className="absolute inset-0 bg-transparent" onClick={() => { setShowQR(false); setQrRegistration(null); }}></div>
                        <div className="relative z-10 w-full max-w-2xl md:max-w-3xl">
                            <div
                                role="dialog"
                                aria-modal="true"
                                className="bg-white rounded-3xl shadow-2xl overflow-auto animate-fade-in-up w-[96%] sm:w-[85%] md:w-[80%] max-h-[92vh] mx-auto"
                            >
                                <div className="flex items-center justify-between px-4 sm:px-5 py-3" style={{background: 'linear-gradient(135deg, #0ea5e9 0%, #22d3ee 100%)'}}>
                                    <h3 className="text-white font-bold text-sm sm:text-lg">
                                        {language === 'ar' ? 'عرض رمز QR' : 'Show QR Code'}
                                    </h3>
                                    <button type="button" onClick={() => { setShowQR(false); setQrRegistration(null); }} className="text-white/90 hover:text-white text-xl leading-none">
                                        ×
                                    </button>
                                </div>
                                <div className="p-4 sm:p-6">
                                    <QRCodeDisplay 
                                        qrCode={qrRegistration.qr_code}
                                        registrationId={qrRegistration.id}
                                        type="workshop"
                                        isCheckedIn={qrRegistration.is_checked_in}
                                        checkedInAt={qrRegistration.checked_in_at}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkshopRegistration;
