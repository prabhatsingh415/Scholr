import { useEffect, useMemo, useState } from "react";
import { Bell, Download, ExternalLink, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCmsStore } from "@/stores/use-cms-store";
import { type Notice } from "@/lib/local-storage";
import { downloadNoticeAttachment, openNoticeAttachment } from "@/lib/notice-attachments";

const NOTICE_READ_COUNT_KEY = "public_notice_read_count";

const formatNoticeDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const getAudienceLabel = (audience: Notice["audience"]) => {
  if (audience === "teacher") return "Faculty";
  if (audience === "student") return "Students";
  return "All";
};

export default function PublicNotices() {
  const notices = useCmsStore((state) => state.notices);
  const initializeCmsStore = useCmsStore((state) => state.initialize);
  const isHydrated = useCmsStore((state) => state.isHydrated);
  const [query, setQuery] = useState("");

  useEffect(() => {
    initializeCmsStore();
  }, [initializeCmsStore]);

  useEffect(() => {
    if (typeof window === "undefined" || !isHydrated) {
      return;
    }

    window.localStorage.setItem(NOTICE_READ_COUNT_KEY, String(notices.length));
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: NOTICE_READ_COUNT_KEY,
        newValue: String(notices.length),
      }),
    );
  }, [isHydrated, notices.length]);

  const filteredNotices = useMemo(() => {
    const sorted = [...notices].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return sorted;
    }

    return sorted.filter((notice) =>
      [notice.title, notice.message, notice.file_name, getAudienceLabel(notice.audience)]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalizedQuery)),
    );
  }, [notices, query]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Header />

      <main className="px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-6 py-10 text-white sm:px-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm">
                    <Bell className="h-4 w-4" />
                    Main Website Notice Board
                  </div>
                  <h1 className="mt-5 text-3xl font-semibold sm:text-4xl">
                    All Notices ({isHydrated ? filteredNotices.length : notices.length})
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">
                    View the same latest notices published from the dashboard. New notices will
                    also appear on the website header with an unread count.
                  </p>
                </div>

                <div className="w-full max-w-md">
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                    <Search className="h-4 w-4 text-slate-300" />
                    <Input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search notices by title, message or file..."
                      className="border-0 bg-transparent px-0 text-white placeholder:text-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div id="notice-section" className="space-y-6 px-6 py-8 sm:px-10">
              {!isHydrated ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                  <p className="text-lg font-medium text-slate-900">Loading notices...</p>
                  <p className="mt-2 text-sm text-slate-500">
                    Fetching the latest notices published from the dashboard.
                  </p>
                </div>
              ) : filteredNotices.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                  <p className="text-lg font-medium text-slate-900">No notices found</p>
                  <p className="mt-2 text-sm text-slate-500">
                    Try another search term or add a notice from the dashboard.
                  </p>
                </div>
              ) : (
                filteredNotices.map((notice) => (
                  <article
                    key={notice.id}
                    className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <h2 className="text-2xl font-semibold text-slate-950">{notice.title}</h2>
                        <p className="mt-3 whitespace-pre-line text-base leading-7 text-slate-700">
                          {notice.message}
                        </p>

                        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
                          <Badge
                            variant="secondary"
                            className="rounded-full bg-slate-100 px-4 py-1 text-slate-900"
                          >
                            {getAudienceLabel(notice.audience)}
                          </Badge>
                          <span className="text-slate-500">{formatNoticeDate(notice.created_at)}</span>
                        </div>

                        {notice.file_data_url && (
                          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
                            <button
                              type="button"
                              onClick={() => openNoticeAttachment(notice)}
                              className="inline-flex items-center gap-2 font-medium text-teal-700 transition-colors hover:text-teal-800"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Open: {notice.file_name || "Attachment"}
                            </button>
                            <button
                              type="button"
                              onClick={() => downloadNoticeAttachment(notice)}
                              className="inline-flex items-center gap-2 font-medium text-teal-700 transition-colors hover:text-teal-800"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
