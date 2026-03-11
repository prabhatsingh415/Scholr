"use client";
import { useState } from "react";
import { Users, GraduationCap, School } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "@/lib/local-storage";
import CmsFooter from "@/components/app-shell/CmsFooter";
type Role = "admin" | "faculty" | "student";
export default function LoginPage() {
    const [selectedRole, setSelectedRole] = useState<Role>("faculty");
    const [collegeId, setCollegeId] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        const roleForDb = selectedRole === "faculty" ? "teacher" : selectedRole;
        const { user, error } = await auth.signIn(collegeId, password, roleForDb);
        if (user) {
            console.log("Logged in successfully:", user);
            navigate("/dashboard");
        }
        else {
            alert(error || "Login failed. Please check your credentials.");
        }
    };
    return (<div className="min-h-screen bg-[#959DAA]">
      <div className="min-h-screen p-4 sm:p-6">
        <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-6xl items-center justify-center">
          <div className="grid w-full overflow-hidden rounded-[2rem] border border-black/10 bg-[#F4F0DE] shadow-[0_30px_80px_rgba(15,23,42,0.28)] lg:grid-cols-[0.92fr_1.08fr]">
            <div className="p-7 sm:p-9 lg:p-10">
              <div className="mb-8 inline-flex items-center rounded-full border border-slate-400 bg-white/50 px-5 py-2 text-sm text-slate-700">
                GECB Portal
              </div>

              <div className="mb-7">
                <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Sign In</h1>
                <p className="mt-2 text-slate-600">College Management System</p>
              </div>

              <div className="mb-6 grid grid-cols-3 gap-3">
                <button type="button" onClick={() => setSelectedRole("admin")} className={`rounded-2xl border px-3 py-3 text-sm font-medium transition-all ${selectedRole === "admin"
            ? "border-[#112F68] bg-[#112F68] text-white shadow-md"
            : "border-slate-300 bg-white/70 text-slate-700 hover:border-slate-500"}`}>
                  <Users className="mx-auto mb-2 h-5 w-5" strokeWidth={selectedRole === "admin" ? 2.5 : 2}/>
                  Admin
                </button>
                <button type="button" onClick={() => setSelectedRole("faculty")} className={`rounded-2xl border px-3 py-3 text-sm font-medium transition-all ${selectedRole === "faculty"
            ? "border-[#112F68] bg-[#112F68] text-white shadow-md"
            : "border-slate-300 bg-white/70 text-slate-700 hover:border-slate-500"}`}>
                  <GraduationCap className="mx-auto mb-2 h-5 w-5" strokeWidth={selectedRole === "faculty" ? 2.5 : 2}/>
                  Faculty
                </button>
                <button type="button" onClick={() => setSelectedRole("student")} className={`rounded-2xl border px-3 py-3 text-sm font-medium transition-all ${selectedRole === "student"
            ? "border-[#112F68] bg-[#112F68] text-white shadow-md"
            : "border-slate-300 bg-white/70 text-slate-700 hover:border-slate-500"}`}>
                  <School className="mx-auto mb-2 h-5 w-5" strokeWidth={selectedRole === "student" ? 2.5 : 2}/>
                  Student
                </button>
              </div>

              <form onSubmit={handleSignIn} className="space-y-4">
                <input type="text" value={collegeId} onChange={(e) => setCollegeId(e.target.value)} placeholder="College ID (e.g. ST-2026-01)" className="w-full rounded-full border border-slate-300 bg-white/85 px-5 py-3 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-[#112F68]/15" required/>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 6 chars)" className="w-full rounded-full border border-slate-300 bg-white/85 px-5 py-3 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-[#112F68]/15" required minLength={6}/>
                <button type="submit" className="w-full rounded-full bg-[#F5D45A] py-3 text-lg font-semibold text-slate-900 transition-colors hover:bg-[#efca43]">
                  Sign In
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-slate-600">
                Return to{" "}
                <Link to="/" className="font-semibold text-[#112F68] hover:underline">
                  Main Website
                </Link>
              </div>
            </div>

            <div className="relative hidden overflow-hidden rounded-l-[1.5rem] lg:block">
              <video className="absolute inset-0 h-full w-full object-cover" src="/videos/login-bg.mp4" autoPlay loop muted playsInline/>
              <div className="absolute inset-0 bg-gradient-to-br from-black/35 via-black/20 to-black/10"/>

              <div className="absolute left-6 top-6 rounded-2xl bg-[#F5D45A] px-4 py-3 text-sm text-slate-900 shadow-lg">
                <div className="font-semibold">Campus Update</div>
                <div className="text-xs opacity-80">Academic Session Active</div>
              </div>

              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/30 bg-white/15 p-4 text-white backdrop-blur-sm">
                <p className="text-sm">Engineering College Baran</p>
                <p className="mt-1 text-lg font-semibold">Academic | Attendance | Exams | Notices</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CmsFooter variant="login"/>
    </div>);
}
