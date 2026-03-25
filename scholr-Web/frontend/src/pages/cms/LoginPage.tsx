"use client";
import { FormEvent, useMemo, useState } from "react";
import { Users, GraduationCap, School } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/use-auth-store";
import CmsFooter from "@/components/app-shell/CmsFooter";
import { useLogin } from "../../hooks/auth/useLogin";
import { api } from "@/lib/api";

type Role = "admin" | "faculty" | "student";

export default function LoginPage() {
    const [selectedRole, setSelectedRole] = useState<Role>("faculty");
    const [collegeId, setCollegeId] = useState("");
    const [password, setPassword] = useState("");
    const [formError, setFormError] = useState<string | null>(null);
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);
    const validatePassword = (value: string) => {
        if (!/^[A-Z]/.test(value)) {
            return "Password must start with a capital letter.";
        }
        if (!/\d/.test(value)) {
            return "Password must include at least one number.";
        }
        if (!/[^A-Za-z0-9]/.test(value)) {
            return "Password must include at least one special character.";
        }
        return null;
    };
    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        const trimmedCollegeId = collegeId.trim();
        if (!trimmedCollegeId) {
            setFormError("College ID is required.");
            return;
        }
        const passwordError = validatePassword(password);
        if (passwordError) {
            setFormError(passwordError);
            return;
        }
        
        try {
            const response = await api.auth.login({
                collegeId: trimmedCollegeId,
                password: password,
                deviceId: "web-browser"
            });
            
            if (response.data && response.data.token) {
                localStorage.setItem("token", response.data.token);
                const meResponse = await api.user.me();
                setUser(meResponse.data);
                navigate("/dashboard");
            }
        } catch (error: any) {
            setFormError(error.response?.data?.message || "Login failed. Please check your credentials.");
        }
    };
    return (<div className="relative min-h-screen overflow-hidden bg-slate-950">
      <video className="absolute inset-0 h-full w-full object-cover" src="/videos/login-bg.mp4" autoPlay loop muted playsInline/>
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(3,10,27,0.9),rgba(15,44,105,0.72),rgba(255,255,255,0.12))]"/>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.22),transparent_34%)]"/>
      <div className="animate-float-premium absolute left-[8%] top-[14%] hidden h-28 w-28 rounded-full border border-white/10 bg-white/10 blur-2xl sm:block"/>
      <div className="animate-pulse-premium absolute bottom-[18%] right-[8%] hidden h-36 w-36 rounded-full bg-blue-400/10 blur-3xl sm:block"/>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-5 sm:px-6 sm:py-6">
        <div className="animate-slide-in-premium w-full max-w-xl rounded-[2rem] border border-white/25 bg-white/16 p-2 shadow-[0_34px_110px_rgba(2,8,23,0.42)] backdrop-blur-2xl transition-transform duration-500 hover:-translate-y-1">
          <div className="rounded-[1.7rem] border border-slate-200/80 bg-white/95 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:p-6 lg:p-7">
            <div className="mb-6 text-center sm:mb-7">
              <div className="animate-pulse-premium text-4xl font-semibold tracking-tight text-slate-950 sm:text-[3.2rem]">
                GECB
              </div>
              <p className="mx-auto mt-2 max-w-md text-balance text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-blue-800/90 sm:text-[0.72rem]">
                Government Engineering College Baran
              </p>
              <div className="mx-auto mt-4 h-px w-20 bg-gradient-to-r from-transparent via-blue-300 to-transparent"/>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Sign In</h1>
              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Choose your role and enter your credentials to continue.
              </p>
            </div>

            <div className="mb-5 rounded-[1.6rem] border border-slate-200 bg-slate-50/80 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <div className="grid grid-cols-3 gap-2">
                <button type="button" onClick={() => setSelectedRole("admin")} className={`rounded-[1.2rem] border px-3 py-3.5 text-sm font-medium transition-all duration-300 ${selectedRole === "admin"
                ? "border-blue-800 bg-gradient-to-br from-blue-800 to-blue-700 text-white shadow-[0_16px_40px_rgba(30,64,175,0.24)]"
                : "border-transparent bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50"}`}>
                  <Users className="mx-auto mb-2 h-5 w-5" strokeWidth={selectedRole === "admin" ? 2.5 : 2}/>
                  Admin
                </button>
                <button type="button" onClick={() => setSelectedRole("faculty")} className={`rounded-[1.2rem] border px-3 py-3.5 text-sm font-medium transition-all duration-300 ${selectedRole === "faculty"
                ? "border-blue-800 bg-gradient-to-br from-blue-800 to-blue-700 text-white shadow-[0_16px_40px_rgba(30,64,175,0.24)]"
                : "border-transparent bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50"}`}>
                  <GraduationCap className="mx-auto mb-2 h-5 w-5" strokeWidth={selectedRole === "faculty" ? 2.5 : 2}/>
                  Faculty
                </button>
                <button type="button" onClick={() => setSelectedRole("student")} className={`rounded-[1.2rem] border px-3 py-3.5 text-sm font-medium transition-all duration-300 ${selectedRole === "student"
                ? "border-blue-800 bg-gradient-to-br from-blue-800 to-blue-700 text-white shadow-[0_16px_40px_rgba(30,64,175,0.24)]"
                : "border-transparent bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50"}`}>
                  <School className="mx-auto mb-2 h-5 w-5" strokeWidth={selectedRole === "student" ? 2.5 : 2}/>
                  Student
                </button>
              </div>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="transition-transform duration-300 focus-within:-translate-y-0.5">
                <label htmlFor="college-id" className="mb-2 block text-sm font-semibold text-slate-700">
                  College ID
                </label>
                <input id="college-id" type="text" value={collegeId} onChange={(e) => setCollegeId(e.target.value)} placeholder="Enter your college ID" className="h-[3.25rem] w-full cursor-text rounded-2xl border border-blue-200 bg-slate-100/90 px-5 py-3 text-base text-slate-950 caret-slate-950 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] outline-none transition-all duration-300 placeholder:text-slate-500 hover:border-blue-300 focus:border-blue-600 focus:bg-blue-50/95 focus:shadow-[0_0_0_4px_rgba(191,219,254,0.75),0_18px_40px_rgba(30,64,175,0.10)]" required autoComplete="username" style={{ colorScheme: "light" }}/>
              </div>

              <div className="transition-transform duration-300 focus-within:-translate-y-0.5">
                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="h-[3.25rem] w-full cursor-text rounded-2xl border border-blue-200 bg-slate-100/90 px-5 py-3 text-base text-slate-950 caret-slate-950 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] outline-none transition-all duration-300 placeholder:text-slate-500 hover:border-blue-300 focus:border-blue-600 focus:bg-blue-50/95 focus:shadow-[0_0_0_4px_rgba(191,219,254,0.75),0_18px_40px_rgba(30,64,175,0.10)]" required autoComplete="current-password" style={{ colorScheme: "light" }}/>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-xs leading-relaxed text-slate-600">
                Password must start with a capital letter and include one number and one special character.
              </div>

              {formError ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</div> : null}

              <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 py-3.5 text-lg font-semibold text-white shadow-[0_18px_45px_rgba(30,64,175,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:from-blue-950 hover:via-blue-900 hover:to-blue-700">
                Sign In
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-600">
              Return to{" "}
              <Link to="/" className="font-semibold text-blue-800 hover:underline">
                Main Website
              </Link>
            </div>
          </div>
        </div>
      </div>

      <CmsFooter variant="login" className="relative z-10 border-white/15 bg-slate-950/30 text-white"/>
    </div>);
}
