# Scholr API Integration Documentation

## Overview

The frontend is fully integrated with the Scholr backend API as specified in your Postman collection. All authentication and user endpoints are implemented and ready to use.

## API Configuration

**Base URL:** `http://localhost:8080/api/v1`

**Environment Variable:** `VITE_SCHOLR_API_URL` (optional)
- If not set, defaults to `http://localhost:8080/api/v1`
- Set in `.env` file to override

**Example `.env`:**
```
VITE_SCHOLR_API_URL=http://localhost:8080/api/v1
```

## API Files

### Main API Client: `src/lib/scholr-api.ts`
- Axios-based HTTP client
- Automatic Bearer token injection
- Token storage utilities
- All endpoints from Postman collection

### Authentication Service: `src/lib/local-storage.ts`
- High-level auth functions (signIn, signUp, signOut)
- User profile management
- Token handling
- JWT payload decoding

### Test Suite: `src/lib/scholr-api.test.ts`
- Automated tests for all endpoints
- Import and run `testScholrApi()` in console
- Includes quick connectivity check

### Test Page: `src/pages/ApiTestPage.tsx`
- Visual API testing interface
- Accessible at `/api-test` route
- Test all endpoints with UI

## API Endpoints Implemented

### Authentication Endpoints

#### 1. **Signup**
```typescript
scholrApiClient.auth.signup({
  collegeId: "ST-2026-01",
  password: "Password@123"
})
```
- **Method:** POST
- **Path:** `/auth/signup`
- **Auth:** None
- **Body:** `{ collegeId: string, password: string }`

#### 2. **Login**
```typescript
scholrApiClient.auth.login({
  collegeId: "ST-2026-01",
  password: "Password@123"
})
```
- **Method:** POST
- **Path:** `/auth/login`
- **Auth:** None
- **Body:** `{ collegeId: string, password: string }`
- **Returns:** Access token and optional refresh token

#### 3. **Verify OTP**
```typescript
scholrApiClient.auth.verifyOtp({
  otp: "409806",
  collegeId: "ST-2026-01"
})
```
- **Method:** POST
- **Path:** `/auth/verify-otp`
- **Auth:** None
- **Body:** `{ otp: string, collegeId: string }`

#### 4. **Refresh Token**
```typescript
scholrApiClient.auth.refresh()
```
- **Method:** POST
- **Path:** `/auth/refresh`
- **Auth:** Bearer token
- **Returns:** New access token

#### 5. **Logout**
```typescript
scholrApiClient.auth.logout()
```
- **Method:** POST
- **Path:** `/auth/logout`
- **Auth:** Bearer token required

#### 6. **Forgot Password**
```typescript
scholrApiClient.auth.forgotPassword({
  collegeId: "ST-2026-01"
})
```
- **Method:** POST
- **Path:** `/auth/forgot-password`
- **Auth:** None
- **Body:** `{ collegeId: string }`

#### 7. **Forgot Password Verify**
```typescript
scholrApiClient.auth.forgotPasswordVerify({
  otp: "150436",
  collegeId: "ST-2026-01",
  password: "NewPassword@123"
})
```
- **Method:** POST
- **Path:** `/auth/forgot-password-verify`
- **Auth:** None
- **Body:** `{ otp: string, collegeId: string, password: string }`

### User Endpoints

#### 1. **Get Current User**
```typescript
scholrApiClient.users.me()
```
- **Method:** GET
- **Path:** `/users/me`
- **Auth:** Bearer token required
- **Returns:** Current user profile

#### 2. **Update Name**
```typescript
scholrApiClient.users.updateName({
  firstName: "John",
  lastName: "Doe"
})
```
- **Method:** PATCH
- **Path:** `/users/update-name`
- **Auth:** Bearer token required
- **Body:** `{ firstName: string, lastName: string }`

#### 3. **Upload Profile Picture**
```typescript
const file = document.querySelector('input[type="file"]').files[0];
scholrApiClient.users.uploadProfilePic(file)
```
- **Method:** PUT
- **Path:** `/users/profile-pic`
- **Auth:** Bearer token required
- **Body:** FormData with `file` field
- **File Type:** Image file (jpg, png, etc.)

#### 4. **Change Password**
```typescript
scholrApiClient.users.changePassword({
  currentPassword: "OldPassword@123",
  newPassword: "NewPassword@456",
  confirmNewPassword: "NewPassword@456"
})
```
- **Method:** PATCH
- **Path:** `/users/change-password`
- **Auth:** Bearer token required
- **Body:** `{ currentPassword: string, newPassword: string, confirmNewPassword: string }`

## Usage Examples

### Example 1: Complete Login Flow

```typescript
import { scholrApiClient, scholrTokenStorage } from "@/lib/scholr-api";
import { auth } from "@/lib/local-storage";

// Option A: Using high-level auth service
const { user, error } = await auth.signIn("ST-2026-01", "Password@123", "student");
if (user) {
  console.log("Logged in:", user);
  // Navigate to dashboard
}

// Option B: Using low-level API client
const loginResult = await scholrApiClient.auth.login({
  collegeId: "ST-2026-01",
  password: "Password@123"
});

const accessToken = loginResult.token || loginResult.access_token;
scholrTokenStorage.setAccessToken(accessToken);
```

### Example 2: React Component with API

```typescript
import { useState } from "react";
import { scholrApiClient } from "@/lib/scholr-api";

export function ProfileComponent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const profile = await scholrApiClient.users.me();
      setUser(profile);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchProfile} disabled={loading}>
        {loading ? "Loading..." : "Load Profile"}
      </button>
      {user && <p>Welcome, {user.name}</p>}
    </div>
  );
}
```

### Example 3: File Upload

```typescript
const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
const file = fileInput.files?.[0];

if (file) {
  try {
    const result = await scholrApiClient.users.uploadProfilePic(file);
    console.log("Profile picture updated:", result);
  } catch (error) {
    console.error("Upload failed:", error);
  }
}
```

## Testing the API

### Option 1: Use the Test Page

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:5173/api-test`

3. Fill in credentials and click test buttons

4. View real-time responses

### Option 2: Run Test Suite in Console

```typescript
import { testScholrApi } from "@/lib/scholr-api.test";

// Run full test suite
await testScholrApi();
```

### Option 3: Quick Connectivity Check

```typescript
import { quickApiCheck } from "@/lib/scholr-api.test";

const isConnected = await quickApiCheck();
console.log("API connected:", isConnected);
```

## Error Handling

All API methods throw errors that follow this structure:

```typescript
try {
  const result = await scholrApiClient.auth.login({ collegeId, password });
} catch (error) {
  // error.response.status - HTTP status code
  // error.response.data - Server error response
  // error.message - Error message
  
  const message = error.response?.data?.message || error.message;
  console.error("API Error:", message);
}
```

Common HTTP status codes:
- `200`, `201` - Success
- `400` - Bad request (invalid input)
- `401` - Unauthorized (missing/invalid token)
- `409` - Conflict (user already exists)
- `500` - Server error

## Token Management

### Storing Tokens

```typescript
import { scholrTokenStorage } from "@/lib/scholr-api";

// Store tokens after login
scholrTokenStorage.setAccessToken(accessToken);
scholrTokenStorage.setRefreshToken(refreshToken);

// Retrieve tokens
const token = scholrTokenStorage.getAccessToken();
```

### Token Expiry

- Access tokens are automatically included in request headers
- If token expires, use refresh endpoint:
  ```typescript
  const newToken = await scholrApiClient.auth.refresh();
  scholrTokenStorage.setAccessToken(newToken.access_token);
  ```

### Clearing Tokens

```typescript
scholrTokenStorage.clear(); // Clears both tokens
```

## Integration with Login Page

The `/login` route already uses the API client:

**File:** `src/pages/cms/LoginPage.tsx`

```typescript
const handleSignIn = async (e: React.FormEvent) => {
  e.preventDefault();
  const { user, error } = await auth.signIn(collegeId, password, selectedRole);
  if (user) {
    navigate("/dashboard");
  } else {
    alert(error);
  }
};
```

The `auth.signIn` function handles:
- ✅ Calling the API login endpoint
- ✅ Storing tokens
- ✅ Fetching user profile
- ✅ Building user object from response
- ✅ Error handling

## Next Steps for Backend Integration

1. **Ensure backend is running:**
   ```bash
   # Backend should be at http://localhost:8080
   # Or set VITE_SCHOLR_API_URL environment variable
   ```

2. **Test endpoints:**
   - Visit `/api-test` route
   - Or run `await testScholrApi()` in console

3. **Handle backend response formats:**
   - API client extracts tokens from multiple possible field names:
     - `token`, `access_token`, `accessToken`
     - `refresh_token`, `refreshToken`
   - User data is extracted flexibly to handle different response formats

4. **Implement missing endpoints:**
   - If backend has additional endpoints, add them to `scholrApiClient` object

## Troubleshooting

### "Cannot find module or API is undefined"
- Ensure files are in correct location
- Import from `@/lib/scholr-api` or `@/lib/local-storage`

### "Failed to connect to API"
- Check backend is running on port 8080
- Verify `VITE_SCHOLR_API_URL` environment variable
- Check CORS settings on backend

### "401 Unauthorized"
- Token might be expired or invalid
- Clear storage and login again: `scholrTokenStorage.clear()`
- Check token is being sent in headers

### "422 Validation Error"
- Backend is rejecting invalid input
- Check request body format matches Postman collection
- Verify required fields are included

## File Structure

```
src/
├── lib/
│   ├── scholr-api.ts           ← Main API client
│   ├── scholr-api.test.ts      ← Test suite
│   └── local-storage.ts        ← Auth service
├── pages/
│   ├── cms/
│   │   └── LoginPage.tsx       ← Uses API endpoint
│   └── ApiTestPage.tsx         ← Test interface
└── App.tsx                     ← Routes configured
```

## Support

For questions about the API:
1. Check Postman collection for endpoint specs
2. Review error responses from backend
3. Run test suite to verify connectivity
4. Check console for detailed error messages
