// Core types for the College Management System

export type ID = string

export type Student = {
  id: ID
  firstName: string
  lastName: string
  email: string
  phone?: string
  classId?: ID | null
  createdAt: number
  updatedAt: number
}

export type Teacher = {
  id: ID
  firstName: string
  lastName: string
  email: string
  phone?: string
  subjectIds: ID[]
  createdAt: number
  updatedAt: number
}

export type ClassRoom = {
  id: ID
  name: string
  teacherId?: ID | null
  subjectIds: ID[]
  createdAt: number
  updatedAt: number
}

export type Subject = {
  id: ID
  name: string
  createdAt: number
  updatedAt: number
}

export type Enrollment = {
  id: ID
  studentId: ID
  classId: ID
  createdAt: number
}

export type AttendanceRecord = {
  id: ID
  date: string // yyyy-mm-dd
  classId: ID
  studentId: ID
  present: boolean
}

export type GradeRecord = {
  id: ID
  studentId: ID
  subjectId: ID
  score: number // 0-100
  term: string // e.g., "Term 1"
  createdAt: number
}
