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
        animateCount(yearsCountRef, 5);
        animateCount(facultyCountRef, 30);
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);
    return (<section ref={sectionRef} id="about" className="py-32 bg-gradient-to-br from-background via-background/95 to-accent/10 relative overflow-hidden">
      
      <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary)) 1px, transparent 1px),
                         radial-gradient(circle at 75% 75%, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: "60px 60px, 80px 80px"
        }}></div>

      <div className="container mx-auto px-6 relative z-10">
        <h2 ref={titleRef} className="text-5xl md:text-7xl font-bold text-center mb-20">
          <span className="text-foreground">Excellence</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/60">Redefined</span>
        </h2>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-24 items-center">
          
          <div ref={contentRef}>
            <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-6 py-2 mb-8">
              <Award className="w-5 h-5 text-primary"/>
              <span className="text-sm font-semibold text-primary tracking-wide">WORLD-CLASS INSTITUTION</span>
            </div>

            <h3 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              Why We're The 
              <span className="text-primary"> Global Standard</span>
            </h3>

            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              We don't just educate; we transform minds, forge leaders, and create visionaries who reshape industries and define the future of human potential.
            </p>

            
            <div ref={achievementsRef} className="space-y-6 mb-12">
              {achievements.map((achievement, index) => (<div key={index} className="flex items-center space-x-4 group">
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                    <CheckCircle className="w-4 h-4 text-white"/>
                  </div>
                  <span className="text-foreground font-medium group-hover:text-primary transition-colors duration-300">{achievement}</span>
                </div>))}
            </div>

            
            <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (<div key={index} className="group p-6 rounded-2xl bg-gradient-to-br from-background to-accent/5 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="w-8 h-8 text-primary"/>
                  </div>
                  <h4 className="font-bold text-lg mb-3 group-hover:text-primary transition-colors duration-300">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>))}
            </div>
          </div>

          
          <div ref={imageRef} className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img src="/images/IMG_0189 - Edited.jpg" alt="University Excellence" className="w-full h-[700px] object-cover group-hover:scale-110 transition-all duration-700"/>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent"></div>
            </div>

            
            <div className="absolute -bottom-12 -left-12 bg-background/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-border/50">
              <div className="text-center">
                <div ref={yearsCountRef} className="text-4xl font-bold text-primary mb-2">0+</div>
                <div className="text-sm text-muted-foreground font-medium">Years of Excellence</div>
              </div>
            </div>

            
            <div className="absolute -top-12 -right-12 bg-background/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-border/50">
              <div className="text-center">
                <div ref={facultyCountRef} className="text-4xl font-bold text-primary mb-2">0+</div>
                <div className="text-sm text-muted-foreground font-medium">Best Faculty</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>);
};
export default AboutSection;
