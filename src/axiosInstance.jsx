// axiosInstance.js
import axios from "axios";
import { toast } from "react-toastify";


const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // adjust to your backend
});

// Request Interceptor – Attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor – Handle invalid or expired token
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      toast.error("انتهت صلاحية الجلسة. الرجاء تسجيل الدخول مرة أخرى.");
      window.location.href = "/user/signin";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
