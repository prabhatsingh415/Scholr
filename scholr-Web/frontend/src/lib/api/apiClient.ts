import axios from "axios";
import { useAuthStore } from "@/stores/use-auth-store";
const API_BASE_URL = import.meta.env.VITE_SCHOLR_API_URL;
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const extractTokenFromCookie = (cookieStr: string) => {
  return cookieStr.split(";")[0].split("=")[1];
};

// Request Interceptor: Attach Access Token
apiClient.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().auth?.access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Rotation
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login")
    ) {
      originalRequest._retry = true;

      try {
        const currentAuth = useAuthStore.getState().auth;
        const storedRefreshToken = currentAuth?.refresh_token;

        if (!storedRefreshToken) {
          useAuthStore.getState().deleteTokens();
          return Promise.reject(error);
        }

        // Use the same apiClient so baseURL/withCredentials are applied.
        // Do NOT set the Cookie header from browser JS — prefer server-set HttpOnly cookie.
        const res = await apiClient.post("/auth/refresh", {}, { withCredentials: true });

        if (res.status === 200) {
          // Prefer refresh token returned in JSON (safer for web); fallback to Set-Cookie only if available.
          const newAccessToken =
            res.data.data?.access_token || res.data.access_token;
          const maybeRefreshFromBody =
            res.data.data?.refresh_token || res.data.refresh_token;
          const rawCookie =
            res.headers?.["set-cookie"]?.[0] || res.headers?.["Set-Cookie"]?.[0];

          const finalRefreshToken = maybeRefreshFromBody
            ? maybeRefreshFromBody
            : rawCookie
            ? extractTokenFromCookie(rawCookie)
            : storedRefreshToken;

          if (!newAccessToken || !finalRefreshToken) {
            return Promise.reject("Token extraction failed");
          }

          useAuthStore.getState().setTokens({
            access_token: newAccessToken,
            refresh_token: finalRefreshToken,
          });

          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          // Retry using the same axios instance so interceptors/config are preserved
          return apiClient.request(originalRequest);
        }
      } catch (refreshError) {
        useAuthStore.getState().deleteTokens();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
