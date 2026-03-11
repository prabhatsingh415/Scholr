import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, GraduationCap, School, BookOpen, TrendingUp, Calendar, ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from "@/components/app-shell/Sidebar";
import Topbar from "@/components/app-shell/Topbar";
import { cmsAuth, type CmsUser } from "@/lib/cms-auth";
const sampleStudents = [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }];
const sampleTeachers = [{ id: "1" }, { id: "2" }, { id: "3" }];
const sampleClasses = [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }];
const sampleSubjects = [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }];
const sampleGrades = [{ score: 95 }, { score: 87 }, { score: 78 }, { score: 91 }, { score: 66 }, { score: 58 }];
const sampleAttendance = [
    { date: "2026-02-22", present: true },
    { date: "2026-02-22", present: false },
    { date: "2026-02-23", present: true },
    { date: "2026-02-24", present: true },
    { date: "2026-02-25", present: true },
    { date: "2026-02-26", present: false },
    { date: "2026-02-27", present: true },
];
const Dashboard = () => {
    const [user, setUser] = useState<CmsUser | null>(null);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        setUser(cmsAuth.getUser());
        setReady(true);
    }, []);
    if (!ready) {
        return <div className="flex h-[50vh] items-center justify-center text-gray-500">Loading dashboard...</div>;
    }
    if (!user) {
        return <Navigate to="/login" replace/>;
    }
    return (<div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-h-screen">
          <Topbar />
          <main className="p-6 bg-gray-50 min-h-[calc(100vh-73px)]">
            <div className="max-w-7xl mx-auto">
              {user.role === "admin" && <AdminDashboard />}
              {user.role === "teacher" && <FacultyDashboard />}
              {user.role === "student" && <StudentDashboard />}
            </div>
          </main>
        </div>
      </div>
    </div>);
};
function AdminDashboard() {
    const stats = useMemo(() => {
        const presentRecords = sampleAttendance.filter((a) => a.present).length;
        const attendanceRate = ((presentRecords / sampleAttendance.length) * 100).toFixed(1);
        return {
            totalStudents: sampleStudents.length,
            totalTeachers: sampleTeachers.length,
            totalClasses: sampleClasses.length,
            totalSubjects: sampleSubjects.length,
            attendanceRate,
        };
    }, []);
    const gradeDistribution = useMemo(() => {
        const ranges = [
            { name: "90-100", min: 90, max: 100, count: 0, color: "#10b981" },
            { name: "80-89", min: 80, max: 89, count: 0, color: "#3b82f6" },
            { name: "70-79", min: 70, max: 79, count: 0, color: "#f59e0b" },
            { name: "60-69", min: 60, max: 69, count: 0, color: "#ef4444" },
            { name: "Below 60", min: 0, max: 59, count: 0, color: "#6b7280" },
        ];
        sampleGrades.forEach((grade) => {
            const range = ranges.find((r) => grade.score >= r.min && grade.score <= r.max);
            if (range)
                range.count++;
        });
        return ranges.filter((r) => r.count > 0);
    }, []);
    const attendanceData = useMemo(() => [
        { date: "Sun", rate: 50 },
        { date: "Mon", rate: 100 },
        { date: "Tue", rate: 100 },
        { date: "Wed", rate: 100 },
        { date: "Thu", rate: 0 },
        { date: "Fri", rate: 100 },
        { date: "Sat", rate: 90 },
    ], []);
    return (<div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value={stats.totalStudents.toString()} icon={<Users className="h-4 w-4 text-teal-600"/>} border="border-l-teal-500"/>
        <StatCard title="Teachers" value={stats.totalTeachers.toString()} icon={<GraduationCap className="h-4 w-4 text-blue-600"/>} border="border-l-blue-500"/>
        <StatCard title="Classes" value={stats.totalClasses.toString()} icon={<School className="h-4 w-4 text-emerald-600"/>} border="border-l-emerald-500"/>
        <StatCard title="Attendance Rate" value={`${stats.attendanceRate}%`} icon={<TrendingUp className="h-4 w-4 text-amber-600"/>} border="border-l-amber-500"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-teal-600"/>
              Attendance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="date"/>
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, "Attendance Rate"]}/>
                <Bar dataKey="rate" fill="#0d9488" radius={[4, 4, 0, 0]}/>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-600"/>
              Grade Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={gradeDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="count" label={({ name, count }) => `${name}: ${count}`}>
                  {gradeDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color}/>))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>);
}
function FacultyDashboard() {
    return (<div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="My Classes" value="3" icon={<School className="h-4 w-4 text-blue-600"/>} border="border-l-blue-500"/>
        <StatCard title="Total Students" value="85" icon={<Users className="h-4 w-4 text-emerald-600"/>} border="border-l-emerald-500"/>
        <StatCard title="Pending Grades" value="12" icon={<ClipboardList className="h-4 w-4 text-purple-600"/>} border="border-l-purple-500"/>
      </div>
    </div>);
}
function StudentDashboard() {
    return (<div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="My Attendance" value="92%" icon={<TrendingUp className="h-4 w-4 text-teal-600"/>} border="border-l-teal-500"/>
        <StatCard title="Current GPA" value="3.8" icon={<BookOpen className="h-4 w-4 text-amber-600"/>} border="border-l-amber-500"/>
        <StatCard title="Pending Fees" value="INR 0" icon={<Calendar className="h-4 w-4 text-red-600"/>} border="border-l-red-500"/>
      </div>
    </div>);
}
function StatCard({ title, value, icon, border }: {
    title: string;
    value: string;
    icon: ReactNode;
    border: string;
}) {
    return (<Card className={`border-l-4 ${border}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      </CardContent>
    </Card>);
}
export default Dashboard;
