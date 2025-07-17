import axios from "axios";
import { toast } from "react-toastify";
import { emit } from "./loadingEvents";

const axiosInstance = axios.create({
  // baseURL: import.meta.env.VITE_API_URL,
  baseURL: "http://localhost:5005",
});

// Keep track of how many GET requests are active
let getRequestCount = 0;

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Only listen to GET requests
    if (config.method === "get") {
      getRequestCount++;
      emit(true); // loading started
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.config.method === "get") {
      getRequestCount = Math.max(getRequestCount - 1, 0);
      if (getRequestCount === 0) emit(false); // loading ended
    }
    return response;
  },
  (error) => {
    if (error.config && error.config.method === "get") {
      getRequestCount = Math.max(getRequestCount - 1, 0);
      if (getRequestCount === 0) emit(false); // loading ended
    }
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      toast.error("انتهت صلاحية الجلسة. الرجاء تسجيل الدخول مرة أخرى.");
      window.location.href = "/user/signin";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
