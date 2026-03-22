export interface AttendanceSessionState {
  sessionId: number | null;
  subjectName: string;
  subjectCode: string;
  semesterId: number | null;
  deptId: number | null;
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

export interface QRCredentials {
  subjectName: string;
  semesterNo: number;
  qrCode: string | null;
  topic: string;
  setShowQr: (value: boolean) => void;
}

export interface FetchStudentAttendance {
  subjectCode: string | null;
  semesterId: number | null;
  deptId: number | null;
  sessionId: number | null;
}

export interface StudentAttendance {
  studentLat: number | null;
  studentLng: number | null;
  token: string | null;
  deviceId: string | null;
}

export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  LATE = "LATE",
}

export interface ManualAttendanceRequest {
  collegeId: string;
  sessionId: number;
  status: AttendanceStatus;
}
