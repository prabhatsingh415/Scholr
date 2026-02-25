// LocalStorage-backed data layer with simple CRUD utilities

import type { AttendanceRecord, ClassRoom, Enrollment, GradeRecord, ID, Student, Subject, Teacher } from "./types"

const KEYS = {
  students: "sms_students",
  teachers: "sms_teachers",
  classes: "sms_classes",
  subjects: "sms_subjects",
  enrollments: "sms_enrollments",
  attendance: "sms_attendance",
  grades: "sms_grades",
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function uid(): ID {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID()
  return `id_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

export function now() {
  return Date.now()
}

function readList<T>(key: string): T[] {
  if (typeof window === "undefined") return []
  return safeParse<T[]>(localStorage.getItem(key), [])
}
function writeList<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}

export const db = {
  // Students
  getStudents(): Student[] {
    return readList<Student>(KEYS.students)
  },
  addStudent(input: Omit<Student, "id" | "createdAt" | "updatedAt">): Student {
    const list = db.getStudents()
    const item: Student = { ...input, id: uid(), createdAt: now(), updatedAt: now() }
    writeList(KEYS.students, [item, ...list])
    return item
  },
  updateStudent(id: ID, updates: Partial<Student>): Student | null {
    const list = db.getStudents()
    const idx = list.findIndex((s) => s.id === id)
    if (idx === -1) return null
    const updated = { ...list[idx], ...updates, updatedAt: now() }
    list[idx] = updated
    writeList(KEYS.students, list)
    return updated
  },
  deleteStudent(id: ID) {
    const list = db.getStudents().filter((s) => s.id !== id)
    writeList(KEYS.students, list)
  },

  // Teachers
  getTeachers(): Teacher[] {
    return readList<Teacher>(KEYS.teachers)
  },
  addTeacher(input: Omit<Teacher, "id" | "createdAt" | "updatedAt">): Teacher {
    const list = db.getTeachers()
    const item: Teacher = { ...input, id: uid(), createdAt: now(), updatedAt: now() }
    writeList(KEYS.teachers, [item, ...list])
    return item
  },
  updateTeacher(id: ID, updates: Partial<Teacher>): Teacher | null {
    const list = db.getTeachers()
    const idx = list.findIndex((t) => t.id === id)
    if (idx === -1) return null
    const updated = { ...list[idx], ...updates, updatedAt: now() }
    list[idx] = updated
    writeList(KEYS.teachers, list)
    return updated
  },
  deleteTeacher(id: ID) {
    const list = db.getTeachers().filter((t) => t.id !== id)
    writeList(KEYS.teachers, list)
  },

  // Classes
  getClasses(): ClassRoom[] {
    return readList<ClassRoom>(KEYS.classes)
  },
  addClass(input: Omit<ClassRoom, "id" | "createdAt" | "updatedAt">): ClassRoom {
    const list = db.getClasses()
    const item: ClassRoom = { ...input, id: uid(), createdAt: now(), updatedAt: now() }
    writeList(KEYS.classes, [item, ...list])
    return item
  },
  updateClass(id: ID, updates: Partial<ClassRoom>): ClassRoom | null {
    const list = db.getClasses()
    const idx = list.findIndex((c) => c.id === id)
    if (idx === -1) return null
    const updated = { ...list[idx], ...updates, updatedAt: now() }
    list[idx] = updated
    writeList(KEYS.classes, list)
    return updated
  },
  deleteClass(id: ID) {
    const list = db.getClasses().filter((c) => c.id !== id)
    writeList(KEYS.classes, list)
  },

  // Subjects
  getSubjects(): Subject[] {
    return readList<Subject>(KEYS.subjects)
  },
  addSubject(input: Omit<Subject, "id" | "createdAt" | "updatedAt">): Subject {
    const list = db.getSubjects()
    const item: Subject = { ...input, id: uid(), createdAt: now(), updatedAt: now() }
    writeList(KEYS.subjects, [item, ...list])
    return item
  },
  updateSubject(id: ID, updates: Partial<Subject>): Subject | null {
    const list = db.getSubjects()
    const idx = list.findIndex((s) => s.id === id)
    if (idx === -1) return null
    const updated = { ...list[idx], ...updates, updatedAt: now() }
    list[idx] = updated
    writeList(KEYS.subjects, list)
    return updated
  },
  deleteSubject(id: ID) {
    const list = db.getSubjects().filter((s) => s.id !== id)
    writeList(KEYS.subjects, list)
  },

  // Enrollments
  getEnrollments(): Enrollment[] {
    return readList<Enrollment>(KEYS.enrollments)
  },
  addEnrollment(input: Omit<Enrollment, "id" | "createdAt">): Enrollment {
    const list = db.getEnrollments()
    const item: Enrollment = { ...input, id: uid(), createdAt: now() }
    writeList(KEYS.enrollments, [item, ...list])
    return item
  },
  deleteEnrollment(id: ID) {
    const list = db.getEnrollments().filter((e) => e.id !== id)
    writeList(KEYS.enrollments, list)
  },

  // Attendance
  getAttendance(): AttendanceRecord[] {
    return readList<AttendanceRecord>(KEYS.attendance)
  },
  setAttendanceForDateClass(date: string, classId: ID, records: AttendanceRecord[]) {
    const all = db.getAttendance().filter((r) => !(r.date === date && r.classId === classId))
    writeList(KEYS.attendance, [...records, ...all])
  },

  // Grades
  getGrades(): GradeRecord[] {
    return readList<GradeRecord>(KEYS.grades)
  },
  addGrade(input: Omit<GradeRecord, "id" | "createdAt">): GradeRecord {
    const list = db.getGrades()
    const item: GradeRecord = { ...input, id: uid(), createdAt: now() }
    writeList(KEYS.grades, [item, ...list])
    return item
  },
  deleteGrade(id: ID) {
    const list = db.getGrades().filter((g) => g.id !== id)
    writeList(KEYS.grades, list)
  },
}
