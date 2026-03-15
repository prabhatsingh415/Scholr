import { fetchSubjects } from "@/src/service/teacherService";
import { useQuery } from "@tanstack/react-query";

const useFetchSubjects = () => {
  return useQuery({
    queryKey: ["teacherSubjects"],
    queryFn: fetchSubjects,
  });
};

export default useFetchSubjects;
