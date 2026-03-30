import { create } from "zustand";
import { auth, type User } from "@/lib/local-storage";

type UserRole = User["role"];

interface AuthStore {
  user: User | null;
  refreshUser: () => void;
  signIn: (collegeId: string, password: string, role: UserRole) => Promise<{
    user: User | null;
    error: string | null;
  }>;
  signOut: () => Promise<{
    error: string | null;
  }>;
  quickLogin: (role: UserRole, collegeId?: string) => {
    user: User;
  };
}

const readInitialUser = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return auth.getUser();
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: readInitialUser(),
  refreshUser: () => {
    set({ user: auth.getUser() });
  },
  signIn: async (collegeId, password, role) => {
    const result = await auth.signIn(collegeId, password, role);
    if (result.user) {
      set({ user: result.user });
    }
    return result;
  },
  signOut: async () => {
    const result = await auth.signOut();
    if (!result.error) {
      set({ user: null });
    }
    return result;
  },
  quickLogin: (role, collegeId) => {
    const result = auth.quickLogin(role, collegeId);
    set({ user: result.user });
    return result;
  },
}));
