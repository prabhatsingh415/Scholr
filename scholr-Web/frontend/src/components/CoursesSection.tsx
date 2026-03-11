import { useEffect, useRef } from "react";
import { ArrowRight, Code, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
const courseSections = {
    BCA: {
        title: "Bachelor of Computer Applications",
        icon: Code,
        description: "Comprehensive computer applications and software development programs",
        color: "from-blue-500 to-cyan-500",
        path: "/courses"
    },
    BTECH: {
        title: "Bachelor of Technology",
        icon: Cpu,
        description: "Advanced engineering and technology programs for future innovators",
        color: "from-purple-500 to-pink-500",
        path: "/courses"
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
    return (<section ref={sectionRef} id="courses" className="relative py-24 bg-gradient-to-br from-background via-secondary/20 to-background overflow-hidden">
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="floating-bg-element absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-xl"></div>
        <div className="floating-bg-element absolute top-40 right-20 w-40 h-40 bg-blue-500/5 rounded-full blur-xl"></div>
        <div className="floating-bg-element absolute bottom-40 left-1/4 w-24 h-24 bg-purple-500/5 rounded-full blur-xl"></div>
        <div className="floating-bg-element absolute bottom-20 right-1/4 w-36 h-36 bg-pink-500/5 rounded-full blur-xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        <div ref={headerRef} className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Discover Your
            <span className="block text-primary"> Perfect Course</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Choose from our comprehensive <span className="text-blue-600 font-semibold">BCA</span> and <span className="text-purple-600 font-semibold">B.Tech</span> programs designed to prepare you for success in today's competitive world.
          </p>
        </div>

        
        <div ref={sectionsContainerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {Object.entries(courseSections).map(([key, section]) => {
            const IconComponent = section.icon;
            return (<div key={key} className="relative group p-10 rounded-3xl border border-border bg-background/50 backdrop-blur-md text-center space-y-6 section-header overflow-hidden transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-offset-2 hover:ring-primary">
                
                <div className={`absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 
                    ${key === "BCA" ? "bg-gradient-to-r from-blue-500/90 to-cyan-500/90" : "bg-gradient-to-r from-purple-500/90 to-pink-500/90"}`}>
                  <span className="text-white text-3xl font-bold mb-6"></span>
                  <Button size="lg" className={`mt-4 bg-white ${key === "BCA" ? "text-blue-600 hover:bg-blue-50" : "text-purple-600 hover:bg-purple-50"} font-bold px-8 py-4 shadow-lg hover:scale-105 transition-transform`} onClick={() => window.location.href = section.path}>
                    View Course Details
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform"/>
                  </Button>
                </div>

                <div className="flex justify-center mb-4 relative z-10">
                  <div className={`section-icon w-20 h-20 bg-gradient-to-r ${section.color} rounded-2xl flex items-center justify-center shadow-2xl`}>
                    <IconComponent className="w-12 h-12 text-white"/>
                  </div>
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-foreground relative z-10">{section.title}</h3>
                <p className="text-xl text-muted-foreground max-w-xl mx-auto relative z-10">{section.description}</p>
              </div>);
        })}
        </div>

        
        
      </div>
    </section>);
};
export default CoursesSection;
