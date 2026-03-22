import { toggleManualAttendance } from "@/src/service/attendanceService";
import { useMutation } from "@tanstack/react-query";

const useManualAttendance = () => {
  return useMutation({
    mutationKey: ["manualAttendance"],
    mutationFn: toggleManualAttendance,
  });
};

export default useManualAttendance;
