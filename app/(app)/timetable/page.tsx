"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// local-storage helpers are loaded dynamically on the client to avoid server-side localStorage access
import { toast } from "@/hooks/use-toast"
import { Plus, Clock, Edit, Trash2 } from "lucide-react"

interface TimetableEntry {
  id: string
  class_id: string
  subject_id: string
  teacher_id: string
  day: string
  start_time: string
  end_time: string
  room: string
}

interface ClassType {
  id: string
  name: string
}

interface SubjectType {
  id: string
  name: string
}

interface TeacherType {
  id: string
  full_name: string
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]

export default function TimetablePage() {
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [open, setOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null)
  const [formData, setFormData] = useState({
    class_id: "",
    subject_id: "",
    teacher_id: "",
    day: "",
    start_time: "",
    end_time: "",
    room: "",
  })

  const [classes, setClasses] = useState<ClassType[]>([])
  const [subjects, setSubjects] = useState<SubjectType[]>([])
  const [teachers, setTeachers] = useState<TeacherType[]>([])
  const [timetable, setTimetable] = useState<TimetableEntry[]>([])

  useEffect(() => {
    let mounted = true
    // dynamically import the module that accesses localStorage so it only runs on the client
    import("@/lib/local-storage")
      .then((mod) => {
        if (!mounted) return
        try {
          setClasses(mod.getClasses() as ClassType[])
          setSubjects(mod.getSubjects() as SubjectType[])
          setTeachers(mod.getTeachers() as TeacherType[])
        } catch (err) {
          // if the helper throws, fall back to empty arrays
          console.error("Failed to load classes/subjects/teachers from local-storage", err)
          setClasses([])
          setSubjects([])
          setTeachers([])
        }

        try {
          const stored = localStorage.getItem("timetable")
          if (stored) {
            setTimetable(JSON.parse(stored))
          }
        } catch (err) {
          console.error("Failed to read timetable from localStorage", err)
          setTimetable([])
        }
      })
      .catch((err) => {
        console.error("Failed to dynamically import local-storage helpers", err)
      })

    return () => {
      mounted = false
    }
  }, [])

  const filteredTimetable = useMemo(() => {
    if (!selectedClass) return []
    return timetable.filter((entry: TimetableEntry) => entry.class_id === selectedClass)
  }, [timetable, selectedClass])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.class_id ||
      !formData.subject_id ||
      !formData.teacher_id ||
      !formData.day ||
      !formData.start_time ||
      !formData.room
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    let updatedTimetable
    if (editingEntry) {
      updatedTimetable = timetable.map((entry: TimetableEntry) =>
        entry.id === editingEntry.id ? { ...editingEntry, ...formData } : entry,
      )
      toast({ title: "Success", description: "Timetable entry updated successfully." })
    } else {
      const newEntry: TimetableEntry = {
        id: crypto.randomUUID(),
        ...formData,
      }
      updatedTimetable = [...timetable, newEntry]
      toast({ title: "Success", description: "Timetable entry added successfully." })
    }

    localStorage.setItem("timetable", JSON.stringify(updatedTimetable))
    setTimetable(updatedTimetable)
    setOpen(false)
    setEditingEntry(null)
    resetForm()
  }

  const handleEdit = (entry: TimetableEntry) => {
    setEditingEntry(entry)
    setFormData({
      class_id: entry.class_id,
      subject_id: entry.subject_id,
      teacher_id: entry.teacher_id,
      day: entry.day,
      start_time: entry.start_time,
      end_time: entry.end_time,
      room: entry.room,
    })
    setOpen(true)
  }

  const handleDelete = (entryId: string) => {
    const updatedTimetable = timetable.filter((entry: TimetableEntry) => entry.id !== entryId)
    localStorage.setItem("timetable", JSON.stringify(updatedTimetable))
    setTimetable(updatedTimetable)
    toast({ title: "Success", description: "Timetable entry deleted successfully." })
  }

  const resetForm = () => {
    setFormData({
      class_id: "",
      subject_id: "",
      teacher_id: "",
      day: "",
      start_time: "",
      end_time: "",
      room: "",
    })
  }

  const handleOpenDialog = () => {
    setEditingEntry(null)
    resetForm()
    setOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="h-8 w-8 text-teal-600" />
            Timetable Management
          </h1>
          <p className="text-gray-600">Manage class schedules and time slots</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={handleOpenDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Schedule
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Class Schedule</CardTitle>
          <div className="flex items-center gap-4">
            <Label>Select Class:</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Choose a class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {selectedClass ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-3 text-left font-medium">Time</th>
                    {DAYS.map((day) => (
                      <th key={day} className="border border-gray-300 p-3 text-center font-medium">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.map((time) => (
                    <tr key={time}>
                      <td className="border border-gray-300 p-3 font-medium bg-gray-50">{time}</td>
                      {DAYS.map((day) => {
                        const entry = filteredTimetable.find(
                          (e: TimetableEntry) => e.day === day && e.start_time === time,
                        )
                        const subject = entry ? subjects.find((s) => s.id === entry.subject_id) : null
                        const teacher = entry ? teachers.find((t) => t.id === entry.teacher_id) : null

                        return (
                          <td key={day} className="border border-gray-300 p-3 text-center">
                            {entry ? (
                              <div className="bg-teal-100 p-2 rounded text-sm relative group">
                                <div className="font-medium text-teal-800">{subject?.name}</div>
                                <div className="text-teal-600">{teacher?.full_name}</div>
                                <div className="text-xs text-teal-500">Room: {entry.room}</div>
                                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 hover:bg-teal-200"
                                    onClick={() => handleEdit(entry)}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 hover:bg-red-200"
                                    onClick={() => handleDelete(entry.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="text-gray-400 text-sm">Free</div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">Please select a class to view its timetable</div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingEntry ? "Edit" : "Add"} Timetable Entry</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Class *</Label>
              <Select
                value={formData.class_id}
                onValueChange={(value) => setFormData({ ...formData, class_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Subject *</Label>
              <Select
                value={formData.subject_id}
                onValueChange={(value) => setFormData({ ...formData, subject_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Teacher *</Label>
              <Select
                value={formData.teacher_id}
                onValueChange={(value) => setFormData({ ...formData, teacher_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers && teachers.length > 0 ? (
                    teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.full_name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      No teachers available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Day *</Label>
                <Select value={formData.day} onValueChange={(value) => setFormData({ ...formData, day: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Room *</Label>
                <Input
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  placeholder="Room number"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time *</Label>
                <Select
                  value={formData.start_time}
                  onValueChange={(value) => setFormData({ ...formData, start_time: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Start" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>End Time</Label>
                <Select
                  value={formData.end_time}
                  onValueChange={(value) => setFormData({ ...formData, end_time: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="End" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white flex-1">
                {editingEntry ? "Update" : "Add"} Entry
              </Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

