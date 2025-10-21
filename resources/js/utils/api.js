import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = '/api';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Add CSRF token to requests
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
}

// API functions
export const submitHackathonRegistration = async (data) => {
    try {
        const response = await axios.post('/register/hackathon', data);
        return response.data;
    } catch (error) {
        console.error('Hackathon registration error:', error);
        throw error;
    }
};

export const submitWorkshopRegistration = async (data) => {
    try {
        const response = await axios.post('/register/workshop', data);
        return response.data;
    } catch (error) {
        console.error('Workshop registration error:', error);
        throw error;
    }
};

export const submitConferenceRegistration = async (data) => {
    try {
        const response = await axios.post('/register/conference', data);
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
