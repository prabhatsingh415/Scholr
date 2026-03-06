import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../utils/api";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const { data } = await api.getCurrentUser();
                    setUser(data.user);
                    setIsAuthenticated(true);
                }
            }
            catch (error) {
                console.error("Auth check failed:", error);
                logout();
            }
            finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);
    const login = async (email, password) => {
        try {
            const { data } = await api.login(email, password);
            localStorage.setItem("token", data.token);
            setUser(data.user);
            setIsAuthenticated(true);
            return { success: true };
        }
        catch (error) {
            console.error("Login failed:", error);
            return { success: false, message: error.response?.data?.message || "Login failed" };
        }
    };
    const register = async (userData) => {
        try {
            const { data } = await api.register(userData);
            return { success: true, userId: data.userId };
        }
        catch (error) {
            console.error("Registration failed:", error);
            return { success: false, message: error.response?.data?.message || "Registration failed" };
        }
    };
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
    };
    return (<AuthContext.Provider value={{
            user,
            isAuthenticated,
            loading,
            login,
            register,
            logout,
        }}>
      {children}
    </AuthContext.Provider>);
};
export const useAuth = () => useContext(AuthContext);
