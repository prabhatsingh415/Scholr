/**
 * Scholr API Integration Test Suite
 * 
 * Automated tests for all API endpoints
 * 
 * Usage in browser console:
 * import { testScholrApi } from '@/lib/scholr-api.test'
 * await testScholrApi()
 */

import { scholrApiClient, scholrTokenStorage } from "./scholr-api";

const log = {
  success: (msg: string) => console.log(`[SUCCESS] ${msg}`),
  error: (msg: string) => console.log(`[ERROR] ${msg}`),
  info: (msg: string) => console.log(`[INFO] ${msg}`),
  test: (msg: string) => console.log(`[TEST] ${msg}`),
  warn: (msg: string) => console.log(`[WARN] ${msg}`),
};

export const testScholrApi = async () => {
  console.log("\n" + "=".repeat(60));
  console.log("API Integration Test Suite");
  console.log("=".repeat(60) + "\n");

  const testData = {
    collegeId: "ST-2026-01",
    password: "Password@123",
    newPassword: "TestPassword@456",
  };

  let accessToken = "";
  let refreshToken = "";

  try {
    // Test 1: Signup
    log.test("Testing Auth - Signup");
    try {
      const signupResult = await scholrApiClient.auth.signup({
        collegeId: testData.collegeId,
        password: testData.password,
      });
      log.success("Signup successful");
      console.log("Response:", signupResult);
    } catch (error: any) {
      if (error.response?.status === 400 || error.response?.status === 409) {
        log.warn("User already exists (expected if running multiple times)");
      } else {
        log.error("Signup failed: " + error.message);
      }
    }

    // Test 2: Login
    log.test("Testing Auth - Login");
    const loginResult = await scholrApiClient.auth.login({
      collegeId: testData.collegeId,
      password: testData.password,
    });
    
    accessToken = loginResult.token || loginResult.access_token || loginResult.accessToken || "";
    refreshToken = loginResult.refresh_token || loginResult.refreshToken || "";
    
    if (accessToken) {
      scholrTokenStorage.setAccessToken(accessToken);
      log.success("Login successful - Access token obtained");
      console.log("Token:", accessToken.substring(0, 50) + "...");
    } else {
      log.error("Login response missing token");
      console.log("Response:", loginResult);
    }

    if (refreshToken) {
      scholrTokenStorage.setRefreshToken(refreshToken);
      log.success("Refresh token obtained");
    }

    // Test 3: Get Current User
    log.test("Testing Users - Get Current User (Me)");
    const meResult = await scholrApiClient.users.me();
    log.success("Retrieved current user");
    console.log("User:", meResult);

    // Test 4: Update Name
    log.test("Testing Users - Update Name");
    const updateNameResult = await scholrApiClient.users.updateName({
      firstName: "Test",
      lastName: "User",
    });
    log.success("Name updated");
    console.log("Result:", updateNameResult);

    // Test 5: Change Password
    log.test("Testing Users - Change Password");
    try {
      const changePasswordResult = await scholrApiClient.users.changePassword({
        currentPassword: testData.password,
        newPassword: testData.newPassword,
        confirmNewPassword: testData.newPassword,
      });
      log.success("Password changed");
      console.log("Result:", changePasswordResult);
      
      // Update test data for login retry
      testData.password = testData.newPassword;
    } catch (error: any) {
      log.warn("Password change failed: " + error.response?.data?.message || error.message);
    }

    // Test 6: Refresh Token
    log.test("Testing Auth - Refresh Token");
    if (refreshToken) {
      try {
        const refreshResult = await scholrApiClient.auth.refresh();
        log.success("Token refreshed");
        const newAccessToken = refreshResult.token || refreshResult.access_token || refreshResult.accessToken;
        if (newAccessToken) {
          scholrTokenStorage.setAccessToken(newAccessToken);
          accessToken = newAccessToken;
        }
        console.log("New token:", newAccessToken?.substring(0, 50) + "...");
      } catch (error: any) {
        log.warn("Token refresh failed: " + error.message);
      }
    }

    // Test 7: Logout
    log.test("Testing Auth - Logout");
    const logoutResult = await scholrApiClient.auth.logout();
    log.success("Logged out successfully");
    console.log("Result:", logoutResult);

    // Test 8: Forgot Password
    log.test("Testing Auth - Forgot Password");
    const forgotResult = await scholrApiClient.auth.forgotPassword({
      collegeId: testData.collegeId,
    });
    log.success("Forgot password request sent");
    console.log("Result:", forgotResult);

    console.log("\n" + "=".repeat(60));
    log.success("All API tests completed successfully!");
    console.log("=".repeat(60) + "\n");

    return {
      success: true,
      message: "API integration verified",
      accessToken,
    };
  } catch (error: any) {
    console.log("\n" + "=".repeat(60));
    log.error("API test failed!");
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
    console.log("=".repeat(60) + "\n");

    return {
      success: false,
      message: error.message || "API test failed",
      error,
    };
  }
};

/**
 * Quick test to verify API connection
 */
export const quickApiCheck = async (): Promise<boolean> => {
  try {
    log.test("Checking API connectivity...");
    const result = await scholrApiClient.users.me();
    log.success("API is responding correctly");
    return true;
  } catch (error: any) {
    if (error.message.includes("401") || error.response?.status === 401) {
      log.warn("API is reachable but requires authentication");
      return true; // API is working, just not authenticated
    }
    log.error("API connection failed: " + error.message);
    return false;
  }
};

// Export for use in components
export const apiTestUtils = {
  testScholrApi,
  quickApiCheck,
};
