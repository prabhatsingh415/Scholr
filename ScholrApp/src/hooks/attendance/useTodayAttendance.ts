import { getTodayAttendance } from "@/src/service/attendanceService";
import { useQuery } from "@tanstack/react-query";

const useTodayAttendance = () => {
  return useQuery({
    queryKey: ["todayAttendance"],
    queryFn: getTodayAttendance,
  });
};

export default useTodayAttendance;
