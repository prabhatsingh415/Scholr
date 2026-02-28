import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../service/authService";
export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};
