import { useMutation } from "@tanstack/react-query";
import { verifyAccount } from "../service/authService";

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: verifyAccount,
  });
};
