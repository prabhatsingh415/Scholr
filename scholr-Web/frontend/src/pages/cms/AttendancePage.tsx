"use client";
import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/lib/local-storage";
import { toast } from "@/hooks/use-toast";
import { Calendar, QrCode, TrendingUp, Users } from "lucide-react";
import { useAuthStore } from "@/stores/use-auth-store";
import { QRCodeCanvas } from "qrcode.react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { api } from "@/lib/api";

type QrPayload = {
    type: "attendance";
    class_id: string;
    subject_id: string;
    date: string;
};
const SCANNER_ID = "qr-reader-container";
type StudentAttendanceView = "my" | "mark";
export default function AttendancePage() {
    const user = useAuthStore((state) => state.user);
    const canManage = user?.role !== "student";
    const defaultTab = canManage ? "manual" : "qr";
    /** Students always land on My Attendance first; switch via buttons */
    const [studentView, setStudentView] = useState<StudentAttendanceView>("my");
    const [classes, setClasses] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [attendance, setAttendance] = useState<any[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [presentMap, setPresentMap] = useState<Record<string, boolean>>({});
    const [isInitialized, setIsInitialized] = useState(false);
    const [scanValue, setScanValue] = useState<string>("");
    const [isScanning, setIsScanning] = useState(false);
    const [scannerError, setScannerError] = useState<string | null>(null);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    useEffect(() => {
        const loadedClasses = db.classes.getAll();
        setClasses(loadedClasses);
        setStudents(db.students.getAll());
        setSubjects(db.subjects.getAll());
        setAttendance(db.attendance.getAll());
        setSelectedDate(new Date().toISOString().slice(0, 10));
        if (loadedClasses.length > 0) {
            setSelectedClassId(loadedClasses[0].id);
        }
    }, []);
    const classStudents = useMemo(() => {
        if (!classes.length || !students.length)
            return [];
        const studentsPerClass = Math.ceil(students.length / classes.length);
        const classIndex = classes.findIndex((c) => c.id === selectedClassId);
        if (classIndex === -1)
            return [];
        const startIndex = classIndex * studentsPerClass;
        const endIndex = Math.min(startIndex + studentsPerClass, students.length);
        return students.slice(startIndex, endIndex);
    }, [students, classes, selectedClassId]);
    const selectedClass = useMemo(() => {
        return classes.find((c) => c.id === selectedClassId) ?? null;
    }, [classes, selectedClassId]);
    const classSubjects = useMemo(() => {
        if (!selectedClass)
            return [];
        const subjectIds: string[] = selectedClass.subject_ids ?? [];
        return subjects.filter((subject) => subjectIds.includes(subject.id));
    }, [selectedClass, subjects]);
    const currentStudent = useMemo(() => {
        if (user?.role !== "student")
            return null;
        const email = user.email?.toLowerCase();
        const matchByEmail = email ? students.find((s) => s.email?.toLowerCase() === email) : null;
        return matchByEmail ?? students[0] ?? null;
    }, [students, user]);
    const myAttendance = useMemo(() => {
        if (!currentStudent)
            return [];
        return attendance
            .filter((a) => a.student_id === currentStudent.id)
            .slice()
            .sort((a, b) => {
                const aTime = new Date(String(a.date)).getTime() || 0;
                const bTime = new Date(String(b.date)).getTime() || 0;
                return bTime - aTime;
            });
    }, [attendance, currentStudent]);
    const myAttendanceStats = useMemo(() => {
        const total = myAttendance.length;
        const presentCount = myAttendance.filter((a) => Boolean(a.present)).length;
        const rate = total > 0 ? Math.round((presentCount / total) * 100) : 0;
        return { total, presentCount, rate };
    }, [myAttendance]);
    const parseQrPayload = useCallback((raw: string): QrPayload | null => {
        if (!raw)
            return null;
        try {
            const parsed = JSON.parse(raw) as Partial<QrPayload>;
            if (parsed?.type !== "attendance")
                return null;
            if (typeof parsed.class_id !== "string")
                return null;
            if (typeof parsed.subject_id !== "string")
                return null;
            if (typeof parsed.date !== "string")
                return null;
            return parsed as QrPayload;
        }
        catch {
            return null;
        }
    }, []);
    const scanPreview = useMemo(() => {
        return parseQrPayload(scanValue.trim());
    }, [parseQrPayload, scanValue]);
    const existingAttendance = useMemo(() => {
        return attendance.filter((a) => a.date === selectedDate && a.class_id === selectedClassId && a.source !== "qr");
    }, [attendance, selectedDate, selectedClassId]);
    const attendanceStats = useMemo(() => {
        const classAttendance = attendance.filter((a) => a.class_id === selectedClassId);
        const totalRecords = classAttendance.length;
        const presentRecords = classAttendance.filter((a) => a.present).length;
        const attendanceRate = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0;
        return { totalRecords, presentRecords, attendanceRate };
    }, [attendance, selectedClassId]);
    useEffect(() => {
        if (existingAttendance.length > 0) {
            const newPresentMap: Record<string, boolean> = {};
            existingAttendance.forEach((record) => {
                newPresentMap[record.student_id] = record.present;
            });
            setPresentMap(newPresentMap);
            setIsInitialized(true);
        }
        else if (classStudents.length > 0 && !isInitialized) {
            setPresentMap(Object.fromEntries(classStudents.map((s) => [s.id, true])));
            setIsInitialized(true);
        }
    }, [existingAttendance, classStudents, isInitialized]);
    useEffect(() => {
        setIsInitialized(false);
    }, [selectedClassId, selectedDate]);
    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(() => null);
                scannerRef.current = null;
            }
        };
    }, []);
    useEffect(() => {
        if (!isScanning) {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(() => null);
                scannerRef.current = null;
            }
            return;
        }
        setScannerError(null);
        try {
            const scanner = new Html5QrcodeScanner(SCANNER_ID, { fps: 10, qrbox: 250 }, false);
            scannerRef.current = scanner;
            scanner.render((decodedText) => {
                setScanValue(decodedText);
                setIsScanning(false);
                scanner.clear().catch(() => null);
                scannerRef.current = null;
            }, (err) => {
                // html5-qrcode fires frequent decode errors while scanning; show only meaningful ones
                const message = typeof err === "string" ? err : err?.message ?? "Unable to scan QR code.";
                if (!message.toLowerCase().includes("not found")) {
                    setScannerError(message);
                }
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Camera unavailable. Check permissions.";
            setScannerError(message);
            setIsScanning(false);
        }
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(() => null);
                scannerRef.current = null;
            }
        };
    }, [isScanning]);
    useEffect(() => {
        if (!canManage && studentView === "my") {
            setIsScanning(false);
        }
    }, [studentView, canManage]);
    const handleSaveAttendance = useCallback(() => {
        if (!selectedClassId) {
            toast({ title: "Error", description: "Please select a class", variant: "destructive" });
            return;
        }
        classStudents.forEach((student) => {
            const present = presentMap[student.id] ?? true;
            db.attendance.insert({
                student_id: student.id,
                class_id: selectedClassId,
                date: selectedDate,
                present,
                source: "manual",
            });
        });
        setAttendance(db.attendance.getAll());
        toast({
            title: "Success",
            description: `Attendance recorded for ${classStudents.length} students`,
        });
    }, [selectedClassId, classStudents, presentMap, selectedDate]);
    const markAllPresent = useCallback(() => {
        setPresentMap(Object.fromEntries(classStudents.map((s) => [s.id, true])));
    }, [classStudents]);
    const markAllAbsent = useCallback(() => {
        setPresentMap(Object.fromEntries(classStudents.map((s) => [s.id, false])));
    }, [classStudents]);
    const buildQrPayload = useCallback((subjectId: string) => {
        if (!selectedClassId || !selectedDate) {
            return "";
        }
        const payload: QrPayload = {
            type: "attendance",
            class_id: selectedClassId,
            subject_id: subjectId,
            date: selectedDate,
        };
        return JSON.stringify(payload);
    }, [selectedClassId, selectedDate]);
    const handleQrAttendance = useCallback(() => {
        const payload = scanPreview;
        if (!payload) {
            toast({ title: "Invalid QR code", description: "Please scan a valid attendance QR.", variant: "destructive" });
            return;
        }
        if (!currentStudent) {
            toast({ title: "Student profile missing", description: "Could not match your student profile.", variant: "destructive" });
            return;
        }
        const classExists = classes.some((cls) => cls.id === payload.class_id);
        const subjectExists = subjects.some((subject) => subject.id === payload.subject_id);
        if (!classExists || !subjectExists) {
            toast({ title: "Invalid QR code", description: "QR code references missing class or subject.", variant: "destructive" });
            return;
        }
        const alreadyMarked = attendance.some((record) => record.student_id === currentStudent.id
            && record.class_id === payload.class_id
            && record.date === payload.date
            && record.subject_id === payload.subject_id
            && record.source === "qr");
        if (alreadyMarked) {
            toast({ title: "Already marked", description: "Attendance already recorded for this QR." });
            return;
        }
        
        api.attendance.verify({
            studentLat: 26.9125, // Fallback/mock value for geolocation
            studentLng: 75.7874,
            token: scanPreview.token || "mocked-token",
            deviceId: "web-browser"
        }).then(() => {
            setAttendance(db.attendance.getAll()); 
            setScanValue("");
            setIsScanning(false);
            toast({ title: "Success", description: "Attendance marked via QR code." });
        }).catch((err) => {
            toast({ title: "Error", description: err.response?.data?.message || "Failed to verify attendance.", variant: "destructive" });
        });
    }, [scanPreview, currentStudent, classes, subjects, attendance]);
    if (!selectedDate)
        return null;
    return (<div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
        <p className="text-gray-600">{canManage
            ? "Track and manage student attendance records"
            : studentView === "my"
                ? "View your attendance summary and recent records."
                : "Scan the subject QR to mark your attendance, or paste the QR code text below."}</p>
      </div>

      {!canManage && (<div className="flex flex-wrap gap-3">
        <Button type="button" variant={studentView === "my" ? "default" : "outline"} className={studentView === "my"
            ? "bg-gradient-to-r from-[#123B7A] to-[#1C58B0] hover:from-[#102f62] hover:to-[#184b97] text-white shadow-sm"
            : "border-[#CCD4E3] text-[#112F68] hover:bg-[#F3F6FF]"} onClick={() => setStudentView("my")}>
          My Attendance
        </Button>
        <Button type="button" variant={studentView === "mark" ? "default" : "outline"} className={studentView === "mark"
            ? "bg-gradient-to-r from-[#123B7A] to-[#1C58B0] hover:from-[#102f62] hover:to-[#184b97] text-white shadow-sm"
            : "border-[#CCD4E3] text-[#112F68] hover:bg-[#F3F6FF]"} onClick={() => setStudentView("mark")}>
          Mark Attendance
        </Button>
      </div>)}

      {!canManage && studentView === "my" && (<Card className="border-l-4 border-l-teal-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">My Attendance</CardTitle>
          <TrendingUp className="h-4 w-4 text-teal-600"/>
        </CardHeader>
        <CardContent>
          {currentStudent ? (<>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="text-2xl font-bold text-gray-900">{myAttendanceStats.rate}%</div>
                <div className="text-xs text-gray-500 mt-1">Overall rate</div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="text-2xl font-bold text-gray-900">{myAttendanceStats.presentCount}</div>
                <div className="text-xs text-gray-500 mt-1">Present</div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="text-2xl font-bold text-gray-900">{myAttendanceStats.total}</div>
                <div className="text-xs text-gray-500 mt-1">Total records</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Recent records</h3>
                <p className="text-xs text-gray-500">Latest 8</p>
              </div>

              <div className="mt-3 space-y-2">
                {myAttendance.length > 0 ? (myAttendance.slice(0, 8).map((record) => {
                    const cls = classes.find((c) => c.id === record.class_id);
                    const subject = subjects.find((s) => s.id === record.subject_id);
                    return (<div key={`${record.student_id}-${record.class_id}-${record.subject_id}-${record.date}-${record.source || ""}`} className="flex items-start justify-between gap-3 rounded-lg border border-gray-200 bg-white p-3">
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{subject?.name || record.subject_id}</div>
                        <div className="text-xs text-gray-500 truncate">{cls?.name || record.class_id}</div>
                        <div className="text-xs text-gray-500">{String(record.date)}</div>
                      </div>
                      <Badge variant={record.present ? "default" : "secondary"}>
                        {record.present ? "Present" : "Absent"}
                      </Badge>
                    </div>);
                })) : (<p className="text-sm text-gray-500 mt-2">No attendance records found yet. Ask your faculty/admin to mark attendance.</p>)}
              </div>
            </div>
          </>) : (<p className="text-sm text-red-600">Your student profile is not linked. Ask admin to map your account.</p>)}
        </CardContent>
      </Card>)}

      {canManage && (<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-teal-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Class Students</CardTitle>
            <Users className="h-4 w-4 text-teal-600"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{classStudents.length}</div>
            <p className="text-xs text-gray-500 mt-1">In selected class</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{attendanceStats.attendanceRate}%</div>
            <p className="text-xs text-gray-500 mt-1">Overall class average</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Records</CardTitle>
            <Calendar className="h-4 w-4 text-emerald-600"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{attendanceStats.totalRecords}</div>
            <p className="text-xs text-gray-500 mt-1">Attendance entries</p>
          </CardContent>
        </Card>
      </div>)}

      {(canManage || (!canManage && studentView === "mark")) && (<Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-teal-600"/>
            Mark Attendance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {canManage && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Select Class</label>
              <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a class"/>
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (<SelectItem key={cls.id} value={cls.id}>
                      {cls.name} - Room {cls.room_number}
                    </SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date</label>
              <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full"/>
            </div>
          </div>)}

          <Tabs defaultValue={defaultTab} className="space-y-4">
            {canManage && (<TabsList className="w-full justify-start">
                <TabsTrigger value="manual">Manual</TabsTrigger>
                <TabsTrigger value="qr">QR Attendance</TabsTrigger>
              </TabsList>)}

            {canManage && (<TabsContent value="manual" className="space-y-6">
              {existingAttendance.length > 0 && (<div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Manual attendance already recorded for this date. You can update the records below.
                  </p>
                </div>)}

              <div className="border rounded-lg overflow-hidden">
                {classStudents.length === 0 ? (<div className="p-6 text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-3"/>
                    <p className="text-gray-500">No students found for the selected class</p>
                  </div>) : (<div className="divide-y divide-gray-200">
                    <div className="px-4 py-3 bg-gray-50 border-b">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">Students ({classStudents.length})</h3>
                        {canManage && (<div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={markAllPresent}>
                              Mark All Present
                            </Button>
                            <Button variant="outline" size="sm" onClick={markAllAbsent}>
                              Mark All Absent
                            </Button>
                          </div>)}
                      </div>
                    </div>
                    {classStudents.map((student) => (<div key={student.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 bg-teal-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-teal-800">
                                {student.first_name[0]}
                                {student.last_name[0]}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {student.first_name} {student.last_name}
                            </p>
                            <p className="text-sm text-gray-500">{student.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={presentMap[student.id] ? "default" : "secondary"}>
                            {presentMap[student.id] ? "Present" : "Absent"}
                          </Badge>
                          <Checkbox checked={presentMap[student.id] ?? true} disabled={!canManage} onCheckedChange={(checked) => setPresentMap((prev) => ({ ...prev, [student.id]: !!checked }))}/>
                        </div>
                      </div>))}
                  </div>)}
              </div>

              {classStudents.length > 0 && (<div className="flex justify-between items-center pt-4">
                  <div className="text-sm text-gray-600">
                    Present: {Object.values(presentMap).filter(Boolean).length} / {classStudents.length}
                  </div>
                  {canManage && (<Button onClick={handleSaveAttendance} className="bg-teal-600 hover:bg-teal-700">
                      Save Attendance
                    </Button>)}
                </div>)}
            </TabsContent>)}

            <TabsContent value="qr" className="space-y-6">
              {canManage ? (<div className="space-y-4">
                  <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                    <QrCode className="h-5 w-5 mt-0.5 text-amber-600"/>
                    <div>
                      <p className="font-medium">Generate subject-wise QR codes</p>
                      <p className="text-xs text-amber-800">Each subject in the selected class gets its own QR for {selectedDate}.</p>
                    </div>
                  </div>

                  {!selectedClassId ? (<div className="rounded-lg border border-dashed p-6 text-center text-sm text-gray-500">
                      Select a class to generate QR codes.
                    </div>) : classSubjects.length === 0 ? (<div className="rounded-lg border border-dashed p-6 text-center text-sm text-gray-500">
                      No subjects assigned to this class yet.
                    </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {classSubjects.map((subject) => {
                        const payload = buildQrPayload(subject.id);
                        return (<div key={subject.id} className="rounded-lg border bg-white p-4 shadow-sm">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{subject.name}</p>
                                <p className="text-xs text-gray-500">{selectedClass?.name ?? "Selected class"}</p>
                                <p className="text-xs text-gray-500">Date: {selectedDate}</p>
                              </div>
                              <Badge variant="secondary">QR</Badge>
                            </div>
                            <div className="mt-4 flex items-center gap-4">
                              <div className="rounded-md border bg-white p-2">
                                {payload && (<QRCodeCanvas value={payload} size={124}/>)}
                              </div>
                              <div className="text-xs text-gray-500 space-y-2">
                                <p>Students scan to mark attendance for this subject.</p>
                                <p className="text-[10px] text-gray-400 break-all">Code: {payload}</p>
                              </div>
                            </div>
                          </div>);
                      })}
                    </div>)}
                </div>) : (<div className="space-y-4">
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
                    Scan the subject QR to mark your attendance. If you cannot scan, paste the QR code text below.
                  </div>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" onClick={() => {
                            setScannerError(null);
                            setIsScanning((prev) => !prev);
                        }}>
                      {isScanning ? "Stop Camera" : "Scan with Camera"}
                    </Button>
                    {isScanning && (<span className="text-xs text-gray-500">Point your camera at the QR; it will auto-fill.</span>)}
                  </div>
                  {isScanning && (<div className="rounded-lg border bg-white p-3">
                      <div id={SCANNER_ID} className="w-full min-h-[260px] rounded-md overflow-hidden"/>
                    </div>)}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">QR Code</label>
                    <Input value={scanValue} onChange={(e) => setScanValue(e.target.value)} placeholder="Paste QR code content"/>
                    {scanValue.trim().length > 0 && !scanPreview && (<p className="text-xs text-red-600">Invalid QR format. Try scanning again.</p>)}
                    {scanPreview && (<div className="rounded-lg border bg-white p-3 text-xs text-gray-600 space-y-1">
                        <p>
                          Class: {classes.find((cls) => cls.id === scanPreview.class_id)?.name ?? scanPreview.class_id}
                        </p>
                        <p>
                          Subject: {subjects.find((subject) => subject.id === scanPreview.subject_id)?.name ?? scanPreview.subject_id}
                        </p>
                        <p>Date: {scanPreview.date}</p>
                      </div>)}
                    {scannerError && (<p className="text-xs text-red-600">{scannerError}</p>)}
                    {!currentStudent && (<p className="text-xs text-red-600">Your student profile is not linked. Ask admin to map your account.</p>)}
                  </div>
                  <Button onClick={handleQrAttendance} className="bg-teal-600 hover:bg-teal-700" disabled={!scanPreview || !currentStudent}>
                    Mark Attendance
                  </Button>
                </div>)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>)}
    </div>);
}
