import axios from "axios";
import { refreshToken } from "./refreshToken";

const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Access Token Acquired! - API");
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalReq = error.config;

        if (error.response?.status === 401 && !originalReq._retry) {
            originalReq._retry = true;
            const newAccessToken = await refreshToken();

            if (newAccessToken) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalReq.headers['Authorization'] = `Bearer ${newAccessToken}`;

                console.log("Access Token Refreshed! -API");
                return api(originalReq);
            } else {
                console.error("Could not refresh token. Redirecting to login...");
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;
