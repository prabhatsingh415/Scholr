import { useEffect, useRef } from "react";
import { ArrowRight, Code, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
const courseSections = {
    BTECH: {
        title: "Bachelor of Technology",
        icon: Cpu,
        description: "Advanced engineering and technology programs for future innovators",
        color: "from-purple-500 to-pink-500",
        path: "/courses/btech"
    },
    BCA: {
        title: "Bachelor of Computer Applications",
        icon: Code,
        description: "Comprehensive computer applications and software development programs",
        color: "from-blue-500 to-cyan-500",
        path: "/courses/bca"
    }
};
const CoursesSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const sectionsContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const section = sectionRef.current;
        if (!section)
            return;
        const floatingElements = document.querySelectorAll(".floating-bg-element");
        floatingElements.forEach((element, index) => {
            gsap.to(element, {
                y: -40,
                x: 20,
                rotation: 360,
                duration: 6 + index * 2,
                repeat: -1,
                yoyo: true,
                ease: "power2.inOut",
                delay: index * 1.5
            });
        });
        gsap.fromTo(headerRef.current, {
            opacity: 0,
            y: 100,
            rotationX: 45,
            scale: 0.8,
            transformOrigin: "center center"
        }, {
            opacity: 1,
            y: 0,
            rotationX: 0,
            scale: 1,
            duration: 1.5,
            ease: "back.out(2)",
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
            }
        });
        gsap.utils.toArray(".section-header").forEach((header: any, index) => {
            gsap.fromTo(header, {
                opacity: 0,
                y: 80,
                rotationY: 45,
                scale: 0.7,
                transformOrigin: "center center"
            }, {
                opacity: 1,
                y: 0,
                rotationY: 0,
                scale: 1,
                duration: 1.2,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: header,
                    start: "top 85%",
                },
                delay: index * 0.3
            });
        });
        gsap.utils.toArray(".section-icon").forEach((icon: any) => {
            gsap.fromTo(icon, {
                scale: 0,
                rotation: -180,
                opacity: 0
            }, {
                scale: 1,
                rotation: 0,
                opacity: 1,
                duration: 1,
                ease: "elastic.out(1, 0.8)",
                scrollTrigger: {
                    trigger: icon,
                    start: "top 90%",
                }
            });
        });
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);
    return (<section ref={sectionRef} id="courses" className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/20 to-background py-20 sm:py-24">
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="floating-bg-element absolute left-4 top-16 h-20 w-20 rounded-full bg-primary/5 blur-xl sm:left-10 sm:top-20 sm:h-32 sm:w-32"></div>
        <div className="floating-bg-element absolute right-4 top-24 h-24 w-24 rounded-full bg-blue-500/5 blur-xl sm:right-20 sm:top-40 sm:h-40 sm:w-40"></div>
        <div className="floating-bg-element absolute bottom-32 left-1/4 hidden h-24 w-24 rounded-full bg-purple-500/5 blur-xl sm:block"></div>
        <div className="floating-bg-element absolute bottom-12 right-1/4 hidden h-36 w-36 rounded-full bg-pink-500/5 blur-xl sm:block"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        <div ref={headerRef} className="mb-14 text-center sm:mb-20">
          <h2 className="mb-6 bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent sm:mb-8 sm:text-5xl md:text-6xl">
            Discover Your
            <span className="block text-primary"> Perfect Course</span>
          </h2>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-2xl">
            Choose from our comprehensive <span className="text-purple-600 font-semibold">B.Tech</span> and <span className="text-blue-600 font-semibold">BCA</span> programs designed to prepare you for success in today's competitive world.
          </p>
        </div>

        
        <div ref={sectionsContainerRef} className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {Object.entries(courseSections).map(([key, section]) => {
            const IconComponent = section.icon;
            return (<div key={key} className="section-header group relative overflow-hidden rounded-[2rem] border border-border bg-background/70 p-6 text-center shadow-sm transition-all duration-500 hover:shadow-2xl hover:ring-2 hover:ring-primary hover:ring-offset-2 sm:p-8 lg:p-10">
                
                <div className={`absolute inset-0 z-20 hidden flex-col items-center justify-center opacity-0 transition-opacity duration-500 lg:flex group-hover:opacity-100 
                    ${key === "BCA" ? "bg-gradient-to-r from-blue-500/90 to-cyan-500/90" : "bg-gradient-to-r from-purple-500/90 to-pink-500/90"}`}>
                  <span className="text-white text-3xl font-bold mb-6"></span>
                  <Button size="lg" className={`mt-4 bg-white ${key === "BCA" ? "text-blue-600 hover:bg-blue-50" : "text-purple-600 hover:bg-purple-50"} font-bold px-8 py-4 shadow-lg hover:scale-105 transition-transform`} onClick={() => window.location.href = section.path}>
                    View Course Details
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform"/>
                  </Button>
                </div>

                <div className="flex justify-center mb-4 relative z-10">
                  <div className={`section-icon flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r shadow-2xl sm:h-20 sm:w-20 ${section.color}`}>
                    <IconComponent className="h-9 w-9 text-white sm:h-12 sm:w-12"/>
                  </div>
                </div>
                <h3 className="relative z-10 text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">{section.title}</h3>
                <p className="relative z-10 mx-auto max-w-xl text-base text-muted-foreground sm:text-lg">{section.description}</p>
                <Button size="lg" className={`relative z-10 mt-2 w-full font-semibold shadow-lg lg:hidden ${key === "BCA"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-purple-600 text-white hover:bg-purple-700"}`} onClick={() => window.location.href = section.path}>
                  View Course Details
                  <ArrowRight className="ml-2 h-5 w-5"/>
                </Button>
              </div>);
        })}
        </div>

        
        
      </div>
    </section>);
};
export default CoursesSection;
