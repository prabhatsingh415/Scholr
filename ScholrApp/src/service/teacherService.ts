import apiClient from "../api/client";

export const fetchSubjects = async () => {
  const response = await apiClient.get("/teacher/subjects");
  return response.data;
};
