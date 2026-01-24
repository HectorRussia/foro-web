import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

// สร้าง Instance หลัก
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // สำคัญมาก: เพื่อให้ Browser ยอมส่ง HttpOnly Cookie ไปที่ /refresh
});

// Request Interceptor: แนบ Access Token ไปใน Header ทุกครั้ง
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. Response Interceptor: ดักจับ Error 401 เพื่อทำ Silent Refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // ถ้าเจอ 401 (Unauthorized) และยังไม่ได้ลองรีเฟรชมาก่อน (_retry)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // ยิงไปที่ /refresh เพื่อขอ Token ใหม่ (Cookie จะถูกส่งไปอัตโนมัติ)
                const res = await axios.post(
                    `${BASE_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = res.data.access_token;

                // บันทึก Token ใหม่
                localStorage.setItem('accessToken', newAccessToken);

                // อัปเดต Header ใน Request เดิมที่พังไป แล้วลองยิงใหม่
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                // ถ้า Refresh Token ก็หมดอายุ หรือโดนลบจาก DB ไปแล้ว
                // ให้สั่ง Logout หรือล้าง State ทันที
                localStorage.removeItem('accessToken');
                window.location.href = '/';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;