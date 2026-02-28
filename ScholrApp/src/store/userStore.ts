import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Role, UserDetails } from "@/types";

interface UserState {
  user: UserDetails | null;
  tempCollegeId: string;

  setData: (data: UserDetails) => void;
  deleteData: () => void;
  updateData: (data: UserDetails) => void;
  setTempCollegeId: (id: string) => void;
  clearTempCollegeId: () => void;
}

const userStore = (set: any): UserState => ({
  user: null,
  tempCollegeId: "",

  setData: (fetchDetails: UserDetails): void => {
    set({ user: fetchDetails });
  },

  deleteData: (): void => {
    set({ user: null, tempCollegeId: "" });
  },

  updateData: (partialDetails: Partial<UserDetails>): void => {
    set((state: UserState) => ({
      user: state.user ? { ...state.user, ...partialDetails } : null,
    }));
  },

  setTempCollegeId: (id: string) => set({ tempCollegeId: id }),
  clearTempCollegeId: () => set({ tempCollegeId: "" }),
});

const useUserStore = create<UserState>()(
  persist(devtools(userStore), {
    name: "user-storage",
    storage: createJSONStorage(() => AsyncStorage),
  })
);

export default useUserStore;
