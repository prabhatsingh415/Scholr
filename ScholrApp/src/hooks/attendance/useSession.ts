import { fetchActiveSession } from "@/src/service/attendanceService";
import { useQuery } from "@tanstack/react-query";

export const useSession = () => {
  return useQuery({
    queryKey: ["activeSession"],
    queryFn: fetchActiveSession,
  });
};
