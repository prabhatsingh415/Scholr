import { useEffect, useRef } from "react";
import { CheckCircle, Target, Users, Globe, Award, TrendingUp } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
const features = [
    {
        icon: Target,
        title: "Visionary Leadership",
        description: "Pioneering educational methodologies that shape industry standards worldwide"
    },
    {
        icon: Users,
        title: "Elite Faculty",
        description: "World-renowned experts and Nobel laureates guiding your academic journey"
    },
    {
        icon: TrendingUp,
        title: "Future-Ready",
        description: "Cutting-edge curriculum designed for tomorrow's challenges and opportunities"
    }
];
const achievements = [
    "Top Ranked in University for Innovation Excellence",
    "77.2% Graduate Employment within 6 months",
    "Strategic Partnerships with Fortune Top Companies",
    "Guest lectures by Industry Experts",
    "Sustainable Campus Initiative Leader",
    "Student Friendly Envionment in campus",
];
const AboutSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const achievementsRef = useRef<HTMLDivElement>(null);
    const featuresRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const yearsCountRef = useRef<HTMLDivElement>(null);
    const facultyCountRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const section = sectionRef.current;
        if (!section)
            return;
        gsap.fromTo(titleRef.current, { opacity: 0, y: 100, scale: 0.8 }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.5,
            ease: "power4.out",
            scrollTrigger: {
                trigger: section,
                start: "top 85%",
            }
        });
        gsap.fromTo(contentRef.current, { opacity: 0, x: -150, rotationY: -15 }, {
            opacity: 1,
            x: 0,
            rotationY: 0,
            duration: 1.5,
            ease: "power4.out",
            scrollTrigger: {
                trigger: section,
                start: "top 75%",
            }
        });
        gsap.fromTo(imageRef.current, { opacity: 0, x: 150, rotationY: 15, scale: 0.8 }, {
            opacity: 1,
            x: 0,
            rotationY: 0,
            scale: 1,
            duration: 1.5,
            ease: "power4.out",
            scrollTrigger: {
                trigger: section,
                start: "top 75%",
            }
        });
        gsap.fromTo(achievementsRef.current?.children, { opacity: 0, x: -50, scale: 0.8 }, {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.4)",
            scrollTrigger: {
                trigger: achievementsRef.current,
                start: "top 85%",
            }
        });
        gsap.fromTo(featuresRef.current?.children, { opacity: 0, y: 80, scale: 0.6, rotationX: -20 }, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            duration: 1.2,
            stagger: 0.25,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: featuresRef.current,
                start: "top 85%",
            }
        });
        const animateCount = (ref: React.RefObject<HTMLDivElement>, endValue: number, suffix = "+") => {
            const obj = { val: 0 };
            gsap.to(obj, {
                val: endValue,
                duration: 2,
                ease: "power1.out",
                scrollTrigger: {
                    trigger: ref.current,
                    start: "top 85%",
                },
                onUpdate: () => {
                    if (ref.current) {
                        ref.current.textContent = `${Math.floor(obj.val)}${suffix}`;
                    }
                }
            });
        };
        animateCount(yearsCountRef, 7);
        animateCount(facultyCountRef, 30);
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);
    return (<section ref={sectionRef} id="about" className="relative overflow-hidden bg-gradient-to-br from-background via-background/95 to-accent/10 py-20 sm:py-24 lg:py-32">
      
      <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary)) 1px, transparent 1px),
                         radial-gradient(circle at 75% 75%, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: "60px 60px, 80px 80px"
        }}></div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <h2 ref={titleRef} className="mb-12 text-center text-3xl font-bold sm:mb-16 sm:text-5xl lg:mb-20 lg:text-7xl">
          <span className="text-foreground">Excellence</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/60">Redefined</span>
        </h2>

        <div className="grid grid-cols-1 items-center gap-12 lg:gap-16 xl:grid-cols-2 xl:gap-24">
          
          <div ref={contentRef}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 sm:mb-8 sm:px-6">
              <Award className="h-4 w-4 text-primary sm:h-5 sm:w-5"/>
              <span className="text-xs font-semibold tracking-[0.18em] text-primary sm:text-sm sm:tracking-wide">WORLD-CLASS INSTITUTION</span>
            </div>

            <h3 className="mb-6 text-3xl font-bold leading-tight sm:mb-8 sm:text-4xl lg:text-6xl">
              Why We're The 
              <span className="text-primary"> Global Standard</span>
            </h3>

            <p className="mb-8 text-base leading-relaxed text-muted-foreground sm:mb-12 sm:text-lg lg:text-xl">
              We don't just educate; we transform minds, forge leaders, and create visionaries who reshape industries and define the future of human potential.
            </p>

            
            <div ref={achievementsRef} className="mb-10 space-y-4 sm:mb-12 sm:space-y-6">
              {achievements.map((achievement, index) => (<div key={index} className="flex items-center space-x-4 group">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 transition-all duration-300 group-hover:scale-110">
                    <CheckCircle className="h-4 w-4 text-white"/>
                  </div>
                  <span className="text-sm font-medium text-foreground transition-colors duration-300 group-hover:text-primary sm:text-base">{achievement}</span>
                </div>))}
            </div>

            
            <div ref={featuresRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 xl:gap-8">
              {features.map((feature, index) => (<div key={index} className="group p-6 rounded-2xl bg-gradient-to-br from-background to-accent/5 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:scale-105">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 transition-all duration-300 group-hover:scale-110 sm:mb-6 sm:h-16 sm:w-16">
                    <feature.icon className="h-7 w-7 text-primary sm:h-8 sm:w-8"/>
                  </div>
                  <h4 className="font-bold text-lg mb-3 group-hover:text-primary transition-colors duration-300">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>))}
            </div>
          </div>

          
          <div ref={imageRef} className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img src="/images/IMG_0189 - Edited.jpg" alt="University Excellence" className="h-[380px] w-full object-cover transition-all duration-700 group-hover:scale-110 sm:h-[520px] lg:h-[640px] xl:h-[700px]"/>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent"></div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 lg:contents">
              <div className="rounded-2xl border border-border/50 bg-background/95 p-4 shadow-xl backdrop-blur-xl sm:p-6 lg:absolute lg:-bottom-12 lg:-left-12 lg:p-8">
                <div className="text-center">
                  <div ref={yearsCountRef} className="mb-1 text-3xl font-bold text-primary sm:mb-2 sm:text-4xl">0+</div>
                  <div className="text-xs font-medium text-muted-foreground sm:text-sm">Years of Excellence</div>
                </div>
              </div>

              <div className="rounded-2xl border border-border/50 bg-background/95 p-4 shadow-xl backdrop-blur-xl sm:p-6 lg:absolute lg:-right-12 lg:-top-12 lg:p-8">
                <div className="text-center">
                  <div ref={facultyCountRef} className="mb-1 text-3xl font-bold text-primary sm:mb-2 sm:text-4xl">0+</div>
                  <div className="text-xs font-medium text-muted-foreground sm:text-sm">Best Faculty</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>);
};
export default AboutSection;
