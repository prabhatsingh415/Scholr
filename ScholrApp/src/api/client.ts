import axios from "axios";
import useAuthStore from "../store/authStore";

const apiClient = axios.create({
  baseURL: "https://scholr-gateway.singh-prabhat-work.workers.dev/api/v1",
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

        const res = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          {},
          {
            withCredentials: true,
            headers: {
              Cookie: `refresh_token=${storedRefreshToken}`,
            },
          }
        );

        if (res.status === 200) {
          // Extract tokens
          const newAccessToken =
            res.data.data?.access_token || res.data.access_token;
          const rawCookie =
            res.headers?.["set-cookie"]?.[0] ||
            res.headers?.["Set-Cookie"]?.[0];

          const finalRefreshToken = rawCookie
            ? extractTokenFromCookie(rawCookie)
            : storedRefreshToken;

          if (!newAccessToken || !finalRefreshToken) {
            return Promise.reject("Token extraction failed");
          }

          useAuthStore.getState().setTokens({
            access_token: newAccessToken,
            refresh_token: finalRefreshToken,
          });

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
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
