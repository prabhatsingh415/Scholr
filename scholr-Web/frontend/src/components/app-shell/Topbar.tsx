import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { auth, type User } from "@/lib/local-storage";
const Topbar = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        setUser(auth.getUser());
    }, []);
    const signOut = async () => {
        const { error } = await auth.signOut();
        if (error) {
            toast({ title: "Sign out failed", description: error, variant: "destructive" });
            return;
        }
        toast({ title: "Signed out", description: "See you soon!" });
        navigate("/login");
    };
    const displayRole = user?.role === "teacher" ? "Faculty" : user?.role === "student" ? "Student" : "Admin";
    return (<header className="cms-topbar border-b border-[#DEDACC] bg-gradient-to-r from-[#FFFDF6] via-white to-[#F7F9FF] shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#112F68]">Welcome back, {user ? displayRole : "..."}</h1>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-slate-600 hover:text-[#112F68]">
            <Search className="h-4 w-4"/>
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-600 hover:text-[#112F68]">
            <Bell className="h-4 w-4"/>
          </Button>
          <div className="flex items-center gap-3 pl-3 border-l border-[#DEDACC]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#E9F7F1] rounded-full flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-[#0A8B69]"/>
              </div>
              <span className="text-sm font-medium text-slate-700">{user?.email || "..."}</span>
            </div>
            <Button onClick={signOut} variant="outline" size="sm" className="border-[#CCD4E3] text-[#112F68] hover:bg-[#F3F6FF] bg-transparent">
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </header>);
};
export default Topbar;
