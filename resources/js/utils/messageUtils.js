// Enhanced message utilities for the improved toast system

/**
 * Show a success message with enhanced options
 * @param {string} message - The message to display
 * @param {Object} options - Additional options
 * @param {string} options.title - Optional title for the message
 * @param {Array} options.actions - Optional action buttons
 * @param {number} options.duration - Duration in milliseconds (default: 4000)
 * @param {boolean} options.sound - Whether to play sound (default: true)
 * @param {string} options.position - Position of the toast (default: 'top-right')
 */
export const showSuccessMessage = (message, options = {}) => {
    if (window.showSuccess) {
        return window.showSuccess(message, options);
    }
    console.warn('Toast system not available');
};

/**
 * Show an error message with enhanced options
 * @param {string} message - The message to display
 * @param {Object} options - Additional options
 */
export const showErrorMessage = (message, options = {}) => {
    if (window.showError) {
        return window.showError(message, options);
    }
    console.warn('Toast system not available');
};

/**
 * Show a warning message with enhanced options
 * @param {string} message - The message to display
 * @param {Object} options - Additional options
 */
export const showWarningMessage = (message, options = {}) => {
    if (window.showWarning) {
        return window.showWarning(message, options);
    }
    console.warn('Toast system not available');
};

/**
 * Show an info message with enhanced options
 * @param {string} message - The message to display
 * @param {Object} options - Additional options
 */
export const showInfoMessage = (message, options = {}) => {
    if (window.showInfo) {
        return window.showInfo(message, options);
    }
    console.warn('Toast system not available');
};

/**
 * Show a loading message (doesn't auto-dismiss)
 * @param {string} message - The message to display
 * @param {Object} options - Additional options
 */
export const showLoadingMessage = (message, options = {}) => {
    if (window.showLoading) {
        return window.showLoading(message, options);
    }
    console.warn('Toast system not available');
};

/**
 * Hide a specific toast by ID
 * @param {string|number} toastId - The ID of the toast to hide
 */
export const hideToast = (toastId) => {
    if (window.hideToast) {
        return window.hideToast(toastId);
    }
    console.warn('Toast system not available');
};

/**
 * Clear all toasts
 */
export const clearAllMessages = () => {
    if (window.clearToasts) {
        return window.clearToasts();
    }
    console.warn('Toast system not available');
};

/**
 * Show a confirmation dialog as a toast with action buttons
 * @param {string} message - The confirmation message
 * @param {Function} onConfirm - Function to call when confirmed
 * @param {Function} onCancel - Function to call when cancelled
 * @param {Object} options - Additional options
 */
export const showConfirmation = (message, onConfirm, onCancel, options = {}) => {
    const actions = [
        {
            label: options.cancelText || 'إلغاء',
            onClick: () => {
                if (onCancel) onCancel();
                hideToast(toastId);
            }
        },
        {
            label: options.confirmText || 'تأكيد',
            primary: true,
            onClick: () => {
                if (onConfirm) onConfirm();
                hideToast(toastId);
            }
        }
    ];

    const toastId = showWarningMessage(message, {
        title: options.title || 'تأكيد العملية',
        actions,
        duration: 0, // Don't auto-dismiss
        ...options
    });

    return toastId;
};

/**
 * Show a registration success message with specific styling
 * @param {string} type - Type of registration (hackathon, workshop, conference)
 * @param {number} count - Number of items registered
 * @param {Object} options - Additional options
 */
export const showRegistrationSuccess = (type, count = 1, options = {}) => {
    const messages = {
        hackathon: `تم التسجيل بنجاح في ${count} ${count === 1 ? 'هاكاثون' : 'هاكاثون'}! سيتم مراجعة طلبك قريباً.`,
        workshop: `تم التسجيل بنجاح في ${count} ${count === 1 ? 'ورشة' : 'ورشة'}! سيتم مراجعة طلبك قريباً.`,
        conference: `تم التسجيل بنجاح في ${count} ${count === 1 ? 'مؤتمر' : 'مؤتمر'}! سيتم مراجعة طلبك قريباً.`
    };

    return showSuccessMessage(messages[type] || messages.workshop, {
        title: 'تم التسجيل بنجاح! 🎉',
        duration: 5000,
        position: 'top-center',
        ...options
    });
};

/**
 * Show an API error message with retry option
 * @param {Error} error - The error object
 * @param {Function} onRetry - Function to call for retry
 * @param {Object} options - Additional options
 */
export const showApiError = (error, onRetry, options = {}) => {
    let message = 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
    
    if (error.response?.data?.message) {
        message = error.response.data.message;
    } else if (error.message) {
        message = error.message;
    }

    const actions = onRetry ? [
        {
            label: 'إعادة المحاولة',
            primary: true,
            onClick: onRetry
        }
    ] : undefined;

    return showErrorMessage(message, {
        title: 'خطأ في النظام',
        actions,
        duration: 6000,
        ...options
    });
};

/**
 * Show a network error message
 * @param {Object} options - Additional options
 */
export const showNetworkError = (options = {}) => {
    return showErrorMessage('خطأ في الاتصال بالإنترنت. يرجى التحقق من اتصالك والمحاولة مرة أخرى.', {
        title: 'خطأ في الشبكة',
        duration: 8000,
        ...options
    });
};

/**
 * Show a validation error message
 * @param {string|Array} errors - Error message(s)
 * @param {Object} options - Additional options
 */
export const showValidationError = (errors, options = {}) => {
    let message = 'يرجى تصحيح الأخطاء التالية:';
    
    if (Array.isArray(errors)) {
        message += '\n• ' + errors.join('\n• ');
    } else {
        message = errors;
    }

    return showErrorMessage(message, {
        title: 'خطأ في البيانات',
        duration: 6000,
        ...options
    });
};

/**
 * Show a loading state for form submission
 * @param {string} message - Loading message
 * @returns {string|number} Toast ID for later dismissal
 */
export const showFormLoading = (message = 'جاري المعالجة...') => {
    return showLoadingMessage(message, {
        title: 'يرجى الانتظار',
        position: 'top-center'
    });
};

/**
 * Show form submission success
 * @param {string} message - Success message
 * @param {Object} options - Additional options
 */
export const showFormSuccess = (message, options = {}) => {
    return showSuccessMessage(message, {
        title: 'تم بنجاح! ✅',
        duration: 4000,
        position: 'top-center',
        ...options
    });
};

/**
 * Show form submission error
 * @param {string} message - Error message
 * @param {Object} options - Additional options
 */
export const showFormError = (message, options = {}) => {
    return showErrorMessage(message, {
        title: 'خطأ في الإرسال',
        duration: 5000,
        position: 'top-center',
        ...options
    });
};

// Export all functions as default object for easy importing
export default {
    showSuccessMessage,
    showErrorMessage,
    showWarningMessage,
    showInfoMessage,
    showLoadingMessage,
    hideToast,
    clearAllMessages,
    showConfirmation,
    showRegistrationSuccess,
    showApiError,
    showNetworkError,
    showValidationError,
    showFormLoading,
    showFormSuccess,
    showFormError
};
