"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Users, GraduationCap, School, BookOpen, TrendingUp, Calendar, ClipboardList } from "lucide-react"
import { db, auth, User } from "@/lib/local-storage"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Hydration fix: Only render after component has mounted on the client
  useEffect(() => {
    setUser(auth.getUser());
    setIsMounted(true);
  }, []);

  // Show nothing (or a loader) while server rendering to prevent Hydration Mismatch
  if (!isMounted) {
    return <div className="flex h-[50vh] items-center justify-center text-gray-500">Loading dashboard...</div>;
  }

  // Render different dashboards based on role
  if (user?.role === 'admin') return <AdminDashboard />;
  if (user?.role === 'teacher') return <FacultyDashboard />;
  if (user?.role === 'student') return <StudentDashboard />;

  return <div>Please log in to view the dashboard.</div>;
}

// ==========================================
// 1. ADMIN DASHBOARD
// ==========================================
function AdminDashboard() {
  const students = db.students.getAll()
  const teachers = db.teachers.getAll()
  const classes = db.classes.getAll()
  const subjects = db.subjects.getAll()
  const grades = db.grades.getAll()
  const attendance = db.attendance.getAll()

  const stats = useMemo(() => {
    const totalStudents = students.length
    const totalTeachers = teachers.length
    const totalClasses = classes.length
    const totalSubjects = subjects.length

    const avgGrade = grades.length > 0 ? (grades.reduce((sum, g) => sum + g.score, 0) / grades.length).toFixed(1) : "0"
    const totalAttendanceRecords = attendance.length
    const presentRecords = attendance.filter((a) => a.present).length
    const attendanceRate = totalAttendanceRecords > 0 ? ((presentRecords / totalAttendanceRecords) * 100).toFixed(1) : "0"

    return { totalStudents, totalTeachers, totalClasses, totalSubjects, avgGrade, attendanceRate }
  }, [students, teachers, classes, subjects, grades, attendance])

  const gradeDistribution = useMemo(() => {
    const ranges = [
      { name: "90-100", min: 90, max: 100, count: 0, color: "#10b981" },
      { name: "80-89", min: 80, max: 89, count: 0, color: "#3b82f6" },
      { name: "70-79", min: 70, max: 79, count: 0, color: "#f59e0b" },
      { name: "60-69", min: 60, max: 69, count: 0, color: "#ef4444" },
      { name: "Below 60", min: 0, max: 59, count: 0, color: "#6b7280" },
    ]
    grades.forEach((grade) => {
      const range = ranges.find((r) => grade.score >= r.min && grade.score <= r.max)
      if (range) range.count++
    })
    return ranges.filter((r) => r.count > 0)
  }, [grades])

  const attendanceData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split("T")[0]
    }).reverse()

    return last7Days.map((date) => {
      const dayAttendance = attendance.filter((a) => a.date === date)
      const present = dayAttendance.filter((a) => a.present).length
      const total = dayAttendance.length
      const rate = total > 0 ? (present / total) * 100 : 0
      return { date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }), rate: Math.round(rate) }
    })
  }, [attendance])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-teal-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle>
            <Users className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalStudents}</div>
            <p className="text-xs text-gray-500 mt-1">Active enrollments</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Teachers</CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalTeachers}</div>
            <p className="text-xs text-gray-500 mt-1">Faculty members</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Classes</CardTitle>
            <School className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalClasses}</div>
            <p className="text-xs text-gray-500 mt-1">Active classes</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.attendanceRate}%</div>
            <p className="text-xs text-gray-500 mt-1">This week average</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-teal-600" />
              Attendance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, "Attendance Rate"]} />
                <Bar dataKey="rate" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-600" />
              Grade Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={gradeDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="count" label={({ name, count }) => `${name}: ${count}`}>
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ==========================================
// 2. FACULTY DASHBOARD 
// ==========================================
function FacultyDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">My Classes</CardTitle>
            <School className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-gray-900">3</div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle>
            <Users className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-gray-900">85</div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Grades</CardTitle>
            <ClipboardList className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-gray-900">12</div></CardContent>
        </Card>
      </div>
    </div>
  )
}

// ==========================================
// 3. STUDENT DASHBOARD
// ==========================================
function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-teal-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">My Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-gray-900">92%</div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Current GPA</CardTitle>
            <BookOpen className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-gray-900">3.8</div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Fees</CardTitle>
            <Calendar className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-gray-900">₹0</div></CardContent>
        </Card>
      </div>
    </div>
  )
}