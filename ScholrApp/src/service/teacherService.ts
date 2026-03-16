import { FetchStudentAttendance } from "@/types/attendance";
import apiClient from "../api/client";

export const fetchSubjects = async () => {
  const response = await apiClient.get("/teacher/subjects");
  return response.data;
};

export const fetchStudentsForAttendance = async (
  payload: FetchStudentAttendance
) => {
  const response = await apiClient.post(
    "/teacher/attendance/students",
    payload
  );
  return response.data;
};
