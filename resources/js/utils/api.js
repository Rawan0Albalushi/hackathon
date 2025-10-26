import axios from 'axios';

// Create an axios instance with defaults
const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true // Important for session cookies
});

// Add CSRF token to requests
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    apiClient.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
}

// Add a request interceptor to ensure CSRF token is sent
apiClient.interceptors.request.use(config => {
    const csrfToken = document.head.querySelector('meta[name="csrf-token"]');
    if (csrfToken) {
        config.headers['X-CSRF-TOKEN'] = csrfToken.content;
    }
    return config;
});

// Add a response interceptor to handle CSRF token refresh
apiClient.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 419) {
            // CSRF token expired, fetch new token
            try {
                const response = await fetch('/api/csrf-token', {
                    credentials: 'include'
                });
                const data = await response.json();
                
                // Update the meta tag
                const metaTag = document.head.querySelector('meta[name="csrf-token"]');
                if (metaTag && data.csrf_token) {
                    metaTag.content = data.csrf_token;
                }
                
                // Retry the original request
                if (error.config) {
                    error.config.headers['X-CSRF-TOKEN'] = data.csrf_token;
                    return apiClient.request(error.config);
                }
            } catch (refreshError) {
                console.error('Failed to refresh CSRF token:', refreshError);
            }
        }
        return Promise.reject(error);
    }
);

// API functions
export const submitHackathonRegistration = async (data) => {
    try {
        const response = await apiClient.post('/register/hackathon', data);
        return response.data;
    } catch (error) {
        console.error('Hackathon registration error:', error);
        throw error;
    }
};

export const submitWorkshopRegistration = async (data) => {
    try {
        const response = await apiClient.post('/register/workshop', data);
        return response.data;
    } catch (error) {
        console.error('Workshop registration error:', error);
        throw error;
    }
};

export const submitConferenceRegistration = async (data) => {
    try {
        const response = await apiClient.post('/register/conference', data);
        return response.data;
    } catch (error) {
        console.error('Conference registration error:', error);
        throw error;
    }
};

// Error handling utility
export const handleApiError = (error) => {
    if (error.response) {
        // Server responded with error status
        return error.response.data.message || 'An error occurred';
    } else if (error.request) {
        // Request was made but no response received
        return 'Network error. Please check your connection.';
    } else {
        // Something else happened
        return 'An unexpected error occurred';
    }
};

// Enhanced error handling with toast integration
export const handleApiErrorWithToast = (error, onRetry = null) => {
    let message = 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
    let title = 'خطأ في النظام';
    
    if (error.response) {
        // Server responded with error status
        if (error.response.status === 422) {
            // Validation error
            const errors = error.response.data.errors;
            if (errors) {
                const errorMessages = Object.values(errors).flat();
                message = 'يرجى تصحيح الأخطاء التالية:\n• ' + errorMessages.join('\n• ');
                title = 'خطأ في البيانات';
            } else {
                message = error.response.data.message || message;
            }
        } else if (error.response.status === 401) {
            message = 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.';
            title = 'انتهت الصلاحية';
        } else if (error.response.status === 403) {
            message = 'ليس لديك صلاحية للوصول إلى هذا المورد.';
            title = 'غير مصرح';
        } else if (error.response.status === 404) {
            message = 'المورد المطلوب غير موجود.';
            title = 'غير موجود';
        } else if (error.response.status >= 500) {
            message = 'خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.';
            title = 'خطأ في الخادم';
        } else {
            message = error.response.data.message || message;
        }
    } else if (error.request) {
        // Request was made but no response received
        message = 'خطأ في الاتصال بالإنترنت. يرجى التحقق من اتصالك والمحاولة مرة أخرى.';
        title = 'خطأ في الشبكة';
    }

    // Show toast with error message
    if (window.showError) {
        const actions = onRetry ? [
            {
                label: 'إعادة المحاولة',
                primary: true,
                onClick: onRetry
            }
        ] : undefined;

        return window.showError(message, {
            title,
            actions,
            duration: 6000
        });
    }

    return message;
};
