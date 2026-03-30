import axios from 'axios';

// إعداد الرابط الأساسي للباكند
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/',
});

// هذا الإعداد يضيف الـ Token تلقائياً لأي طلب ترسله لكي لا تضطر لكتابته كل مرة
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;