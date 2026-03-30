import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Component, lazy, Suspense, useEffect, type ErrorInfo, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/use-auth-store";
import Index from "./pages/Index";
const CmsLayout = lazy(() => import("@/components/app-shell/CmsLayout"));
const ApplyNow = lazy(() => import("./pages/ApplyNow"));
const Contact = lazy(() => import("./pages/Contact"));
const Faculty = lazy(() => import("./pages/Faculty"));
const Courses = lazy(() => import("./pages/Courses"));
const Events = lazy(() => import("./pages/Events"));
const About = lazy(() => import("./pages/About"));
const PublicNotices = lazy(() => import("./pages/PublicNotices"));
const ExperienceCampus = lazy(() => import("./pages/ExperienceCampus"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const VirtualTour = lazy(() => import("./pages/Virtualtour"));
const PhotoGallery = lazy(() => import("./pages/PhotoGallery"));
const ContactFaculty = lazy(() => import("./pages/ContactFaculty"));
const AcademicPrograms = lazy(() => import("./pages/AcademicPrograms"));
const CourseProgramDetails = lazy(() => import("./pages/CourseProgramDetails"));
const CollegeCells = lazy(() => import("./pages/CollegeCells"));
const LoginPage = lazy(() => import("./pages/cms/LoginPage"));
const DashboardPage = lazy(() => import("./pages/cms/DashboardPage"));
const NoticesPage = lazy(() => import("./pages/cms/NoticesPage"));
const StudentsPage = lazy(() => import("./pages/cms/StudentsPage"));
const TeachersPage = lazy(() => import("./pages/cms/TeachersPage"));
const ClassesPage = lazy(() => import("./pages/cms/ClassesPage"));
const SubjectsPage = lazy(() => import("./pages/cms/SubjectsPage"));
const AttendancePage = lazy(() => import("./pages/cms/AttendancePage"));
const GradesPage = lazy(() => import("./pages/cms/GradesPage"));
const TimetablePage = lazy(() => import("./pages/cms/TimetablePage"));
const FeesPage = lazy(() => import("./pages/cms/FeesPage"));
const SettingsPage = lazy(() => import("./pages/cms/SettingsPage"));
const queryClient = new QueryClient();

class AppErrorBoundary extends Component<{ children: ReactNode; }, { error: Error | null; }> {
    constructor(props: { children: ReactNode; }) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("App render error", error, errorInfo);
    }

    render() {
        if (this.state.error) {
            return <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
          <div className="w-full max-w-2xl rounded-3xl border border-red-200 bg-white p-6 shadow-xl">
            <h1 className="text-2xl font-semibold text-red-700">Something went wrong</h1>
            <p className="mt-2 text-sm text-slate-600">
              The app hit a runtime error while rendering.
            </p>
            <pre className="mt-4 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-red-200">
              {this.state.error.stack || this.state.error.message}
            </pre>
          </div>
        </div>;
        }

        return this.props.children;
    }
}

const RouteFallback = () => (<div className="flex min-h-screen items-center justify-center bg-background text-foreground">
    <div className="rounded-2xl border border-border bg-card px-6 py-4 text-sm shadow-sm">
      Loading...
    </div>
  </div>);

const ScrollToHash = () => {
    const location = useLocation();

    useEffect(() => {
        if (!location.hash) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        const id = location.hash.replace("#", "");
        const scrollToTarget = () => {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        };

        scrollToTarget();
        const timer = window.setTimeout(scrollToTarget, 120);
        return () => window.clearTimeout(timer);
    }, [location.hash, location.pathname]);

    return null;
};

const RoleProtectedRoute = ({ allowedRoles, children }: {
    allowedRoles: Array<"admin" | "teacher" | "student">;
    children: JSX.Element;
}) => {
    const user = useAuthStore((state) => state.user);
    if (!user)
        return <Navigate to="/login" replace/>;
    if (!allowedRoles.includes(user.role)) {
        const redirectPath = user.role === "student" ? "/attendance" : "/dashboard";
        return <Navigate to={redirectPath} replace/>;
    }
    return children;
};
const App = () => (<QueryClientProvider client={queryClient}>
    <AppErrorBoundary>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToHash />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Index />}/>
              <Route path="/login" element={<LoginPage />}/>
              <Route element={<CmsLayout />}>
                <Route path="/dashboard" element={<RoleProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
                      <DashboardPage />
                    </RoleProtectedRoute>}/>
                <Route path="/notices" element={<RoleProtectedRoute allowedRoles={["admin", "student"]}>
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
                <Route path="/attendance" element={<RoleProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
                      <AttendancePage />
                    </RoleProtectedRoute>}/>
                <Route path="/grades" element={<RoleProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
                      <GradesPage />
                    </RoleProtectedRoute>}/>
                <Route path="/timetable" element={<RoleProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
                      <TimetablePage />
                    </RoleProtectedRoute>}/>
                <Route path="/fees" element={<RoleProtectedRoute allowedRoles={["admin", "student"]}>
                      <FeesPage />
                    </RoleProtectedRoute>}/>
                <Route path="/settings" element={<RoleProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
                      <SettingsPage />
                    </RoleProtectedRoute>}/>
              </Route>
              <Route path="/apply" element={<ApplyNow />}/>
              <Route path="/student-portal" element={<Navigate to="/login" replace/>}/>
              <Route path="/contact" element={<Contact />}/>
              <Route path="/faculty" element={<Faculty />}/>
              <Route path="/courses" element={<Courses />}/>
              <Route path="/courses/btech" element={<CourseProgramDetails programKey="BTECH" />}/>
              <Route path="/courses/bca" element={<CourseProgramDetails programKey="BCA" />}/>
              <Route path="/events" element={<Events />}/>
              <Route path="/about" element={<About />}/>
              <Route path="/notice" element={<PublicNotices />}/>
              <Route path="/college-cells" element={<CollegeCells />}/>
              <Route path="/ExperienceCampus" element={<ExperienceCampus />}/>
              <Route path="/experience-campus" element={<ExperienceCampus />}/>
              <Route path="/admin" element={<AdminDashboard />}/>
              <Route path="/virtual-tour" element={<VirtualTour />}/>
              <Route path="/photo-gallery" element={<PhotoGallery />}/>
              <Route path="/contact-faculty" element={<ContactFaculty />}/>
              <Route path="/academic-programs" element={<AcademicPrograms />}/>
              <Route path="*" element={<NotFound />}/>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AppErrorBoundary>
  </QueryClientProvider>);
export default App;
