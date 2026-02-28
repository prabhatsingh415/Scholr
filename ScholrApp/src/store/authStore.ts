import { create } from "zustand";
import {
  devtools,
  persist,
  createJSONStorage,
  StateStorage,
} from "zustand/middleware";
import * as SecureStore from "expo-secure-store";
import { AuthDetails } from "@/types";

const secureStorageWrapper: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await SecureStore.deleteItemAsync(name);
  },
};

interface AuthState {
  auth: AuthDetails | null;
  setTokens: (fetchedAuth: AuthDetails) => void;
  deleteTokens: () => void;
}

const store = (set: any): AuthState => ({
  auth: null,
  setTokens: (fetchedAuth: AuthDetails): void => {
    set({
      auth: {
        access_token: fetchedAuth.access_token,
        refresh_token: fetchedAuth.refresh_token,
      },
    });
  },
  deleteTokens: (): void => {
    set({
      auth: null,
    });
  },
});

const useAuthStore = create<AuthState>()(
  persist(devtools(store), {
    name: "auth-storage",
    storage: createJSONStorage(() => secureStorageWrapper),
  })
);

export default useAuthStore;
