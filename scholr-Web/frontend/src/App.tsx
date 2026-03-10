import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CmsLayout from "@/components/app-shell/CmsLayout";
import { auth } from "@/lib/local-storage";
import Index from "./pages/Index";
import ApplyNow from "./pages/ApplyNow";
import Contact from "./pages/Contact";
import Faculty from "./pages/Faculty";
import Courses from "./pages/Courses";
import Events from "./pages/Events";
import About from "./pages/About";
import ExperienceCampus from "./pages/ExperienceCampus";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import VirtualTour from "./pages/VirtualTour";
import PhotoGallery from "./pages/PhotoGallery";
import ContactFaculty from "./pages/ContactFaculty";
import AcademicPrograms from "./pages/AcademicPrograms";
import LoginPage from "./pages/cms/LoginPage";
import DashboardPage from "./pages/cms/DashboardPage";
import NoticesPage from "./pages/cms/NoticesPage";
import StudentsPage from "./pages/cms/StudentsPage";
import TeachersPage from "./pages/cms/TeachersPage";
import ClassesPage from "./pages/cms/ClassesPage";
import SubjectsPage from "./pages/cms/SubjectsPage";
import AttendancePage from "./pages/cms/AttendancePage";
import GradesPage from "./pages/cms/GradesPage";
import TimetablePage from "./pages/cms/TimetablePage";
import FeesPage from "./pages/cms/FeesPage";
import SettingsPage from "./pages/cms/SettingsPage";
import ApiTestPage from "./pages/ApiTestPage";
const queryClient = new QueryClient();
const RoleProtectedRoute = ({ allowedRoles, children }: {
    allowedRoles: Array<"admin" | "teacher" | "student">;
    children: JSX.Element;
}) => {
    const user = auth.getUser();
    if (!user)
        return <Navigate to="/login" replace/>;
    if (!allowedRoles.includes(user.role))
        return <Navigate to="/dashboard" replace/>;
    return children;
};
const App = () => (<QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />}/>
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/api-test" element={<ApiTestPage />}/>
          <Route element={<CmsLayout />}>
            <Route path="/dashboard" element={<DashboardPage />}/>
            <Route path="/notices" element={<RoleProtectedRoute allowedRoles={["admin"]}>
                  <NoticesPage />
                </RoleProtectedRoute>}/>
            <Route path="/students" element={<RoleProtectedRoute allowedRoles={["admin", "teacher"]}>
                  <StudentsPage />
                </RoleProtectedRoute>}/>
            <Route path="/teachers" element={<RoleProtectedRoute allowedRoles={["admin"]}>
                  <TeachersPage />
                </RoleProtectedRoute>}/>
            <Route path="/classes" element={<RoleProtectedRoute allowedRoles={["admin"]}>
                  <ClassesPage />
                </RoleProtectedRoute>}/>
            <Route path="/subjects" element={<RoleProtectedRoute allowedRoles={["admin"]}>
                  <SubjectsPage />
                </RoleProtectedRoute>}/>
            <Route path="/attendance" element={<AttendancePage />}/>
            <Route path="/grades" element={<GradesPage />}/>
            <Route path="/timetable" element={<TimetablePage />}/>
            <Route path="/fees" element={<RoleProtectedRoute allowedRoles={["admin", "student"]}>
                  <FeesPage />
                </RoleProtectedRoute>}/>
            <Route path="/settings" element={<SettingsPage />}/>
          </Route>
          <Route path="/apply" element={<ApplyNow />}/>
          <Route path="/student-portal" element={<Navigate to="/login" replace/>}/>
          <Route path="/contact" element={<Contact />}/>
          <Route path="/faculty" element={<Faculty />}/>
          <Route path="/courses" element={<Courses />}/>
          <Route path="/events" element={<Events />}/>
          <Route path="/about" element={<About />}/>
          <Route path="/ExperienceCampus" element={<ExperienceCampus />}/>
          <Route path="/admin" element={<AdminDashboard />}/>
          <Route path="/virtual-tour" element={<VirtualTour />}/>
          <Route path="/photo-gallery" element={<PhotoGallery />}/>
          <Route path="/contact-faculty" element={<ContactFaculty />}/>
          <Route path="/academic-programs" element={<AcademicPrograms />}/>
          <Route path="*" element={<NotFound />}/>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>);
export default App;
