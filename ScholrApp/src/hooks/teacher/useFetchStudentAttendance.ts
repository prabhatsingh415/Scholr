import { fetchStudentsForAttendance } from "@/src/service/teacherService";
import { FetchStudentAttendance } from "@/types/attendance";
import { useQuery } from "@tanstack/react-query";

export const useFetchStudentAttendance = (payload: FetchStudentAttendance) => {
  return useQuery({
    queryKey: [
      "fetch-students",
      payload.subjectCode,
      payload.semesterId,
      payload.sessionId,
    ],
    queryFn: () => fetchStudentsForAttendance(payload),

    enabled: !!payload.subjectCode && !!payload.semesterId && !!payload.deptId,
    refetchInterval: 3000,
  });
};
