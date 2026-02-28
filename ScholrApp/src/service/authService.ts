import { AuthCredentials, AuthVerfication } from "@/types";
import apiClient from "../api/client";

export const signUp = async (credentials: AuthCredentials) => {
  const response = await apiClient.post("/auth/signup", credentials);
  return response.data;
};

export const verifyAccount = async (credentials: AuthVerfication) => {
  const response = await apiClient.post("/auth/verify-otp", credentials);
  return response.data;
};

export const loginUser = async (credentials: AuthCredentials) => {
  const response = await apiClient.post("/auth/login", credentials);
  return response.data;
};

export const fetchUserProfile = async () => {
  const response = await apiClient.get("/users/profile");
  return response.data;
};
