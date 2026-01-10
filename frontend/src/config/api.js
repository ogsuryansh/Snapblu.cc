// Automatically chooses URL based on environment
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

export default API_URL;
