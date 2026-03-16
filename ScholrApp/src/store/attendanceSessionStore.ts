import { AttendanceSessionState } from "@/types/attendance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

const store = (set: any): AttendanceSessionState => ({
  sessionId: null,
  subjectName: "",
  subjectCode: "",
  semesterId: null,
  deptId: null,
  qrCode: null,
  topic: "",
  isActive: false,

  setSession: (qrCodeBase64, session) =>
    set({
      sessionId: session.sessionId,
      subjectName: session.subject.subjectName,
      subjectCode: session.subject.subjectCode,
      semesterId: session.subject.semester.id,
      deptId: session.subject.department.id,
      qrCode: qrCodeBase64,
      topic: session.topic,
      isActive: true,
    }),

  deleteSession: () =>
    set({
      sessionId: null,
      subjectName: "",
      qrCode: null,
      topic: "",
      isActive: false,
    }),
});
const useAttendanceSessionStore = create<AttendanceSessionState>()(
  persist(devtools(store), {
    name: "attendance-session-storage",
    storage: createJSONStorage(() => AsyncStorage),
  })
);

export default useAttendanceSessionStore;
