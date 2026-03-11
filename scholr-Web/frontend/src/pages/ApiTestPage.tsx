import { useState } from "react";
import { scholrApiClient, scholrTokenStorage } from "@/lib/scholr-api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface TestResult {
  endpoint: string;
  status: "pending" | "success" | "error";
  data?: unknown;
  error?: string;
}

export default function ApiTestPage() {
  const { toast } = useToast();
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [collegeId, setCollegeId] = useState("ST-2026-01");
  const [password, setPassword] = useState("Password@123");
  const [accessToken, setAccessToken] = useState(
    scholrTokenStorage.getAccessToken() || ""
  );

  const addResult = (endpoint: string, status: TestResult["status"], data?: unknown, error?: string) => {
    setResults((prev) => [
      { endpoint, status, data, error },
      ...prev.slice(0, 4), // Keep only last 5
    ]);
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      addResult("POST /auth/login", "pending");
      const result = await scholrApiClient.auth.login({
        collegeId,
        password,
      });
      const token = result.token || result.access_token || result.accessToken;
      if (token) {
        scholrTokenStorage.setAccessToken(token);
        setAccessToken(token);
      }
      addResult("POST /auth/login", "success", result);
      toast({
        title: "Login Successful",
        description: `Token: ${String(token).substring(0, 30)}...`,
      });
    } catch (error: any) {
      addResult(
        "POST /auth/login",
        "error",
        undefined,
        error.response?.data?.message || error.message
      );
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testGetMe = async () => {
    setLoading(true);
    try {
      addResult("GET /users/me", "pending");
      const result = await scholrApiClient.users.me();
      addResult("GET /users/me", "success", result);
      toast({
        title: "Get User Successful",
        description: `User ID: ${result.id || result.user_id}`,
      });
    } catch (error: any) {
      addResult(
        "GET /users/me",
        "error",
        undefined,
        error.response?.data?.message || error.message
      );
      toast({
        title: "Get User Failed",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testSignup = async () => {
    setLoading(true);
    try {
      addResult("POST /auth/signup", "pending");
      const result = await scholrApiClient.auth.signup({
        collegeId,
        password,
      });
      addResult("POST /auth/signup", "success", result);
      toast({
        title: "Signup Successful",
        description: "User created successfully",
      });
    } catch (error: any) {
      addResult(
        "POST /auth/signup",
        "error",
        undefined,
        error.response?.data?.message || error.message
      );
      toast({
        title: "Signup Failed",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testLogout = async () => {
    setLoading(true);
    try {
      addResult("POST /auth/logout", "pending");
      const result = await scholrApiClient.auth.logout();
      scholrTokenStorage.clear();
      setAccessToken("");
      addResult("POST /auth/logout", "success", result);
      toast({
        title: "Logout Successful",
      });
    } catch (error: any) {
      addResult(
        "POST /auth/logout",
        "error",
        undefined,
        error.response?.data?.message || error.message
      );
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testUpdateName = async () => {
    setLoading(true);
    try {
      addResult("PATCH /users/update-name", "pending");
      const result = await scholrApiClient.users.updateName({
        firstName: "Test",
        lastName: "User",
      });
      addResult("PATCH /users/update-name", "success", result);
      toast({
        title: "Update Name Successful",
      });
    } catch (error: any) {
      addResult(
        "PATCH /users/update-name",
        "error",
        undefined,
        error.response?.data?.message || error.message
      );
      toast({
        title: "Update Name Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testChangePassword = async () => {
    setLoading(true);
    try {
      addResult("PATCH /users/change-password", "pending");
      const result = await scholrApiClient.users.changePassword({
        currentPassword: password,
        newPassword: "TestPassword@456",
        confirmNewPassword: "TestPassword@456",
      });
      addResult("PATCH /users/change-password", "success", result);
      toast({
        title: "Change Password Successful",
      });
    } catch (error: any) {
      addResult(
        "PATCH /users/change-password",
        "error",
        undefined,
        error.response?.data?.message || error.message
      );
      toast({
        title: "Change Password Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-slate-900">API Test Console</h1>

        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-slate-900">Credentials</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  College ID
                </label>
                <input
                  type="text"
                  value={collegeId}
                  onChange={(e) => setCollegeId(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., ST-2026-01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Access Token (Auto-filled after login)
                </label>
                <input
                  type="text"
                  value={accessToken.substring(0, 50)}
                  readOnly
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 text-xs"
                  placeholder="Token will appear here after login"
                />
              </div>
            </div>
          </div>

          {/* Test Buttons */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-slate-900">API Endpoints</h2>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={testSignup}
                disabled={loading}
                variant="outline"
                className="h-10 text-xs"
              >
                Signup
              </Button>
              <Button
                onClick={testLogin}
                disabled={loading}
                className="h-10 text-xs"
              >
                Login
              </Button>
              <Button
                onClick={testGetMe}
                disabled={loading}
                variant="outline"
                className="h-10 text-xs"
              >
                Get Me
              </Button>
              <Button
                onClick={testUpdateName}
                disabled={loading}
                variant="outline"
                className="h-10 text-xs"
              >
                Update Name
              </Button>
              <Button
                onClick={testChangePassword}
                disabled={loading}
                variant="outline"
                className="h-10 text-xs"
              >
                Change Password
              </Button>
              <Button
                onClick={testLogout}
                disabled={loading}
                variant="destructive"
                className="h-10 text-xs"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-slate-900">Test Results</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-slate-500">No tests run yet. Click a button to test an endpoint.</p>
            ) : (
              results.map((result, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border-l-4 ${
                    result.status === "success"
                      ? "bg-green-50 border-green-500"
                      : result.status === "error"
                        ? "bg-red-50 border-red-500"
                        : "bg-yellow-50 border-yellow-500"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-sm font-semibold text-slate-900">
                        {result.endpoint}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        {result.status === "success"
                          ? "✓ Success"
                          : result.status === "error"
                            ? "✗ " + result.error
                            : "⏳ Pending"}
                      </p>
                    </div>
                  </div>
                  {result.data && (
                    <pre className="mt-2 text-xs bg-slate-900 text-green-400 p-2 rounded overflow-x-auto max-w-full">
                      {JSON.stringify(result.data, null, 2).substring(0, 200)}
                      {JSON.stringify(result.data, null, 2).length > 200 ? "..." : ""}
                    </pre>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Documentation */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">📖 API Documentation</h2>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>
              <strong>POST /auth/signup:</strong> Create a new account with College ID and
              password
            </li>
            <li>
              <strong>POST /auth/login:</strong> Login with College ID and password
            </li>
            <li>
              <strong>GET /users/me:</strong> Get current user profile (requires token)
            </li>
            <li>
              <strong>PATCH /users/update-name:</strong> Update first and last name (requires token)
            </li>
            <li>
              <strong>PATCH /users/change-password:</strong> Change password (requires token)
            </li>
            <li>
              <strong>POST /auth/logout:</strong> Logout current user (requires token)
            </li>
          </ul>
          <p className="mt-4 text-xs text-blue-700">
            Base URL: http://localhost:8080/api/v1 (configure via VITE_SCHOLR_API_URL)
          </p>
        </div>
      </div>
    </div>
  );
}
