import { updatePassword } from "@/src/service/userService";
import { useMutation } from "@tanstack/react-query";

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: updatePassword,
  });
};
