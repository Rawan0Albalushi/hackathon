import React from 'react';
import { 
    showSuccessMessage, 
    showErrorMessage, 
    showWarningMessage, 
    showInfoMessage, 
    showLoadingMessage,
    showConfirmation,
    showRegistrationSuccess,
    showApiError,
    showNetworkError,
    showValidationError,
    showFormLoading,
    showFormSuccess,
    showFormError
} from '../utils/messageUtils';

const MessageDemo = () => {
    const handleSuccessDemo = () => {
        showSuccessMessage('تم تنفيذ العملية بنجاح!', {
            title: 'نجح! 🎉',
            duration: 4000,
            position: 'top-right'
        });
    };

    const handleErrorDemo = () => {
        showErrorMessage('حدث خطأ في النظام', {
            title: 'خطأ! ❌',
            duration: 5000,
            position: 'top-right'
        });
    };

    const handleWarningDemo = () => {
        showWarningMessage('تحذير: هذا الإجراء لا يمكن التراجع عنه', {
            title: 'تحذير! ⚠️',
            duration: 4500,
            position: 'top-center'
        });
    };

    const handleInfoDemo = () => {
        showInfoMessage('معلومات مهمة: سيتم تحديث النظام قريباً', {
            title: 'معلومة! ℹ️',
            duration: 4000,
            position: 'bottom-right'
        });
    };

    const handleLoadingDemo = () => {
        const loadingId = showLoadingMessage('جاري المعالجة...', {
            title: 'يرجى الانتظار',
            position: 'top-center'
        });
        
        // Hide after 3 seconds
        setTimeout(() => {
            if (window.hideToast) window.hideToast(loadingId);
            showSuccessMessage('تمت المعالجة بنجاح!');
        }, 3000);
    };

    const handleConfirmationDemo = () => {
        showConfirmation(
            'هل أنت متأكد من حذف هذا العنصر؟',
            () => {
                showSuccessMessage('تم الحذف بنجاح!');
            },
            () => {
                showInfoMessage('تم إلغاء العملية');
            },
            {
                title: 'تأكيد الحذف',
                confirmText: 'حذف',
                cancelText: 'إلغاء'
            }
        );
    };

    const handleRegistrationSuccessDemo = () => {
        showRegistrationSuccess('workshop', 3, {
            position: 'top-center',
            duration: 5000
        });
    };

    const handleApiErrorDemo = () => {
        const mockError = {
            response: {
                status: 422,
                data: {
                    errors: {
                        email: ['البريد الإلكتروني مطلوب'],
                        name: ['الاسم مطلوب']
                    }
                }
            }
        };
        
        showApiError(mockError, () => {
            showInfoMessage('تم إعادة المحاولة');
        });
    };

    const handleNetworkErrorDemo = () => {
        showNetworkError();
    };

    const handleValidationErrorDemo = () => {
        showValidationError([
            'البريد الإلكتروني مطلوب',
            'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
            'الاسم مطلوب'
        ]);
    };

    const handleFormDemo = () => {
        const loadingId = showFormLoading('جاري إرسال النموذج...');
        
        setTimeout(() => {
            if (window.hideToast) window.hideToast(loadingId);
            showFormSuccess('تم إرسال النموذج بنجاح!');
        }, 2000);
    };

    const handleFormErrorDemo = () => {
        showFormError('فشل في إرسال النموذج. يرجى المحاولة مرة أخرى.');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                        عرض تجريبي للرسائل المحسنة 🎨
                    </h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Basic Messages */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">الرسائل الأساسية</h3>
                            
                            <button
                                onClick={handleSuccessDemo}
                                className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                            >
                                رسالة نجاح ✅
                            </button>
                            
                            <button
                                onClick={handleErrorDemo}
                                className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                            >
                                رسالة خطأ ❌
                            </button>
                            
                            <button
                                onClick={handleWarningDemo}
                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                            >
                                رسالة تحذير ⚠️
                            </button>
                            
                            <button
                                onClick={handleInfoDemo}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                            >
                                رسالة معلومات ℹ️
                            </button>
                        </div>

                        {/* Interactive Messages */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">الرسائل التفاعلية</h3>
                            
                            <button
                                onClick={handleLoadingDemo}
                                className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                            >
                                رسالة تحميل ⏳
                            </button>
                            
                            <button
                                onClick={handleConfirmationDemo}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                            >
                                رسالة تأكيد ❓
                            </button>
                            
                            <button
                                onClick={handleRegistrationSuccessDemo}
                                className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                            >
                                نجاح التسجيل 🎓
                            </button>
                        </div>

                        {/* Error Handling */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">معالجة الأخطاء</h3>
                            
                            <button
                                onClick={handleApiErrorDemo}
                                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                            >
                                خطأ API 🔌
                            </button>
                            
                            <button
                                onClick={handleNetworkErrorDemo}
                                className="w-full bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                            >
                                خطأ الشبكة 🌐
                            </button>
                            
                            <button
                                onClick={handleValidationErrorDemo}
                                className="w-full bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                            >
                                خطأ التحقق 📝
                            </button>
                        </div>

                        {/* Form Messages */}
                        <div className="space-y-3 md:col-span-2 lg:col-span-3">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">رسائل النماذج</h3>
                            
                            <div className="flex space-x-4 rtl:space-x-reverse">
                                <button
                                    onClick={handleFormDemo}
                                    className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                                >
                                    تحميل النموذج 📋
                                </button>
                                
                                <button
                                    onClick={handleFormErrorDemo}
                                    className="flex-1 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                                >
                                    خطأ النموذج 📋
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                        <h4 className="font-semibold text-gray-700 mb-2">المميزات الجديدة:</h4>
                        <ul className="text-sm text-gray-600 space-y-1" dir="rtl">
                            <li>• تصميم حديث مع تدرجات لونية جميلة</li>
                            <li>• رسوم متحركة سلسة ومتطورة</li>
                            <li>• أصوات تنبيهية لكل نوع رسالة</li>
                            <li>• دعم كامل للنصوص العربية</li>
                            <li>• أزرار تفاعلية في الرسائل</li>
                            <li>• شريط تقدم متحرك</li>
                            <li>• مواضع متعددة للرسائل</li>
                            <li>• معالجة محسنة للأخطاء</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageDemo;
