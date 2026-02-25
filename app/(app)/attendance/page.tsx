"use client"

import { useMemo, useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/local-storage"
import { toast } from "@/hooks/use-toast"
import { Calendar, Users, TrendingUp } from "lucide-react"

export default function AttendancePage() {
  const classes = db.classes.getAll()
  const students = db.students.getAll()
  const attendance = db.attendance.getAll()

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || "")
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10))
  const [presentMap, setPresentMap] = useState<Record<string, boolean>>({})
  const [isInitialized, setIsInitialized] = useState(false)

  const classStudents = useMemo(() => {
    const studentsPerClass = Math.ceil(students.length / classes.length)
    const classIndex = classes.findIndex((c) => c.id === selectedClassId)
    if (classIndex === -1) return []

    const startIndex = classIndex * studentsPerClass
    const endIndex = Math.min(startIndex + studentsPerClass, students.length)
    return students.slice(startIndex, endIndex)
  }, [students, classes, selectedClassId])

  const existingAttendance = useMemo(() => {
    return attendance.filter((a) => a.date === selectedDate && a.class_id === selectedClassId)
  }, [attendance, selectedDate, selectedClassId])

  const attendanceStats = useMemo(() => {
    const classAttendance = attendance.filter((a) => a.class_id === selectedClassId)
    const totalRecords = classAttendance.length
    const presentRecords = classAttendance.filter((a) => a.present).length
    const attendanceRate = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0

    return {
      totalRecords,
      presentRecords,
      attendanceRate,
    }
  }, [attendance, selectedClassId])

  useEffect(() => {
    if (existingAttendance.length > 0) {
      const newPresentMap: Record<string, boolean> = {}
      existingAttendance.forEach((record) => {
        newPresentMap[record.student_id] = record.present
      })
      setPresentMap(newPresentMap)
      setIsInitialized(true)
    } else if (classStudents.length > 0 && !isInitialized) {
      setPresentMap(Object.fromEntries(classStudents.map((s) => [s.id, true])))
      setIsInitialized(true)
    }
  }, [existingAttendance, classStudents.length, selectedClassId, selectedDate, isInitialized])

  useEffect(() => {
    setIsInitialized(false)
  }, [selectedClassId, selectedDate])

  const handleSaveAttendance = useCallback(() => {
    if (!selectedClassId) {
      toast({ title: "Error", description: "Please select a class", variant: "destructive" })
      return
    }

    classStudents.forEach((student) => {
      const present = presentMap[student.id] ?? true
      db.attendance.insert({
        student_id: student.id,
        class_id: selectedClassId,
        date: selectedDate,
        present,
      })
    })

    toast({
      title: "Success",
      description: `Attendance recorded for ${classStudents.length} students`,
    })
  }, [selectedClassId, classStudents, presentMap, selectedDate])

  const markAllPresent = useCallback(() => {
    setPresentMap(Object.fromEntries(classStudents.map((s) => [s.id, true])))
  }, [classStudents])

  const markAllAbsent = useCallback(() => {
    setPresentMap(Object.fromEntries(classStudents.map((s) => [s.id, false])))
  }, [classStudents])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
        <p className="text-gray-600">Track and manage student attendance records</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-teal-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Class Students</CardTitle>
            <Users className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{classStudents.length}</div>
            <p className="text-xs text-gray-500 mt-1">In selected class</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{attendanceStats.attendanceRate}%</div>
            <p className="text-xs text-gray-500 mt-1">Overall class average</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Records</CardTitle>
            <Calendar className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{attendanceStats.totalRecords}</div>
            <p className="text-xs text-gray-500 mt-1">Attendance entries</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-teal-600" />
            Mark Attendance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Select Class</label>
              <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} - Room {cls.room_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {existingAttendance.length > 0 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Attendance already recorded for this date. You can update the records below.
              </p>
            </div>
          )}

          <div className="border rounded-lg overflow-hidden">
            {classStudents.length === 0 ? (
              <div className="p-6 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No students found for the selected class</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                <div className="px-4 py-3 bg-gray-50 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">Students ({classStudents.length})</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={markAllPresent}>
                        Mark All Present
                      </Button>
                      <Button variant="outline" size="sm" onClick={markAllAbsent}>
                        Mark All Absent
                      </Button>
                    </div>
                  </div>
                </div>
                {classStudents.map((student) => (
                  <div key={student.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
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
                      <Checkbox
                        checked={presentMap[student.id] ?? true}
                        onCheckedChange={(checked) => setPresentMap((prev) => ({ ...prev, [student.id]: !!checked }))}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {classStudents.length > 0 && (
            <div className="flex justify-between items-center pt-4">
              <div className="text-sm text-gray-600">
                Present: {Object.values(presentMap).filter(Boolean).length} / {classStudents.length}
              </div>
              <Button onClick={handleSaveAttendance} className="bg-teal-600 hover:bg-teal-700">
                Save Attendance
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
