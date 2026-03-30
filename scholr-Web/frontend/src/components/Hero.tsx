import { useEffect, useRef } from "react";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
const Hero = () => {
    const heroRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const floatingRef = useRef<HTMLDivElement>(null);
    const parallaxRef = useRef<HTMLVideoElement>(null);
    const studentRef = useRef<HTMLDivElement>(null);
    const successRef = useRef<HTMLDivElement>(null);
    const facultyRef = useRef<HTMLDivElement>(null);
    const yearsRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const tl = gsap.timeline();
        gsap.set([headingRef.current, subtitleRef.current, buttonsRef.current, statsRef.current], {
            opacity: 0,
            y: 100,
            scale: 0.8
        });
        tl.to(headingRef.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.5,
            ease: "power4.out"
        })
            .to(subtitleRef.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: "power4.out"
        }, "-=1")
            .to(buttonsRef.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "back.out(1.4)"
        }, "-=0.6")
            .to(statsRef.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power4.out"
        }, "-=0.4");
        const animateCount = (ref: React.RefObject<HTMLDivElement>, endValue: number, suffix = "") => {
            const obj = { val: 0 };
            gsap.to(obj, {
                val: endValue,
                duration: 2,
                ease: "power1.out",
                onUpdate: () => {
                    if (ref.current) {
                        ref.current.textContent = `${Math.floor(obj.val)}${suffix}`;
                    }
                }
            });
        };
        tl.add(() => {
            animateCount(studentRef, 300, "+");
            animateCount(successRef, 98, "%");
            animateCount(facultyRef, 30, "+");
            animateCount(yearsRef, 7, "+");
        }, "-=0.4");
        gsap.to(floatingRef.current?.children, {
            y: -30,
            rotation: 360,
            duration: 8,
            ease: "power2.inOut",
            yoyo: true,
            repeat: -1,
            stagger: 1
        });
        const handleScroll = () => {
            const scrollY = window.scrollY;
            gsap.to(parallaxRef.current, {
                y: scrollY * 0.5,
                duration: 0.3
            });
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            tl.kill();
        };
    }, []);
    const scrollToCourses = () => {
        document.getElementById("courses")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    };
    return (<section ref={heroRef} id="home" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      
      <video ref={parallaxRef} className="absolute inset-0 w-full h-full object-cover scale-110" autoPlay muted loop playsInline>
        <source src="/videos/Untitled design (1).mp4" type="video/mp4"/>
        Your browser does not support the video tag.
      </video>

      
      <div className="absolute inset-0 opacity-20 z-15" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                            radial-gradient(circle at 70% 80%, white 1px, transparent 1px)`,
            backgroundSize: "100px 100px, 150px 150px"
        }}></div>

      
      <div className="relative z-20 container mx-auto px-4 pb-14 pt-32 text-center text-white sm:px-6 sm:pb-16 sm:pt-36 lg:pt-28">
        <div className="max-w-5xl mx-auto">

          <div ref={headingRef} className="mb-8 sm:mb-10">
            <div className="text-5xl font-semibold tracking-tight text-white drop-shadow-[0_18px_45px_rgba(0,0,0,0.4)] sm:text-6xl md:text-7xl lg:text-[8rem]">
              GECB
            </div>
            <div className="mt-2 text-xs uppercase tracking-[0.35em] text-white/85 sm:text-sm md:text-base">
              Government Engineering College Baran
            </div>
          </div>

          
         <p ref={subtitleRef} className="mx-auto mb-10 block max-w-3xl text-2xl leading-snug text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)] sm:mb-12 sm:text-3xl md:text-4xl lg:text-5xl" style={{ fontFamily: "'Rock Salt', sans-serif" }}>
  Your Career Starts Here
    </p>


          
          <div ref={buttonsRef} className="mb-12 flex flex-col items-stretch justify-center gap-4 sm:mb-16 sm:flex-row sm:items-center sm:gap-6">
            <Button size="lg" className="group w-full bg-white px-6 py-4 text-base font-semibold text-primary shadow-xl hover:bg-white/90 sm:w-auto sm:px-8 sm:text-lg" onClick={scrollToCourses}>
              Discover Excellence
              <ArrowRight className="ml-3 h-5 w-5 transition-all duration-300 group-hover:translate-x-2 sm:h-6 sm:w-6"/>
            </Button>
            <a href="/experience-campus" className="group relative block w-full font-medium text-foreground transition-all duration-300 hover:text-primary sm:w-auto">
              <Button size="lg" className="w-full bg-white px-6 py-4 text-base font-semibold text-primary shadow-xl hover:bg-white/90 sm:w-auto sm:px-8 sm:text-lg">
                <Play className="mr-3 h-5 w-5 sm:h-6 sm:w-6"/>
                Experience Campus
              </Button>
            </a>
          </div>

          
          <div ref={statsRef} className="grid grid-cols-2 gap-6 border-t border-white/30 pt-8 sm:gap-8 sm:pt-10 md:grid-cols-4 md:gap-10 lg:gap-12 lg:pt-12">
            <div className="group">
              <div ref={studentRef} className="mb-2 text-3xl font-bold text-yellow-300 transition-all duration-300 group-hover:scale-110 sm:text-4xl md:text-5xl">0+</div>
              <div className="text-xs font-medium tracking-[0.18em] text-white/80 sm:text-sm sm:tracking-wide">Students</div>
            </div>
            <div className="group">
              <div ref={successRef} className="mb-2 text-3xl font-bold text-yellow-300 transition-all duration-300 group-hover:scale-110 sm:text-4xl md:text-5xl">0%</div>
              <div className="text-xs font-medium tracking-[0.18em] text-white/80 sm:text-sm sm:tracking-wide">Success Rate</div>
            </div>
            <div className="group">
              <div ref={facultyRef} className="mb-2 text-3xl font-bold text-yellow-300 transition-all duration-300 group-hover:scale-110 sm:text-4xl md:text-5xl">0+</div>
              <div className="text-xs font-medium tracking-[0.18em] text-white/80 sm:text-sm sm:tracking-wide">Expert Faculty</div>
            </div>
            <div className="group">
              <div ref={yearsRef} className="mb-2 text-3xl font-bold text-yellow-300 transition-all duration-300 group-hover:scale-110 sm:text-4xl md:text-5xl">0+</div>
              <div className="text-xs font-medium tracking-[0.18em] text-white/80 sm:text-sm sm:tracking-wide">Years of Excellence</div>
            </div>
          </div>
        </div>
      </div>

      
      <div ref={floatingRef}>
        <div className="absolute left-6 top-24 hidden h-20 w-20 rounded-full bg-gradient-to-br from-yellow-300/30 to-yellow-400/20 blur-xl sm:block lg:left-20 lg:top-20 lg:h-32 lg:w-32"></div>
        <div className="absolute bottom-24 right-6 hidden h-24 w-24 rounded-full bg-gradient-to-br from-white/20 to-white/10 blur-2xl sm:block lg:bottom-32 lg:right-20 lg:h-48 lg:w-48"></div>
        <div className="absolute left-4 top-1/2 hidden h-16 w-16 rounded-full bg-gradient-to-br from-yellow-200/40 to-yellow-300/30 blur-lg md:block lg:left-10 lg:h-24 lg:w-24"></div>
      </div>
    </section>);
};
export default Hero;
