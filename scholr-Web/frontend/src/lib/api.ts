import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  auth: {
    login: (data: any) => apiClient.post("/auth/login", data),
    signup: (data: any) => apiClient.post("/auth/signup", data),
    verifyOtp: (data: any) => apiClient.post("/auth/verify-otp", data),
    refresh: () => apiClient.post("/auth/refresh"),
    logout: () => apiClient.post("/auth/logout"),
    forgotPassword: (data: any) => apiClient.post("/auth/forgot-password", data),
    forgotPasswordVerify: (data: any) => apiClient.post("/auth/forgot-password-verify", data),
  },
  user: {
    me: () => apiClient.get("/users/me"),
    updateName: (data: any) => apiClient.patch("/users/update-name", data),
    changePassword: (data: any) => apiClient.patch("/users/change-password", data),
    profilePic: (data: FormData) => apiClient.put("/users/profile-pic", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  },
  attendance: {
    generate: (data: any) => apiClient.post("/attendance/generate", data),
    verify: (data: any) => apiClient.post("/attendance/verify", data),
    manual: () => apiClient.get("/attendance/manual"),
  },
  admin: {
    getUsers: (role: string) => apiClient.get(`/admin/users?role=${role}`),
    addStudent: (data: any) => apiClient.post("/admin/students", data),
    addTeacher: (data: any) => apiClient.post("/admin/teachers", data),
    bulkAddStudent: (data: any[]) => apiClient.post("/admin/students/bulk", data),
    bulkAddTeacher: (data: any[]) => apiClient.post("/admin/teachers/bulk", data),
  },
  semester: {
    add: (data: any) => apiClient.post("/semesters", data),
    addBulk: (data: any[]) => apiClient.post("/semesters/bulk", data),
    getAll: (id: number) => apiClient.get(`/semesters/${id}`),
    getById: (id: number) => apiClient.get(`/semesters/${id}`),
  },
};