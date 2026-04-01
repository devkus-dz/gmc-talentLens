import axios from 'axios';

// Create the base instance
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach the JWT token
api.interceptors.request.use(
    (config) => {
        // Check if we are in the browser environment (Next.js SSR safety)
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle global errors (like expired tokens)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // If the backend kicks us out (401 Unauthorized), force a logout
            if (error.response.status === 401) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;