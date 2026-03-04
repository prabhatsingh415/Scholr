import { updateProfilePic } from "@/src/service/userService";
import { useMutation } from "@tanstack/react-query";

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: updateProfilePic,
  });
};
