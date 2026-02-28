import axios from "axios";
import useAuthStore from "../store/authStore";

const apiClient = axios.create({
  baseURL: "https://scholr-gateway.singh-prabhat-work.workers.dev/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const auth = useAuthStore.getState().auth;
    const token = auth?.access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
