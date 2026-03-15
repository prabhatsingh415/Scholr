import { StartAttendanceRequest } from "@/types/attendance";
import apiClient from "../api/client";

export const fetchActiveSession = async () => {
  const response = await apiClient.get("/attendance/active-session");

  return response.data.data ?? null;
};

export const generateQRCode = async (request: StartAttendanceRequest) => {
  const response = await apiClient.post("/attendance/generate", request);

  return response.data;
};
