export interface AttendanceSessionState {
  sessionId: number | null;
  subjectName: string;
  qrCode: string | null;
  topic: string;
  isActive: boolean;

  setSession: (qrData: string, session: any) => void;
  deleteSession: () => void;
}
export interface StartAttendanceRequest {
  subjectName: string;
  semester: number;
  topic: string;
  teacherLat: number;
  teacherLng: number;
}
