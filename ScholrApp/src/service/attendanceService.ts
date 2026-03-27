import {
  ManualAttendanceRequest,
  StartAttendanceRequest,
  StudentAttendance,
} from "@/types/attendance";
import apiClient from "../api/client";

export const fetchActiveSession = async () => {
  const response = await apiClient.get("/attendance/active-session");

  return response.data.data ?? null;
};

export const generateQRCode = async (request: StartAttendanceRequest) => {
  const response = await apiClient.post("/attendance/generate", request);

  return response.data;
};

export const markAttendance = async (request: StudentAttendance) => {
  const response = await apiClient.post("/attendance/verify", request);

  return response.data;
};

export const getTodayAttendance = async () => {
  const response = await apiClient.get("/attendance/student/today");
  return response.data;
};

export const endSession = async (sessionId: number) => {
  const response = await apiClient.patch(`/attendance/end/${sessionId}`);
  return response.data;
};

export const toggleManualAttendance = async (
  request: ManualAttendanceRequest
) => {
  const response = await apiClient.post("/attendance/manual-toggle", request);
  return response.data;
};
