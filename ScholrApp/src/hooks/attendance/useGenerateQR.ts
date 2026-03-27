import { generateQRCode } from "@/src/service/attendanceService";
import { useMutation } from "@tanstack/react-query";

const useGenerateQR = () => {
  return useMutation({
    mutationKey: ["generateQRCode"],
    mutationFn: generateQRCode,
  });
};

export default useGenerateQR;
