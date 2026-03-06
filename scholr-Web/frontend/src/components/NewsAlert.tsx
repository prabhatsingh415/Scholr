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
    return (<div ref={alertRef} className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-4xl px-4">
      <div ref={contentRef} className="relative bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl shadow-2xl overflow-hidden">
        
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 animate-pulse"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 2px, transparent 2px),
                               radial-gradient(circle at 80% 50%, white 2px, transparent 2px)`,
            backgroundSize: "60px 60px, 40px 40px"
        }}></div>
        </div>

        
        <div ref={sparklesRef} className="absolute inset-0 pointer-events-none">
          <Star className="absolute top-4 left-8 w-4 h-4 text-white/60"/>
          <Zap className="absolute top-6 right-12 w-5 h-5 text-white/60"/>
          <Star className="absolute bottom-4 left-16 w-3 h-3 text-white/60"/>
          <Zap className="absolute bottom-6 right-8 w-4 h-4 text-white/60"/>
        </div>

        <div className="relative flex items-center justify-between p-6">
          
          <div ref={iconRef} className="flex-shrink-0">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Bell className="bell-icon w-6 h-6 text-white"/>
            </div>
          </div>

          
          <div ref={textRef} className="flex-1 mx-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-white font-bold text-lg mb-1">
                  🎉 Admissions Open for 2024-25!
                </h3>
                <p className="text-white/90 text-sm">
                  Limited seats available for BCA & B.Tech programs. Apply now !
                </p>
              </div>
              
              <div className="mt-3 sm:mt-0 sm:ml-4">
                <Button size="sm" className="bg-white text-orange-600 hover:bg-white/90 font-semibold shadow-lg hover:scale-105 transition-all duration-300" onClick={() => window.location.href = "/apply"}>
                  Apply Now
                  <ArrowRight className="w-4 h-4 ml-2"/>
                </Button>
              </div>
            </div>
          </div>

          
          <button ref={closeRef} onClick={handleClose} className="flex-shrink-0 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110">
            <X className="w-4 h-4 text-white"/>
          </button>
        </div>

        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400"></div>
      </div>
    </div>);
};
export default NewsAlert;
