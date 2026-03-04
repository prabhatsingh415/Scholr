import { fetchUserProfile } from "@/src/service/userService";
import { useQuery } from "@tanstack/react-query";
export const useProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
  });
};
