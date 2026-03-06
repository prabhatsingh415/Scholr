import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookOpen, GraduationCap, Award, Clock, Users, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
gsap.registerPlugin(ScrollTrigger);
const AcademicPrograms = () => {
    const heroRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const programsRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const tl = gsap.timeline();
        gsap.set([headingRef.current, subtitleRef.current], {
            opacity: 0,
            y: 80,
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
        }, "-=1");
        gsap.fromTo(programsRef.current?.children, {
            opacity: 0,
            y: 100,
            scale: 0.8,
            rotationY: -15
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationY: 0,
            duration: 1.2,
            ease: "power4.out",
            stagger: 0.2,
            scrollTrigger: {
                trigger: programsRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
        gsap.fromTo(statsRef.current?.children, {
            opacity: 0,
            scale: 0,
            rotation: 180
        }, {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1.5,
            ease: "elastic.out(1, 0.5)",
            stagger: 0.1,
            scrollTrigger: {
                trigger: statsRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
        return () => {
            tl.kill();
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);
    const programs = [
        {
            title: "Computer Science",
            degree: "Bachelor of Science",
            duration: "4 Years",
            credits: "120 Credits",
            description: "Comprehensive program covering programming, algorithms, data structures, AI, and software engineering.",
            features: ["Machine Learning", "Software Development", "Cybersecurity", "Database Systems"],
            icon: BookOpen,
            color: "from-blue-500 to-cyan-500"
        },
        {
            title: "Mechanical Engineering",
            degree: "Bachelor of Engineering",
            duration: "4 Years",
            credits: "128 Credits",
            description: "Advanced engineering program focusing on design, manufacturing, robotics, and automation systems.",
            features: ["Robotics", "CAD Design", "Thermodynamics", "Materials Science"],
            icon: GraduationCap,
            color: "from-green-500 to-emerald-500"
        },
        {
            title: "Business Administration",
            degree: "Bachelor of Business Administration",
            duration: "3.5 Years",
            credits: "115 Credits",
            description: "Strategic business program covering management, marketing, finance, and entrepreneurship.",
            features: ["Digital Marketing", "Finance", "Leadership", "Analytics"],
            icon: Award,
            color: "from-purple-500 to-violet-500"
        },
        {
            title: "Data Science",
            degree: "Bachelor of Science",
            duration: "4 Years",
            credits: "122 Credits",
            description: "Cutting-edge program combining statistics, programming, and machine learning for data analysis.",
            features: ["Big Data", "Statistics", "Python/R", "Visualization"],
            icon: Star,
            color: "from-orange-500 to-red-500"
        }
    ];
    return (<div className="min-h-screen">
      <Header />
      
      
      <section ref={heroRef} className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70 z-10"></div>
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
        }}></div>
        
        <div className="relative z-20 container mx-auto px-6 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 ref={headingRef} className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              Academic <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-200">Programs</span>
            </h1>

            <p ref={subtitleRef} className="text-xl md:text-2xl mb-12 text-white/95 max-w-3xl mx-auto font-light">
              Discover our comprehensive range of undergraduate and graduate programs designed to prepare you for success in the modern world.
            </p>
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our <span className="text-gradient">Programs</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose from our diverse range of programs, each designed with industry relevance and academic excellence in mind.
            </p>
          </div>

          <div ref={programsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((program, index) => (<Card key={index} className="group overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${program.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300`}>
                    <program.icon className="w-8 h-8 text-white"/>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground mb-2">{program.title}</h3>
                  <p className="text-primary font-semibold mb-4">{program.degree}</p>
                  
                  <div className="flex items-center space-x-6 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4"/>
                      <span>{program.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4"/>
                      <span>{program.credits}</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">{program.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-foreground mb-3">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {program.features.map((feature, idx) => (<div key={idx} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>))}
                    </div>
                  </div>
                  
                  <Button className="w-full group-hover:scale-105 transition-all duration-300">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2"/>
                  </Button>
                </CardContent>
              </Card>))}
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Program Statistics
            </h2>
          </div>

          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <BookOpen className="w-12 h-12 text-yellow-300 mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300"/>
              <div className="text-4xl font-bold text-yellow-300 mb-2">50+</div>
              <div className="text-white/80 font-medium">Programs Offered</div>
            </div>
            <div className="text-center group">
              <Users className="w-12 h-12 text-yellow-300 mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300"/>
              <div className="text-4xl font-bold text-yellow-300 mb-2">5,000+</div>
              <div className="text-white/80 font-medium">Students Enrolled</div>
            </div>
            <div className="text-center group">
              <GraduationCap className="w-12 h-12 text-yellow-300 mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300"/>
              <div className="text-4xl font-bold text-yellow-300 mb-2">95%</div>
              <div className="text-white/80 font-medium">Graduation Rate</div>
            </div>
            <div className="text-center group">
              <Award className="w-12 h-12 text-yellow-300 mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300"/>
              <div className="text-4xl font-bold text-yellow-300 mb-2">90%</div>
              <div className="text-white/80 font-medium">Employment Rate</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>);
};
export default AcademicPrograms;
