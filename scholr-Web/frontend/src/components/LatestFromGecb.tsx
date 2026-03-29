import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  FileText,
  FolderOpen,
  Newspaper,
  ScrollText,
  X,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type UpdateCategory = "news" | "orders" | "tenders" | "formats";

type UpdateItem = {
  id: string;
  date: string;
  title: string;
  summary: string;
  tag: string;
};

type CategoryMeta = {
  label: string;
  eyebrow: string;
  description: string;
  icon: typeof Newspaper;
  previewHeader: string;
};

const categoryMeta: Record<UpdateCategory, CategoryMeta> = {
  news: {
    label: "News",
    eyebrow: "Campus Announcements",
    description:
      "Important academic circulars, student notices, and institutional announcements curated in one place.",
    icon: Newspaper,
    previewHeader: "bg-[#423890]",
  },
  orders: {
    label: "Orders",
    eyebrow: "Official Orders",
    description:
      "Administrative decisions, examination schedules, and formal orders for students and departments.",
    icon: ScrollText,
    previewHeader: "bg-[#423890]",
  },
  tenders: {
    label: "Tenders",
    eyebrow: "Procurement Notices",
    description:
      "Latest tender invitations, procurement highlights, and facility development updates from the college.",
    icon: FileText,
    previewHeader: "bg-[#423890]",
  },
  formats: {
    label: "Formats",
    eyebrow: "Student Resources",
    description:
      "Frequently used academic forms and downloadable request formats for students, staff, and visitors.",
    icon: FolderOpen,
    previewHeader: "bg-[#423890]",
  },
};

const updateCatalog: Record<UpdateCategory, UpdateItem[]> = {
  news: [
    {
      id: "news-1",
      date: "16/03/2026",
      title:
        "BTU circular for exam form filling for PG Courses IV Semester Main and Back Exam 2025-26",
      summary:
        "Deadline and examination form guidance for postgraduate students has been published for the current session.",
      tag: "Link",
    },
    {
      id: "news-2",
      date: "10/03/2026",
      title:
        "List of students who have not yet deposited their semester fee for the session 2025-26",
      summary:
        "Fee defaulter list shared for timely action and document clearance before upcoming academic processes.",
      tag: "Link",
    },
    {
      id: "news-3",
      date: "05/03/2026",
      title:
        "BTU circular for exam form filling for B.Tech IV, VI and VIII Semester Main and Back 2025-26",
      summary:
        "Students from all senior semesters can review the submission schedule and reporting requirements here.",
      tag: "Link",
    },
    {
      id: "news-4",
      date: "01/03/2026",
      title: "Mid-semester practical examination window announced for all departments",
      summary:
        "Department-wise practical slots and submission checkpoints have been finalized for internal assessments.",
      tag: "Link",
    },
  ],
  orders: [
    {
      id: "order-1",
      date: "07/02/2026",
      title: "Practical Time Table M.Tech 3rd Semester Main and Back Information Technology",
      summary:
        "Updated schedule released for M.Tech practical examinations with revised subject-wise slots.",
      tag: "Link",
    },
    {
      id: "order-2",
      date: "07/02/2026",
      title: "B.Tech 4th Semester CS-A, CS-B, IT and Cyber 1st Mid Term Exam 2025-26",
      summary:
        "Mid-term order includes classroom distribution, reporting time, and internal assessment instructions.",
      tag: "Link",
    },
    {
      id: "order-3",
      date: "05/02/2026",
      title: "Practical Time Table M.Tech 3rd Semester Computer Science Engineering",
      summary:
        "Separate batch schedule published for CSE practical examinations and lab reporting sequence.",
      tag: "Link",
    },
    {
      id: "order-4",
      date: "01/02/2026",
      title: "Revised duty order for internal examination invigilation and evaluation committee",
      summary:
        "Faculty duty distribution updated to streamline examination execution and document verification.",
      tag: "Link",
    },
  ],
  tenders: [
    {
      id: "tender-1",
      date: "28/09/2024",
      title: "Tender notice for civil work for SC/ST Girls Hostel",
      summary:
        "Infrastructure expansion notice covering development work and campus facility enhancement.",
      tag: "Link",
    },
    {
      id: "tender-2",
      date: "14/09/2024",
      title: "Canteen Tender 2024-25 and 2025-26",
      summary:
        "Operational tender released for student canteen services with defined contract terms and conditions.",
      tag: "Link",
    },
    {
      id: "tender-3",
      date: "28/08/2024",
      title: "Tender for manpower services",
      summary:
        "Vendor applications invited for manpower support and institutional service requirements.",
      tag: "Link",
    },
    {
      id: "tender-4",
      date: "20/08/2024",
      title: "GeM bid document for classroom furniture and fixed desk-bench supply",
      summary:
        "Furniture procurement update focused on classroom upgrades and improved teaching spaces.",
      tag: "Link",
    },
  ],
  formats: [
    {
      id: "format-1",
      date: "15/03/2026",
      title: "Bonafide certificate application format",
      summary:
        "Ready-to-use format for students who need an official bonafide certificate for academic or external use.",
      tag: "Link",
    },
    {
      id: "format-2",
      date: "12/03/2026",
      title: "No dues clearance form for final year students",
      summary:
        "Department and library clearance format prepared for final documentation before degree processing.",
      tag: "Link",
    },
    {
      id: "format-3",
      date: "08/03/2026",
      title: "Scholarship verification request format",
      summary:
        "Standardized verification request document for scholarship submission and renewal support.",
      tag: "Link",
    },
    {
      id: "format-4",
      date: "03/03/2026",
      title: "Hostel application and room allotment request format",
      summary:
        "Hostel admission support form with essential fields for allotment and student record verification.",
      tag: "Link",
    },
  ],
};

const categories = Object.keys(categoryMeta) as UpdateCategory[];

const LatestFromGecb = () => {
  const [activeTab, setActiveTab] = useState<UpdateCategory>("news");
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [shouldScrollToDetail, setShouldScrollToDetail] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shouldScrollToDetail || !detailRef.current) return;

    detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    setShouldScrollToDetail(false);
  }, [shouldScrollToDetail, activeTab]);

  const openDetailView = (category: UpdateCategory) => {
    setActiveTab(category);
    setIsDetailVisible(true);
    setShouldScrollToDetail(true);
  };

  const closeDetailView = () => {
    setIsDetailVisible(false);
    document
      .getElementById("latest-updates")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="latest-updates" className="bg-slate-100">
      <div className="relative overflow-hidden bg-slate-950 py-10 sm:py-12 lg:py-14">
        <div className="absolute inset-0">
          <img
            src="/images/ENGNEERING COLLEGE BARAN (2).png"
            alt="GECB campus"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-slate-950/65" />
          <div className="absolute inset-0 bg-gradient-to-b from-sky-500/20 via-slate-950/55 to-slate-950/85" />
        </div>

        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(125,211,252,0.28) 0, transparent 18%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.16) 0, transparent 14%), radial-gradient(circle at 50% 80%, rgba(56,189,248,0.2) 0, transparent 16%)",
          }}
        />

        <div className="container relative z-10 mx-auto px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {categories.map((category) => {
              const meta = categoryMeta[category];
              const Icon = meta.icon;
              const previewItems = updateCatalog[category].slice(0, 4);

              return (
                <article
                  key={category}
                  className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/40 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.35)]"
                >
                  <div
                    className={cn(
                      "flex items-center justify-center gap-4 px-6 py-7 text-white",
                      meta.previewHeader
                    )}
                  >
                    <Icon className="h-8 w-8" />
                    <h3 className="text-2xl font-semibold">{meta.label}</h3>
                  </div>

                  <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
                    <div className="space-y-4">
                      {previewItems.map((item) => (
                        <div
                          key={item.id}
                          className="border-b border-slate-200 pb-4 last:border-b-0 last:pb-0"
                        >
                          <p className="text-lg leading-snug text-[#0069FF]">
                            {item.title}
                          </p>
                          <p className="mt-1 text-base text-slate-500">
                            ({item.date})
                          </p>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => openDetailView(category)}
                      className="mx-auto mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#423890] px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#352d78]"
                    >
                      View All
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      {isDetailVisible ? (
        <div ref={detailRef} className="bg-white py-14 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-[0_25px_70px_rgba(15,23,42,0.18)]">
              <img
                src="/images/ENGNEERING COLLEGE BARAN (2).png"
                alt="Latest from GECB"
                className="h-[260px] w-full object-cover sm:h-[320px] lg:h-[360px]"
              />
              <div className="absolute inset-0 bg-slate-950/55" />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/35 to-slate-950/70" />

              <button
                type="button"
                onClick={closeDetailView}
                className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/40"
              >
                <X className="h-4 w-4" />
                Close
              </button>

              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-100 sm:text-sm">
                  {categoryMeta[activeTab].eyebrow}
                </p>
                <h3 className="mt-4 text-4xl font-bold sm:text-5xl lg:text-7xl">
                  Latest From GECB
                </h3>
                <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-lg">
                  {categoryMeta[activeTab].description}
                </p>
              </div>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as UpdateCategory)}
              className="-mt-8 sm:-mt-10"
            >
              <div className="relative z-10 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.14)] sm:p-5">
                <TabsList className="grid h-auto w-full grid-cols-2 gap-3 rounded-[1.5rem] bg-transparent p-0 md:grid-cols-4">
                  {categories.map((category) => {
                    const meta = categoryMeta[category];

                    return (
                      <TabsTrigger
                        key={category}
                        value={category}
                        className="rounded-[1.1rem] border border-slate-200 bg-slate-100 px-5 py-4 text-base font-semibold text-slate-900 transition-all duration-300 data-[state=active]:border-sky-500 data-[state=active]:bg-[#109AE3] data-[state=active]:text-white data-[state=active]:shadow-none"
                      >
                        {meta.label}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>

              {categories.map((category) => (
                <TabsContent key={category} value={category} className="mt-8">
                  <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_15px_45px_rgba(15,23,42,0.08)]">
                    <div className="hidden grid-cols-[90px_180px_1fr_120px] items-center gap-4 border-b border-slate-200 bg-white px-9 py-5 text-base font-semibold text-slate-900 md:grid">
                      <span>S.No.</span>
                      <span>Date</span>
                      <span>Title</span>
                      <span className="text-right">View</span>
                    </div>

                    <div className="divide-y divide-slate-200">
                      {updateCatalog[category].map((item, index) => (
                        <div
                          key={item.id}
                          className="grid gap-4 px-5 py-5 md:grid-cols-[90px_180px_1fr_120px] md:items-center md:gap-4 md:px-9 md:py-8"
                        >
                          <div className="flex items-center justify-between text-base font-semibold text-slate-900 md:block">
                            <span className="text-sm font-medium text-slate-500 md:hidden">
                              S.No.
                            </span>
                            <span>{index + 1}</span>
                          </div>

                          <div className="flex items-center gap-2 text-base text-slate-700">
                            <CalendarDays className="h-4 w-4 text-sky-500 md:hidden" />
                            <span>{item.date}</span>
                          </div>

                          <div>
                            <h4 className="text-lg leading-relaxed text-slate-900">
                              {item.title}
                            </h4>
                          </div>

                          <div className="text-left md:text-right">
                            <button
                              type="button"
                              className="text-3xl font-medium text-[#1C4DFF] transition-colors hover:text-[#1237bb]"
                            >
                              {item.tag}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default LatestFromGecb;
