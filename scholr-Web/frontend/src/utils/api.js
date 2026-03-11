import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
export default {
    login: (email, password) => api.post("/auth/login", { email, password }),
    register: (data) => api.post("/auth/register", data),
    getCurrentUser: () => api.get("/auth/me"),
    getCourses: () => api.get("/courses"),
    getCourseMaterials: (courseId) => api.get(`/course-materials?course_id=${courseId}`),
    uploadCourseMaterial: (courseId, formData) => {
        return api.post("/course-materials", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
    getEvents: () => api.get("/events"),
    createEvent: (eventData) => api.post("/events", eventData),
    getGalleryItems: (category) => api.get(`/gallery${category ? `?category=${category}` : ""}`),
    uploadGalleryItem: (formData) => {
        return api.post("/gallery", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
    getFaculty: (department) => api.get(`/faculty${department ? `?department=${department}` : ""}`),
    getFacultyProfile: (id) => api.get(`/faculty/${id}`),
    getTestimonials: () => api.get("/testimonials"),
    getActiveNewsAlert: () => api.get("/news-alerts"),
};
