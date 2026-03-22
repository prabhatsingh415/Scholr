import { markAttendance } from "@/src/service/attendanceService";
import { useMutation } from "@tanstack/react-query";

const useMarkAttendance = () => {
  return useMutation({
    mutationKey: ["markAttendance"],
    mutationFn: markAttendance,
  });
};

export default useMarkAttendance;
