import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Bell, Users, GraduationCap, School, BookOpen, ClipboardCheck, BarChart3, Calendar, CreditCard, Settings, } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/local-storage";
const items = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "teacher", "student"] },
    { href: "/notices", label: "Notices", icon: Bell, roles: ["admin"] },
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
    const user = auth.getUser();
    const visibleItems = items.filter((item) => item.roles.includes(user?.role || "student"));
    return (<div className="cms-sidebar w-64 border-r border-[#D8D5C6] min-h-screen bg-gradient-to-b from-[#F4F0DE] to-white shadow-sm">
      <div className="p-6 border-b border-[#DEDACC]">
        <div className="text-xl font-bold text-[#112F68] flex items-center gap-2">
          <School className="h-7 w-7 text-[#0A8B69]"/>
          GECB
        </div>
        <p className="text-sm text-slate-600 mt-1">College Management System</p>
      </div>

      <nav className="flex flex-col gap-1 p-3">
        {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (<Link key={item.href} to={item.href}>
              <Button variant="ghost" className={cn("justify-start w-full gap-3 h-11 px-4 font-medium transition-all duration-200", isActive
                    ? "bg-gradient-to-r from-[#112F68] to-[#173E82] text-white shadow-sm hover:from-[#0f295a] hover:to-[#12366f] hover:text-white"
                    : "text-slate-700 hover:bg-[#EDE8D2] hover:text-[#112F68] hover:shadow-sm")}>
                <Icon className="h-5 w-5"/>
                {item.label}
              </Button>
            </Link>);
        })}
      </nav>
    </div>);
};
export default Sidebar;
