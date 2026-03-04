import { AuthCredentials, AuthVerfication } from "@/types/auth";
import apiClient from "../api/client";

export const signUp = async (credentials: AuthCredentials) => {
  const response = await apiClient.post("/auth/signup", credentials);
  return response.data;
};

export const verifyAccount = async (credentials: AuthVerfication) => {
  const response = await apiClient.post("/auth/verify-otp", credentials);
  return response;
};

export const resendOtp = async (collegeId: string) => {
  const response = await apiClient.post(
    `/auth/resend-otp?collegeId=${collegeId}`
  );
  return response.data;
};

export const loginUser = async (credentials: AuthCredentials) => {
  const response = await apiClient.post("/auth/login", credentials);
  return response;
};
