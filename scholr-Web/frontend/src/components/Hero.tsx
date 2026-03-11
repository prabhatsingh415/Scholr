import { useEffect, useRef } from "react";
import { ArrowRight, Play, Star, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
const Hero = () => {
    const heroRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLImageElement>(null);
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
            animateCount(yearsRef, 5, "+");
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
    return (<section ref={heroRef} id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      
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

      
      <div className="relative z-20 container mx-auto px-6 text-center text-white">
        <div className="max-w-5xl mx-auto">

          
          <div className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-lg rounded-full px-6 py-3 mb-8 border border-white/30">
            <Award className="w-5 h-5 text-yellow-300"/>
            <span className="text-sm font-semibold tracking-wide">Excellence in Education </span>
            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300"/>
          </div>

          
          <img ref={headingRef} src="/images/ENGNEERING COLLEGE BARAN (2).png" alt="Logo" className="mx-auto mb-10 w-70 md:w-96"/>

          
         <p ref={subtitleRef} className="text-4xl md:text-5xl mb-12 max-w-3xl mx-auto font-900 leading-relaxed block text-white" style={{ fontFamily: "'Rock Salt', sans-serif" }}>
  Your Career Starts Here
    </p>


          
          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 group px-8 py-4 text-lg font-semibold shadow-xl">
              Discover Excellence
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-all duration-300"/>
            </Button>
            <a href="/ExperienceCampus" className="relative text-foreground hover:text-primary transition-all duration-300 font-medium group">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold backdrop-blur-sm">
                <Play className="w-6 h-6 mr-3"/>
                Experience Campus
              </Button>
            </a>
          </div>

          
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-12 pt-12 border-t border-white/30">
            <div className="group">
              <div ref={studentRef} className="text-4xl md:text-5xl font-bold text-yellow-300 mb-2 group-hover:scale-110 transition-all duration-300">0+</div>
              <div className="text-sm text-white/80 font-medium tracking-wide">Students</div>
            </div>
            <div className="group">
              <div ref={successRef} className="text-4xl md:text-5xl font-bold text-yellow-300 mb-2 group-hover:scale-110 transition-all duration-300">0%</div>
              <div className="text-sm text-white/80 font-medium tracking-wide">Success Rate</div>
            </div>
            <div className="group">
              <div ref={facultyRef} className="text-4xl md:text-5xl font-bold text-yellow-300 mb-2 group-hover:scale-110 transition-all duration-300">0+</div>
              <div className="text-sm text-white/80 font-medium tracking-wide">Expert Faculty</div>
            </div>
            <div className="group">
              <div ref={yearsRef} className="text-4xl md:text-5xl font-bold text-yellow-300 mb-2 group-hover:scale-110 transition-all duration-300">0+</div>
              <div className="text-sm text-white/80 font-medium tracking-wide">Years of Excellence</div>
            </div>
          </div>
        </div>
      </div>

      
      <div ref={floatingRef}>
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-yellow-300/30 to-yellow-400/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-20 w-48 h-48 bg-gradient-to-br from-white/20 to-white/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-br from-yellow-200/40 to-yellow-300/30 rounded-full blur-lg"></div>
      </div>
    </section>);
};
export default Hero;
