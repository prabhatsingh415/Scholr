import { useMutation } from "@tanstack/react-query";
import { resendOtp } from "../../service/authService";

export const useResendOtp = () => {
  return useMutation({
    mutationFn: (collegeId: string) => resendOtp(collegeId),
  });
};
