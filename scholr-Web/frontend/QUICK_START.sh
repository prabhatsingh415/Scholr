#!/bin/bash
# Quick Start Guide for Scholr API Integration

cat << 'EOF'

SCHOLR API INTEGRATION - QUICK START GUIDE

================================================================================

STEP 1: START YOUR BACKEND

Make sure your backend is running on:
  http://localhost:8080/api/v1

================================================================================

STEP 2: START FRONTEND DEVELOPMENT

Run the development server:
  $ npm run dev

This starts your development server at:
  http://localhost:5173

================================================================================

STEP 3: TEST THE API

Option A - Visual Test Page:
  Visit http://localhost:5173/api-test in your browser

Option B - Console Test:
  Open browser console (F12) and run:
  import { testScholrApi } from '@/lib/scholr-api.test'
  await testScholrApi()

================================================================================

STEP 4: USE IN YOUR CODE

Login:
  import { auth } from "@/lib/local-storage"
  const { user, error } = await auth.signIn(collegeId, password, role)

Get Profile:
  import { scholrApiClient } from "@/lib/scholr-api"
  const user = await scholrApiClient.users.me()

Update Profile:
  await scholrApiClient.users.updateName({ firstName, lastName })

Change Password:
  await scholrApiClient.users.changePassword({
    currentPassword,
    newPassword,
    confirmNewPassword
  })

================================================================================

DOCUMENTATION

Full Guide:     src/API_INTEGRATION_GUIDE.md
Quick Ref:      src/lib/scholr-api.quick-ref.ts
Setup Details:  SETUP_COMPLETE.md
Test Page:      http://localhost:5173/api-test

================================================================================

API ENDPOINTS

Authentication:
  POST   /auth/signup
  POST   /auth/login
  POST   /auth/verify-otp
  POST   /auth/refresh
  POST   /auth/logout
  POST   /auth/forgot-password
  POST   /auth/forgot-password-verify

User:
  GET    /users/me
  PATCH  /users/update-name
  PUT    /users/profile-pic
  PATCH  /users/change-password

================================================================================

ENVIRONMENT VARIABLES

Optional - set in .env:
  VITE_SCHOLR_API_URL=http://localhost:8080/api/v1

Default (if not set):
  http://localhost:8080/api/v1

================================================================================

VERIFICATION CHECKLIST
VERIFICATION CHECKLIST

- [ ] Backend running on port 8080
- [ ] Frontend running on port 5173
- [ ] Test page loads at /api-test
- [ ] Can signup with valid credentials
- [ ] Can login with valid credentials
- [ ] Can fetch user profile
- [ ] Tokens are stored automatically
- [ ] Logout clears tokens

TIPS

- Use /api-test page for visual testing
- Check browser console (F12) for errors
- Run test suite to verify all endpoints
- Token auto-refreshes on 401 errors
- Check error messages in browser console

TROUBLESHOOTING

1. Check src/API_INTEGRATION_GUIDE.md for detailed documentation
2. Review /api-test page for working examples
3. Run test suite in console to debug issues
4. Check error messages in browser console
5. Verify backend response format matches expectations

================================================================================

Ready? Start your backend and visit http://localhost:5173/api-test

EOF
