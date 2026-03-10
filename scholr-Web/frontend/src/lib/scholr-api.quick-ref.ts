#!/usr/bin/env node

/**
 * SCHOLR API QUICK REFERENCE
 * 
 * This file provides a quick reference for all API endpoints
 * Copy-paste ready code examples
 */

// ============================================
// IMPORTS
// ============================================
import { scholrApiClient, scholrTokenStorage } from "@/lib/scholr-api";
import { auth } from "@/lib/local-storage";

// ============================================
// AUTHENTICATION
// ============================================

/** Signup new user */
const signup = async () => {
  const { user, error } = await auth.signUp("ST-2026-01", "Password@123");
  if (user) console.log("Signed up:", user);
  if (error) console.error("Signup error:", error);
};

/** Login user */
const login = async () => {
  const { user, error } = await auth.signIn("ST-2026-01", "Password@123", "student");
  if (user) console.log("Logged in:", user);
  if (error) console.error("Login error:", error);
};

/** Logout */
const logout = async () => {
  const { error } = await auth.signOut();
  if (!error) console.log("Logged out");
};

/** Forgot password - Step 1: Request reset */
const forgotPassword = async () => {
  const result = await scholrApiClient.auth.forgotPassword({
    collegeId: "ST-2026-01",
  });
  console.log("Check your email for OTP");
};

/** Forgot password - Step 2: Verify OTP and set new password */
const forgotPasswordVerify = async () => {
  const result = await scholrApiClient.auth.forgotPasswordVerify({
    otp: "150436",
    collegeId: "ST-2026-01",
    password: "NewPassword@123",
  });
  console.log("Password reset successful");
};

/** Verify OTP (for signup) */
const verifyOtp = async () => {
  const result = await scholrApiClient.auth.verifyOtp({
    otp: "409806",
    collegeId: "ST-2026-01",
  });
  console.log("OTP verified");
};

/** Refresh access token */
const refreshToken = async () => {
  try {
    const result = await scholrApiClient.auth.refresh();
    const newToken = result.token || result.access_token || result.accessToken;
    if (newToken) {
      scholrTokenStorage.setAccessToken(newToken);
      console.log("Token refreshed");
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
  }
};

// ============================================
// USER PROFILE
// ============================================

/** Get current user profile */
const getProfile = async () => {
  const profile = await scholrApiClient.users.me();
  console.log("Profile:", profile);
};

/** Update user name */
const updateProfileName = async () => {
  const result = await scholrApiClient.users.updateName({
    firstName: "John",
    lastName: "Doe",
  });
  console.log("Name updated:", result);
};

/** Upload profile picture */
const uploadProfilePicture = async (file: File) => {
  const result = await scholrApiClient.users.uploadProfilePic(file);
  console.log("Profile picture updated:", result);
};

/** Change password */
const changePassword = async () => {
  const result = await scholrApiClient.users.changePassword({
    currentPassword: "OldPassword@123",
    newPassword: "NewPassword@456",
    confirmNewPassword: "NewPassword@456",
  });
  console.log("Password changed:", result);
};

// ============================================
// TOKEN MANAGEMENT
// ============================================

/** Get stored access token */
const getAccessToken = () => {
  return scholrTokenStorage.getAccessToken();
};

/** Get stored refresh token */
const getRefreshToken = () => {
  return scholrTokenStorage.getRefreshToken();
};

/** Store access token */
const setAccessToken = (token: string) => {
  scholrTokenStorage.setAccessToken(token);
};

/** Store refresh token */
const setRefreshToken = (token: string) => {
  scholrTokenStorage.setRefreshToken(token);
};

/** Clear all tokens */
const clearTokens = () => {
  scholrTokenStorage.clear();
};

// ============================================
// GETTING CURRENT USER
// ============================================

/** Get user from local storage (if logged in) */
const getCurrentUser = () => {
  const user = auth.getUser();
  if (user) {
    console.log("Current user:", user);
    return user;
  } else {
    console.log("Not logged in");
    return null;
  }
};

// ============================================
// API TESTING
// ============================================

/** Test API connectivity */
const testAPI = async () => {
  try {
    const user = await scholrApiClient.users.me();
    console.log("✓ API is working");
    return true;
  } catch (error) {
    console.log("✗ API connection failed");
    return false;
  }
};

/** Run full test suite */
const runFullTests = async () => {
  const { testScholrApi } = await import("@/lib/scholr-api.test");
  await testScholrApi();
};

// ============================================
// REACT COMPONENT FILE EXAMPLE
// ============================================

/**
 * See /src/pages/cms/LoginPage.tsx for a complete React component example
 * that uses auth.signIn() from the API
 */

// Example usage in a React component:
// import { auth } from "@/lib/local-storage";
// const { user, error } = await auth.signIn(collegeId, password, "student");
// if (user) {
//   navigate("/dashboard");
// } else {
//   console.error(error);
// }

// ============================================
// COMMON PATTERNS
// ============================================

/**
 * Pattern 1: Check if user is authenticated
 */
const checkAuth = () => {
  const user = auth.getUser();
  return user !== null;
};

/**
 * Pattern 2: Handle API errors gracefully
 */
const apiCall = async () => {
  try {
    const result = await scholrApiClient.users.me();
    return { success: true, data: result };
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return { success: false, error: message };
  }
};

/**
 * Pattern 3: Auto-refresh token on 401
 */
const withAutoRefresh = async (apiFunction: () => Promise<any>) => {
  try {
    return await apiFunction();
  } catch (error: any) {
    if (error.response?.status === 401) {
      // Token expired, try to refresh
      try {
        const result = await scholrApiClient.auth.refresh();
        const newToken = result.token || result.access_token;
        if (newToken) {
          scholrTokenStorage.setAccessToken(newToken);
          // Retry the original call
          return await apiFunction();
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        throw refreshError;
      }
    }
    throw error;
  }
};

// ============================================
// DEBUGGING
// ============================================

/**
 * Debug: Log all stored auth data
 */
const debugAuth = () => {
  console.log("=== AUTH DEBUG INFO ===");
  console.log("Current user:", auth.getUser());
  console.log("Access token:", scholrTokenStorage.getAccessToken()?.substring(0, 20) + "...");
  console.log("Refresh token:", scholrTokenStorage.getRefreshToken()?.substring(0, 20) + "...");
  console.log("=======================");
};

/**
 * Debug: Clear all auth and reload
 */
const resetAuth = () => {
  scholrTokenStorage.clear();
  localStorage.removeItem("auth_user");
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

// ============================================
// EXPORTS
// ============================================

export const apiQuickRef = {
  // Auth
  signup,
  login,
  logout,
  forgotPassword,
  forgotPasswordVerify,
  verifyOtp,
  refreshToken,

  // Profile
  getProfile,
  updateProfileName,
  uploadProfilePicture,
  changePassword,

  // Tokens
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,

  // User
  getCurrentUser,

  // Testing
  testAPI,
  runFullTests,

  // Debug
  debugAuth,
  resetAuth,
  checkAuth,
};

/**
 * QUICK START IN BROWSER CONSOLE:
 *
 * 1. First time login:
 *    await testScholrApi()
 *
 * 2. Test connection:
 *    import { quickApiCheck } from '@/lib/scholr-api.test'
 *    await quickApiCheck()
 *
 * 3. Debug auth:
 *    import { auth } from '@/lib/local-storage'
 *    console.log(auth.getUser())
 *
 * 4. Clear auth and logout:
 *    import { scholrTokenStorage } from '@/lib/scholr-api'
 *    scholrTokenStorage.clear()
 */
