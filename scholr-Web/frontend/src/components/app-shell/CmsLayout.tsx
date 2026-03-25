import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "@/components/app-shell/Sidebar";
import Topbar from "@/components/app-shell/Topbar";
import CmsFooter from "@/components/app-shell/CmsFooter";
import { useAuthStore } from "@/stores/use-auth-store";
import { useCmsStore } from "@/stores/use-cms-store";
const CmsLayout = () => {
    const user = useAuthStore((state) => state.user);
    const initializeCms = useCmsStore((state) => state.initialize);

    useEffect(() => {
        initializeCms();
    }, [initializeCms]);

    if (!user) {
        return <Navigate to="/login" replace/>;
    }
    return (<div className="cms-shell min-h-screen bg-gradient-to-br from-white via-[#F7FAFF] to-[#EAF2FF]">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar />
          <main className="cms-content min-h-[calc(100vh-73px)] bg-gradient-to-br from-white via-[#F8FBFF] to-[#EDF4FF] p-6">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
          <CmsFooter />
        </div>
      </div>
    </div>);
};
export default CmsLayout;
