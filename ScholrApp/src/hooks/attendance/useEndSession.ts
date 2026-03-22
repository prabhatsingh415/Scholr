import { endSession } from "@/src/service/attendanceService";
import { useMutation } from "@tanstack/react-query";

const useEndSession = () => {
  return useMutation({
    mutationKey: ["endSession"],
    mutationFn: endSession,
  });
};
export default useEndSession;
