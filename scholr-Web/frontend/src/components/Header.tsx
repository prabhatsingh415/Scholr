import { useEffect, useRef, useState, type ReactNode } from "react";
import { Bell, ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CMS_DB_UPDATED_EVENT, getNotices, type CmsDbUpdatedDetail } from "@/lib/local-storage";

type NavigationLink = {
  name: string;
  href: string;
};

type NavigationItem = {
  name: string;
  href?: string;
  submenu?: NavigationLink[];
};

const NOTICE_READ_COUNT_KEY = "public_notice_read_count";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [submenus, setSubmenus] = useState<Record<string, boolean>>({});
  const [noticeCount, setNoticeCount] = useState(0);
  const [readCount, setReadCount] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: NavigationItem[] = [
    { name: "Home", href: "/" },
    {
      name: "Academics",
      submenu: [
        { name: "Academic Calendar", href: "https://rtu.ac.in/index/viewdata.php?page=Academic-Calendar1" },
        { name: "Syllabus", href: "/academic-programs" },
        { name: "Results", href: "https://rtu.sumsraj.com/Exam/Report/DownloadGradesheet.aspx" },
        { name: "Time Table Management", href: "/timetable" },
      ],
    },
    {
      name: "Cells",
      submenu: [
        { name: "AICTE Cells", href: "/college-cells" },
        { name: "Alumni Cells", href: "/college-cells" },
        { name: "Campus Development & Planning Cells", href: "/college-cells" },
        { name: "EAP Cells", href: "/college-cells" },
        { name: "Environment Cells", href: "/college-cells" },
        { name: "IIC Cells", href: "/college-cells" },
        { name: "NBA Cells", href: "/college-cells" },
        { name: "Sports Department Cells", href: "/college-cells" },
      ],
    },
    { name: "Faculty", href: "/faculty" },
    { name: "Event", href: "/events" },
    { name: "Notice", href: "/notice" },
    { name: "About Us", href: "/about" },
  ];

  const isExternalLink = (href: string) => href.startsWith("http");
  const isAnchorLink = (href: string) => href.startsWith("#");
  const isInternalLink = (href: string) => href.startsWith("/");
  const isActivePath = (href?: string) =>
    Boolean(href && isInternalLink(href) && location.pathname.toLowerCase() === href.toLowerCase());
  const currentPageLabel =
    navItems.find((item) => item.href && isActivePath(item.href))?.name ?? "Current page";

  useEffect(() => {
    const tl = gsap.timeline();
    gsap.set([logoRef.current, navRef.current, ctaRef.current], {
      opacity: 0,
      y: -30,
    });

    tl.to(logoRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power4.out",
    })
      .to(
        navRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power4.out",
        },
        "-=0.8",
      )
      .to(
        ctaRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power4.out",
        },
        "-=0.6",
      );

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      gsap.to(headerRef.current, {
        y: 0,
        scaleY: 1,
        duration: 0.3,
        ease: "power2.out",
      });
      return;
    }

    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        gsap.to(headerRef.current, {
          y: -100,
          scaleY: 0.8,
          duration: 0.6,
          ease: "power3.inOut",
        });
      } else {
        gsap.to(headerRef.current, {
          y: 0,
          scaleY: 1,
          duration: 0.8,
          ease: "back.out(1.4)",
        });
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
    setSubmenus({});
  }, [location.pathname]);

  useEffect(() => {
    const syncCounts = () => {
      const notices = getNotices();
      setNoticeCount(notices.length);

      if (typeof window === "undefined") {
        return;
      }

      const storedReadCount = Number(window.localStorage.getItem(NOTICE_READ_COUNT_KEY) || "0");
      setReadCount(Number.isFinite(storedReadCount) ? storedReadCount : 0);
    };

    syncCounts();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "notices" || event.key === NOTICE_READ_COUNT_KEY || event.key === null) {
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

  const unreadNoticeCount = Math.max(noticeCount - readCount, 0);
  const shouldShowUnreadNotice = unreadNoticeCount > 0 && location.pathname.toLowerCase() !== "/notice";

  const closeMenu = () => {
    setIsMenuOpen(false);
    setSubmenus({});
  };

  const handleMenuChange = (open: boolean) => {
    setIsMenuOpen(open);
    if (!open) {
      setSubmenus({});
    }
  };

  const toggleMenu = () => {
    handleMenuChange(!isMenuOpen);
  };

  const toggleSubmenu = (menuName: string) => {
    setSubmenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const openNoticePage = () => {
    if (typeof window !== "undefined") {
      const totalNotices = getNotices().length;
      window.localStorage.setItem(NOTICE_READ_COUNT_KEY, String(totalNotices));
      setReadCount(totalNotices);
    }

    navigate("/notice#notice-section");
  };

  const renderLink = (href: string, className: string, children: ReactNode, onClick?: () => void) => {
    if (isExternalLink(href)) {
      return (
        <a href={href} className={className} onClick={onClick}>
          {children}
        </a>
      );
    }

    if (isAnchorLink(href)) {
      return (
        <Link to={`/${href}`} className={className} onClick={onClick}>
          {children}
        </Link>
      );
    }

    return (
      <Link to={href} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  };

  return (
    <header
      ref={headerRef}
      className="fixed left-0 right-0 top-0 z-50 border-b border-border/50 bg-background/90 shadow-[0_10px_35px_rgba(2,8,23,0.08)] backdrop-blur-xl"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-[4.5rem] items-center justify-between gap-3 lg:h-20">
          <div ref={logoRef} className="flex items-center">
            <div className="flex items-center justify-center py-3">
              <Link to="/" className="block">
                <div className="flex flex-col leading-none text-slate-950">
                  <span className="font-serif text-[2.15rem] tracking-tight sm:text-[2.5rem]">GECB</span>
                  <span className="mt-1 text-[0.42rem] font-semibold uppercase tracking-[0.22em] text-slate-900 sm:text-[0.5rem]">
                    Engineering College Baran
                  </span>
                </div>
              </Link>
            </div>
          </div>

          <nav ref={navRef} className="hidden items-center space-x-10 lg:flex">
            {navItems.map((item, index) => {
              const isNoticeItem = item.name === "Notice" && !item.submenu;

              return (
                <div key={index} className="group relative">
                  {item.submenu ? (
                    <>
                      <button
                        className="flex items-center space-x-1 font-medium uppercase text-foreground transition-all duration-300 hover:text-primary"
                        onClick={() => toggleSubmenu(item.name)}
                      >
                        <span>{item.name}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${submenus[item.name] ? "rotate-0" : "-rotate-90"}`}
                        />
                      </button>
                      {submenus[item.name] && (
                        <div className="pointer-events-auto absolute top-full min-w-[calc(100%+112px)] -translate-x-10 pt-8 font-normal opacity-100 transition-opacity">
                          <ul className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
                            {item.submenu.map((subItem, subIndex) => (
                              <li
                                key={subIndex}
                                className="group/child relative whitespace-nowrap border-b border-slate-100 last:border-b-0"
                              >
                                <Link
                                  to={subItem.href || "/"}
                                  className="flex items-center gap-2 px-10 py-6 transition-colors group-hover/child:bg-slate-50 group-hover/child:font-bold group-hover/child:text-primary"
                                >
                                  {subItem.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="relative">
                      {renderLink(
                        item.href!,
                        cn(
                          "relative font-medium uppercase transition-all duration-300 hover:text-primary",
                          isActivePath(item.href) ? "text-primary" : "text-foreground",
                        ),
                        item.name,
                      )}
                      {isNoticeItem && shouldShowUnreadNotice && (
                        <button
                          type="button"
                          onClick={openNoticePage}
                          className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700 shadow-sm"
                        >
                          You have an unread Notice +{unreadNoticeCount}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div ref={ctaRef} className="hidden items-center space-x-3 lg:flex">
            <Button
              variant="outline"
              className="border-2 transition-all duration-300 hover:scale-105"
              onClick={() => (window.location.href = "/login")}
            >
              Login
            </Button>
            <Button
              onClick={() => (window.location.href = "/apply")}
              className="bg-gradient-to-r from-primary to-primary/80 shadow-lg transition-all duration-300 hover:scale-105"
            >
              Enquiry Now
            </Button>
          </div>

          <Sheet open={isMenuOpen} onOpenChange={handleMenuChange}>
            <button
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-foreground shadow-sm transition-colors hover:bg-accent lg:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <SheetContent
              side="right"
              className="w-full max-w-[22rem] border-l border-white/10 bg-[#040814] p-0 text-white sm:max-w-[26rem] [&>button]:hidden"
            >
              <div className="flex h-full flex-col bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.28),_transparent_48%),linear-gradient(180deg,_#0b1220_0%,_#020617_100%)]">
                <div className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/80 px-5 py-5 backdrop-blur-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.35em] text-white/45">Navigation</p>
                      <h2 className="mt-2 text-xl font-semibold text-white">Explore GECB</h2>
                      <p className="mt-1 text-sm text-white/60">
                        Tap the cross icon any time to go back to the page.
                      </p>
                    </div>

                    <SheetClose asChild>
                      <button
                        aria-label="Close menu"
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </SheetClose>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-5 pb-6 pt-5">
                  <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-4 shadow-[0_20px_60px_rgba(15,23,42,0.45)]">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/45">You are viewing</p>
                    <p className="mt-2 text-lg font-semibold text-white">{currentPageLabel}</p>
                    <p className="mt-1 text-sm text-white/60">
                      The menu now stays easy to close even after scrolling.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      openNoticePage();
                    }}
                    className="mt-5 flex w-full items-center justify-between rounded-[1.5rem] border border-amber-400/25 bg-amber-500/10 px-4 py-4 text-left"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white">Website Notices</div>
                      <div className="mt-1 text-xs text-white/70">Tap to open the notice section</div>
                    </div>
                    {unreadNoticeCount > 0 ? (
                      <span className="rounded-md bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                        +{unreadNoticeCount}
                      </span>
                    ) : (
                      <Bell className="h-5 w-5 text-amber-200" />
                    )}
                  </button>

                  <ul className="mt-6 flex flex-col gap-3">
                    {navItems.map((item, index) => (
                      <li key={index} className="w-full">
                        {item.submenu ? (
                          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-2 shadow-lg shadow-slate-950/20">
                            <button
                              className="flex w-full items-center justify-between gap-4 rounded-[1.1rem] px-4 py-4 text-left text-lg font-semibold text-white transition-colors hover:bg-white/5"
                              onClick={() => toggleSubmenu(item.name)}
                            >
                              <span>{item.name}</span>
                              <ChevronDown
                                className={`h-5 w-5 text-white/70 transition-transform ${submenus[item.name] ? "rotate-0" : "-rotate-90"}`}
                              />
                            </button>

                            {submenus[item.name] && (
                              <ul className="space-y-2 px-2 pb-2 pt-1">
                                {item.submenu.map((subItem, subIndex) => (
                                  <li key={subIndex}>
                                    <a
                                      href={subItem.href}
                                      className="flex items-center justify-between rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-sm font-medium text-white/85 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
                                      onClick={closeMenu}
                                    >
                                      <span className="pr-4">{subItem.name}</span>
                                      <ChevronRight className="h-4 w-4 flex-shrink-0 text-white/45" />
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ) : (
                          renderLink(
                            item.href!,
                            cn(
                              "group flex items-center justify-between rounded-[1.5rem] border px-4 py-4 text-lg font-semibold transition-all",
                              isActivePath(item.href)
                                ? "border-primary/60 bg-primary/20 text-white shadow-[0_20px_50px_rgba(37,99,235,0.22)]"
                                : "border-white/10 bg-white/[0.04] text-white/90 hover:border-white/20 hover:bg-white/10",
                            ),
                            <>
                              <span>{item.name}</span>
                              <ChevronRight className="h-5 w-5 flex-shrink-0 text-white/45 transition-transform group-hover:translate-x-1" />
                            </>,
                            closeMenu,
                          )
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-white/10 bg-slate-950/80 px-5 py-5 backdrop-blur-xl">
                  <div className="flex flex-col gap-3">
                    <Button
                      className="w-full rounded-2xl bg-gradient-to-r from-primary to-primary/80 py-6 text-base font-semibold shadow-lg shadow-primary/20"
                      onClick={() => {
                        closeMenu();
                        window.location.href = "/apply";
                      }}
                    >
                      Enquiry Now
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full rounded-2xl border-white/15 bg-white text-black transition-colors hover:bg-white/90 hover:text-black"
                      onClick={() => {
                        closeMenu();
                        window.location.href = "/login";
                      }}
                    >
                      Login
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
