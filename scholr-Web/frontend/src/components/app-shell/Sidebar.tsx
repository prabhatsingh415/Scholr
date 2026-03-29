import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Bell, Users, GraduationCap, School, BookOpen, ClipboardCheck, BarChart3, Calendar, CreditCard, Settings, } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/use-auth-store";
const items = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "teacher", "student"] },
    { href: "/notices", label: "Notices", icon: Bell, roles: ["admin", "student"] },
    { href: "/students", label: "Students", icon: Users, roles: ["admin", "teacher"] },
    { href: "/teachers", label: "Teachers", icon: GraduationCap, roles: ["admin"] },
    { href: "/classes", label: "Classes", icon: School, roles: ["admin"] },
    { href: "/subjects", label: "Subjects", icon: BookOpen, roles: ["admin"] },
    { href: "/attendance", label: "Attendance", icon: ClipboardCheck, roles: ["admin", "teacher", "student"] },
    { href: "/grades", label: "Exams", icon: BarChart3, roles: ["admin", "teacher", "student"] },
    { href: "/timetable", label: "Timetable", icon: Calendar, roles: ["admin", "teacher", "student"] },
    { href: "/fees", label: "Fee Management", icon: CreditCard, roles: ["admin", "student"] },
    { href: "/settings", label: "Settings", icon: Settings, roles: ["admin", "teacher", "student"] },
];
const Sidebar = () => {
    const location = useLocation();
    const user = useAuthStore((state) => state.user);
    const visibleItems = items.filter((item) => item.roles.includes(user?.role || "student"));
    return (<div className="cms-sidebar w-64 min-h-screen border-r border-[#D6E4FF] bg-gradient-to-b from-white via-[#F7FAFF] to-[#EAF2FF] shadow-sm">
      <div className="border-b border-[#D6E4FF] bg-gradient-to-r from-white to-[#EEF5FF] p-5">
        <div className="rounded-2xl border border-[#DCE9FF] bg-white/90 px-3 py-4 shadow-sm">
          <img src="/images/GECB-removebg-preview.png" alt="GECB logo" className="h-14 w-full object-contain object-left"/>
        </div>
      </div>

      <nav className="flex flex-col gap-1 p-3">
        {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (<Link key={item.href} to={item.href}>
              <Button variant="ghost" className={cn("justify-start w-full gap-3 h-11 px-4 font-medium transition-all duration-200", isActive
                    ? "bg-gradient-to-r from-[#123B7A] to-[#1C58B0] text-white shadow-sm hover:from-[#102f62] hover:to-[#184b97] hover:text-white"
                    : "text-slate-700 hover:bg-[#EAF2FF] hover:text-[#123B7A] hover:shadow-sm")}>
                <Icon className="h-5 w-5"/>
                {item.label}
              </Button>
            </Link>);
        })}
      </nav>
    </div>);
};
export default Sidebar;
