import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronRight, Search, User as UserIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/use-auth-store";
import { CMS_DB_UPDATED_EVENT, getNotices, type CmsDbUpdatedDetail } from "@/lib/local-storage";

type DashboardSearchResult = {
  id: string;
  label: string;
  href: string;
  type: "page" | "notice";
};

const CMS_NOTICE_READ_COUNT_KEY = "cms_notice_read_count";

const Topbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);
  const signOutFromStore = useAuthStore((state) => state.signOut);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [noticeCount, setNoticeCount] = useState(0);
  const [readCount, setReadCount] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = localStorage.getItem("cms_profile_photo");
    setProfilePhoto(stored && stored.length > 0 ? stored : null);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "cms_profile_photo") {
        setProfilePhoto(event.newValue);
      }
    };

    const handleCustom = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      if (typeof customEvent.detail === "string") {
        setProfilePhoto(customEvent.detail);
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("cms-profile-photo-updated", handleCustom);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cms-profile-photo-updated", handleCustom);
    };
  }, []);

  useEffect(() => {
    const syncCounts = () => {
      const notices = getNotices();
      setNoticeCount(notices.length);

      if (typeof window === "undefined") {
        return;
      }

      const storedReadCount = Number(window.localStorage.getItem(CMS_NOTICE_READ_COUNT_KEY) || "0");
      setReadCount(Number.isFinite(storedReadCount) ? storedReadCount : 0);
    };

    syncCounts();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "notices" || event.key === CMS_NOTICE_READ_COUNT_KEY || event.key === null) {
        syncCounts();
      }
    };

    const handleCmsUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<CmsDbUpdatedDetail>;
      if (customEvent.detail?.collection === "notices") {
        syncCounts();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(CMS_DB_UPDATED_EVENT, handleCmsUpdate);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(CMS_DB_UPDATED_EVENT, handleCmsUpdate);
    };
  }, []);

  const signOut = async () => {
    const { error } = await signOutFromStore();
    if (error) {
      toast({ title: "Sign out failed", description: error, variant: "destructive" });
      return;
    }

    toast({ title: "Signed out", description: "See you soon!" });
    navigate("/login");
  };

  const displayRole = user?.role === "teacher" ? "Faculty" : user?.role === "student" ? "Student" : "Admin";

  const dashboardSearchResults = useMemo((): DashboardSearchResult[] => {
    const baseResults: DashboardSearchResult[] = [
      { id: "dashboard", label: "Dashboard", href: "/dashboard", type: "page" },
      { id: "attendance", label: "Attendance", href: "/attendance", type: "page" },
      { id: "grades", label: "Grades", href: "/grades", type: "page" },
      { id: "timetable", label: "Timetable", href: "/timetable", type: "page" },
      { id: "settings", label: "Settings", href: "/settings", type: "page" },
    ];

    if (user?.role === "admin" || user?.role === "student") {
      baseResults.push({ id: "notices", label: "All Notices", href: "/notices", type: "page" });
    }

    const noticeResults: DashboardSearchResult[] = getNotices()
      .slice(0, 8)
      .map((notice) => ({
        id: `notice-${notice.id}`,
        label: `Notice / ${notice.title}`,
        href: user?.role === "teacher" ? "/dashboard#notice-section" : "/notices",
        type: "notice",
      }));

    const query = searchQuery.trim().toLowerCase();
    const merged = [...baseResults, ...noticeResults];

    if (!query) {
      return merged.slice(0, 8);
    }

    return merged.filter((item) => item.label.toLowerCase().includes(query)).slice(0, 8);
  }, [searchQuery, noticeCount, user?.role]);

  const unreadNoticeCount = Math.max(noticeCount - readCount, 0);

  const openNoticeSection = () => {
    if (typeof window !== "undefined") {
      const totalNotices = getNotices().length;
      window.localStorage.setItem(CMS_NOTICE_READ_COUNT_KEY, String(totalNotices));
      setReadCount(totalNotices);
    }

    setIsSearchOpen(false);
    setSearchQuery("");

    if (user?.role === "teacher") {
      navigate("/dashboard#notice-section");
      return;
    }

    navigate("/notices");
  };

  return (
    <header className="cms-topbar border-b border-[#D6E4FF] bg-gradient-to-r from-white via-[#F8FBFF] to-[#EEF5FF] shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-semibold text-[#112F68]">Welcome back, {user ? displayRole : "..."}</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-600 hover:text-[#112F68]"
              onClick={() => setIsSearchOpen((prev) => !prev)}
            >
              <Search className="h-4 w-4" />
            </Button>

            {isSearchOpen && (
              <div className="absolute right-0 top-full z-20 mt-2 w-80 rounded-3xl border border-[#D6E4FF] bg-white p-4 shadow-xl">
                <div className="flex items-center gap-2 rounded-2xl border border-[#D6E4FF] px-3 py-2">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search dashboard and notices..."
                    className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                  <button type="button" onClick={() => setIsSearchOpen(false)} className="text-slate-400">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 space-y-2">
                  {dashboardSearchResults.length === 0 ? (
                    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                      No matching result found.
                    </div>
                  ) : (
                    dashboardSearchResults.map((result) => (
                      <button
                        key={result.id}
                        type="button"
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery("");
                          navigate(result.href);
                        }}
                        className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-colors hover:bg-[#F4F8FF]"
                      >
                        <div>
                          <div className="text-sm font-medium text-slate-800">{result.label}</div>
                          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                            {result.type}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="relative text-slate-600 hover:text-[#112F68]"
              onClick={openNoticeSection}
            >
              <Bell className="h-4 w-4" />
              {unreadNoticeCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold leading-none text-white">
                  {unreadNoticeCount}
                </span>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-3 border-l border-[#D6E4FF] pl-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-[#D9E8FF] bg-[#EEF5FF]">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <UserIcon className="h-4 w-4 text-[#0A8B69]" />
                )}
              </div>
              <span className="text-sm font-medium text-slate-700">{user?.email || "..."}</span>
            </div>

            <Button
              onClick={signOut}
              variant="outline"
              size="sm"
              className="border-[#CCD4E3] bg-transparent text-[#112F68] hover:bg-[#F3F6FF]"
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
