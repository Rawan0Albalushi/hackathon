import React from 'react';
import { 
    showSuccessMessage, 
    showErrorMessage, 
    showWarningMessage, 
    showInfoMessage,
    showConfirmation,
    showRegistrationSuccess
} from '../utils/messageUtils';

const MobileToastDemo = () => {
    const handleMobileSuccess = () => {
        showSuccessMessage('تم حفظ البيانات بنجاح على الهاتف!', {
            title: 'نجح! 📱',
            duration: 4000,
            position: 'top-center'
        });
    };

    const handleMobileError = () => {
        showErrorMessage('خطأ في الاتصال بالإنترنت', {
            title: 'خطأ الشبكة 📶',
            duration: 5000,
            position: 'top-center'
        });
    };

    const handleMobileWarning = () => {
        showWarningMessage('تحذير: هذا الإجراء سيستهلك بيانات الإنترنت', {
            title: 'تحذير البيانات 📊',
            duration: 4500,
            position: 'bottom-center'
        });
    };

    const handleMobileInfo = () => {
        showInfoMessage('تلميح: يمكنك النقر على الرسالة لإغلاقها', {
            title: 'معلومة مفيدة 💡',
            duration: 4000,
            position: 'top-right'
        });
    };

    const handleMobileConfirmation = () => {
        showConfirmation(
            'هل تريد حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.',
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

    const handleMobileRegistration = () => {
        showRegistrationSuccess('workshop', 2, {
            position: 'top-center',
            duration: 5000
        });
    };

    const handleMultipleToasts = () => {
        // Show multiple toasts to test stacking
        showSuccessMessage('رسالة أولى', { position: 'top-right' });
        setTimeout(() => showInfoMessage('رسالة ثانية', { position: 'top-right' }), 500);
        setTimeout(() => showWarningMessage('رسالة ثالثة', { position: 'top-right' }), 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
            <div className="max-w-md mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
                        اختبار الرسائل على الهاتف 📱
                    </h1>
                    
                    <div className="space-y-4">
                        <button
                            onClick={handleMobileSuccess}
                            className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors duration-200 text-sm font-semibold"
                        >
                            رسالة نجاح ✅
                        </button>
                        
                        <button
                            onClick={handleMobileError}
                            className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg transition-colors duration-200 text-sm font-semibold"
                        >
                            رسالة خطأ ❌
                        </button>
                        
                        <button
                            onClick={handleMobileWarning}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-lg transition-colors duration-200 text-sm font-semibold"
                        >
                            رسالة تحذير ⚠️
                        </button>
                        
                        <button
                            onClick={handleMobileInfo}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors duration-200 text-sm font-semibold"
                        >
                            رسالة معلومات ℹ️
                        </button>
                        
                        <button
                            onClick={handleMobileConfirmation}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg transition-colors duration-200 text-sm font-semibold"
                        >
                            رسالة تأكيد ❓
                        </button>
                        
                        <button
                            onClick={handleMobileRegistration}
                            className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg transition-colors duration-200 text-sm font-semibold"
                        >
                            نجاح التسجيل 🎓
                        </button>
                        
                        <button
                            onClick={handleMultipleToasts}
                            className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors duration-200 text-sm font-semibold"
                        >
                            رسائل متعددة 📚
                        </button>
                    </div>

                    <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                        <h4 className="font-semibold text-gray-700 mb-2 text-sm">التحسينات للهواتف:</h4>
                        <ul className="text-xs text-gray-600 space-y-1" dir="rtl">
                            <li>• أحجام محسنة للشاشات الصغيرة</li>
                            <li>• أزرار أكبر للمس السهل</li>
                            <li>• نصوص واضحة ومقروءة</li>
                            <li>• مسافات مناسبة للهواتف</li>
                            <li>• دعم Safe Area للهواتف الحديثة</li>
                            <li>• ترتيب ذكي للرسائل المتعددة</li>
                            <li>• تأثيرات لمس محسنة</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileToastDemo;
