import { AuthDetails } from "./auth";
import { UserDetails } from "./user";

export interface AuthState {
  auth: AuthDetails | null;
  _hasHydrated: boolean;
  setTokens: (fetchedAuth: AuthDetails) => void;
  deleteTokens: () => void;
  setHasHydrated: (state: boolean) => void;
}

export interface UserState {
  user: UserDetails | null;
  tempCollegeId: string;

  setData: (data: UserDetails) => void;
  deleteData: () => void;
  updateData: (data: UserDetails) => void;
  setTempCollegeId: (id: string) => void;
  clearTempCollegeId: () => void;
}
