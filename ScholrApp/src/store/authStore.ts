import { create } from "zustand";
import {
  devtools,
  persist,
  createJSONStorage,
  StateStorage,
} from "zustand/middleware";
import * as SecureStore from "expo-secure-store";
import { AuthDetails } from "@/types/auth";
import { AuthState } from "@/types/store";

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

const store = (set: any): AuthState => ({
  auth: null,
  _hasHydrated: false,
  setHasHydrated: (state) => set({ _hasHydrated: state }),
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

    onRehydrateStorage: () => (state) => {
      state?.setHasHydrated(true);
    },
  })
);

export default useAuthStore;
