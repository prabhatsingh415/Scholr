"use client";

import { useState } from "react";
import { Users, GraduationCap, School } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/local-storage"; // Dhyan dein: Apna correct path check kar lein

type Role = "admin" | "faculty" | "student";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<Role>("faculty");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // UI me role 'faculty' hai, but DB (local-storage) me 'teacher' hai
    // Toh hum usey map kar dete hain
    const roleForDb = selectedRole === "faculty" ? "teacher" : selectedRole;

    // auth.signIn function call karein updated role ke sath
    const { user, error } = await auth.signIn(email, password, roleForDb);
    
    if (user) {
      console.log("Logged in successfully:", user);
      // Login hone ke baad direct common dashboard par redirect kar dein
      router.push("/dashboard");
    } else {
      // Agar password 6 chars se kam hai toh alert aayega
      alert(error || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
            <div className="w-6 h-6 bg-white/30 rounded-full backdrop-blur-sm"></div>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">GCEC</h1>
          <p className="text-slate-600 mt-1">College Management System</p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {/* Admin Role */}
          <button
            type="button"
            onClick={() => setSelectedRole("admin")}
            className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 ${
              selectedRole === "admin"
                ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                : "bg-white border border-slate-200 text-slate-600 hover:border-blue-500/50"
            }`}
          >
            <Users className="w-6 h-6 mb-2" strokeWidth={selectedRole === "admin" ? 2.5 : 2} />
            <span className="text-sm font-medium">Admin</span>
          </button>

          {/* Faculty Role */}
          <button
            type="button"
            onClick={() => setSelectedRole("faculty")}
            className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 ${
              selectedRole === "faculty"
                ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                : "bg-white border border-slate-200 text-slate-600 hover:border-blue-500/50"
            }`}
          >
            <GraduationCap className="w-6 h-6 mb-2" strokeWidth={selectedRole === "faculty" ? 2.5 : 2} />
            <span className="text-sm font-medium">Faculty</span>
          </button>

          {/* Student Role */}
          <button
            type="button"
            onClick={() => setSelectedRole("student")}
            className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 ${
              selectedRole === "student"
                ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                : "bg-white border border-slate-200 text-slate-600 hover:border-blue-500/50"
            }`}
          >
            <School className="w-6 h-6 mb-2" strokeWidth={selectedRole === "student" ? 2.5 : 2} />
            <span className="text-sm font-medium">Student</span>
          </button>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 6 chars)"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#00a87a] hover:bg-[#00966d] text-white font-medium py-3 rounded-lg transition-colors mt-2"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          New?{" "}
          <Link href="/register" className="text-[#00a87a] font-medium hover:underline">
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
}