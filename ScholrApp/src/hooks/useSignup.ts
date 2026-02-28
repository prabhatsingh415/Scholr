import { useMutation } from "@tanstack/react-query";
import { signUp } from "../service/authService";
export const useSignup = () => {
  return useMutation({
    mutationFn: signUp,
  });
};
