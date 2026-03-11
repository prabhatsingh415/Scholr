import axios from "axios";

type AnyRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is AnyRecord => {
  return typeof value === "object" && value !== null;
};

const API_BASE_URL =
  import.meta.env.VITE_SCHOLR_API_URL?.replace(/\/+$/, "") || "http://localhost:8080/api/v1";

export const SCHOLR_ACCESS_TOKEN_KEY = "scholr_access_token";
export const SCHOLR_REFRESH_TOKEN_KEY = "scholr_refresh_token";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem(SCHOLR_ACCESS_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const scholrTokenStorage = {
  setAccessToken(token: string) {
    localStorage.setItem(SCHOLR_ACCESS_TOKEN_KEY, token);
  },
  getAccessToken() {
    return localStorage.getItem(SCHOLR_ACCESS_TOKEN_KEY);
  },
  setRefreshToken(token: string) {
    localStorage.setItem(SCHOLR_REFRESH_TOKEN_KEY, token);
  },
  getRefreshToken() {
    return localStorage.getItem(SCHOLR_REFRESH_TOKEN_KEY);
  },
  clear() {
    localStorage.removeItem(SCHOLR_ACCESS_TOKEN_KEY);
    localStorage.removeItem(SCHOLR_REFRESH_TOKEN_KEY);
  },
};

export const extractStringByKeys = (input: unknown, keys: string[]): string | null => {
  const queue: unknown[] = [input];
  const visited = new Set<unknown>();

  while (queue.length > 0) {
    const current = queue.shift();
    if (!isRecord(current) || visited.has(current)) {
      continue;
    }

    visited.add(current);

    for (const key of keys) {
      const value = current[key];
      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
    }

    for (const value of Object.values(current)) {
      if (isRecord(value)) {
        queue.push(value);
      }
    }
  }

  return null;
};

export const extractObjectByKeys = (input: unknown, keys: string[]): AnyRecord | null => {
  if (!isRecord(input)) {
    return null;
  }

  for (const key of keys) {
    const value = input[key];
    if (isRecord(value)) {
      return value;
    }
  }

  return null;
};

export const scholrApiClient = {
  auth: {
    signup: async (payload: { collegeId: string; password: string }) => {
      const { data } = await client.post("/auth/signup", payload);
      return data;
    },
    verifyOtp: async (payload: { otp: string; collegeId: string }) => {
      const { data } = await client.post("/auth/verify-otp", payload);
      return data;
    },
    refresh: async () => {
      const { data } = await client.post("/auth/refresh");
      return data;
    },
    login: async (payload: { collegeId: string; password: string }) => {
      const { data } = await client.post("/auth/login", payload);
      return data;
    },
    logout: async () => {
      const { data } = await client.post("/auth/logout");
      return data;
    },
    forgotPassword: async (payload: { collegeId: string }) => {
      const { data } = await client.post("/auth/forgot-password", payload);
      return data;
    },
    forgotPasswordVerify: async (payload: { otp: string; collegeId: string; password: string }) => {
      const { data } = await client.post("/auth/forgot-password-verify", payload);
      return data;
    },
  },
  users: {
    me: async () => {
      const { data } = await client.get("/users/me");
      return data;
    },
    updateName: async (payload: { firstName: string; lastName: string }) => {
      const { data } = await client.patch("/users/update-name", payload);
      return data;
    },
    uploadProfilePic: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await client.put("/users/profile-pic", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    },
    changePassword: async (payload: {
      currentPassword: string;
      newPassword: string;
      confirmNewPassword: string;
    }) => {
      const { data } = await client.patch("/users/change-password", payload);
      return data;
    },
  },
};

