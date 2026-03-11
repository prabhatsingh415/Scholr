import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "@/components/app-shell/Sidebar";
import Topbar from "@/components/app-shell/Topbar";
import CmsFooter from "@/components/app-shell/CmsFooter";
import { auth } from "@/lib/local-storage";
const CmsLayout = () => {
    const user = auth.getUser();
    if (!user) {
        return <Navigate to="/login" replace/>;
    }
    return (<div className="cms-shell min-h-screen bg-gradient-to-br from-[#F6F2E3] via-white to-[#EEF3FF]">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar />
          <main className="cms-content min-h-[calc(100vh-73px)] bg-gradient-to-br from-white/90 via-[#FFFDF6] to-[#F2F6FF] p-6">
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
