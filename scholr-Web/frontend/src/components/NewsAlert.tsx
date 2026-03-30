import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { X, Bell, Zap, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const NewsAlert = () => {
    const [isVisible, setIsVisible] = useState(true);
    const alertRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    const sparklesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isVisible)
            return;

        gsap.set(alertRef.current, { y: -100, opacity: 0 });
        gsap.set([iconRef.current, textRef.current, closeRef.current], {
            opacity: 0,
            scale: 0.8,
            y: 20
        });

        const tl = gsap.timeline({ delay: 2 });
        tl.to(alertRef.current, {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "elastic.out(1, 0.6)"
        })
            .to(iconRef.current, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: "back.out(2)"
        }, "-=0.6")
            .to(textRef.current, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: "power4.out"
        }, "-=0.4")
            .to(closeRef.current, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            ease: "back.out(1.4)"
        }, "-=0.2");

        gsap.to(iconRef.current, {
            rotation: 360,
            duration: 4,
            ease: "none",
            repeat: -1
        });
        gsap.to(sparklesRef.current?.children, {
            scale: 1.2,
            opacity: 0.8,
            duration: 2,
            ease: "power2.inOut",
            yoyo: true,
            repeat: -1,
            stagger: 0.3
        });
        gsap.to(iconRef.current?.querySelector(".bell-icon"), {
            scale: 1.1,
            duration: 1.5,
            ease: "power2.inOut",
            yoyo: true,
            repeat: -1
        });

        return () => {
            tl.kill();
        };
    }, [isVisible]);

    const handleClose = () => {
        const tl = gsap.timeline({
            onComplete: () => setIsVisible(false)
        });
        tl.to(contentRef.current, {
            scale: 0.9,
            opacity: 0.7,
            duration: 0.2
        })
            .to(alertRef.current, {
            y: -100,
            opacity: 0,
            scale: 0.8,
            duration: 0.5,
            ease: "power3.in"
        }, "-=0.1");
    };

    if (!isVisible)
        return null;

    return (<div ref={alertRef} className="fixed left-0 right-0 top-[4.75rem] z-40 px-3 sm:left-1/2 sm:right-auto sm:top-24 sm:w-full sm:max-w-4xl sm:-translate-x-1/2 sm:px-4">
      <div ref={contentRef} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 shadow-2xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-white/20 via-transparent to-white/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 2px, transparent 2px),
                               radial-gradient(circle at 80% 50%, white 2px, transparent 2px)`,
            backgroundSize: "60px 60px, 40px 40px"
        }}></div>
        </div>

        <div ref={sparklesRef} className="pointer-events-none absolute inset-0 hidden sm:block">
          <Star className="absolute left-8 top-4 h-4 w-4 text-white/60"/>
          <Zap className="absolute right-12 top-6 h-5 w-5 text-white/60"/>
          <Star className="absolute bottom-4 left-16 h-3 w-3 text-white/60"/>
          <Zap className="absolute bottom-6 right-8 h-4 w-4 text-white/60"/>
        </div>

        <div className="relative flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div ref={iconRef} className="hidden flex-shrink-0 sm:block">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Bell className="bell-icon h-6 w-6 text-white"/>
            </div>
          </div>

          <div ref={textRef} className="flex-1 sm:mx-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="pr-8 sm:pr-0">
                <h3 className="mb-1 text-base font-bold text-white sm:text-lg">
                  Admissions Open for 2024-25!
                </h3>
                <p className="text-sm text-white/90">
                  Limited seats available for BCA & B.Tech programs. Apply now !
                </p>
              </div>

              <div className="sm:ml-4">
                <Button size="sm" className="w-full bg-white font-semibold text-orange-600 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-white/90 sm:w-auto" onClick={() => window.location.href = "/apply"}>
                  Apply Now
                  <ArrowRight className="ml-2 h-4 w-4"/>
                </Button>
              </div>
            </div>
          </div>

          <button ref={closeRef} onClick={handleClose} className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/30 sm:static sm:flex-shrink-0">
            <X className="h-4 w-4 text-white"/>
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400"></div>
      </div>
    </div>);
};

export default NewsAlert;
