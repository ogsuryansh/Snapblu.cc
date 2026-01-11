import axios from 'axios';

// Automatically chooses URL based on environment
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

// Add a global response interceptor
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear both user and admin info
            localStorage.removeItem('userInfo');
            localStorage.removeItem('adminInfo');

            // Redirect to login if not already there
            if (!window.location.pathname.includes('/login')) {
                window.location.href = window.location.pathname.includes('/admin') ? '/admin/login' : '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default API_URL;
