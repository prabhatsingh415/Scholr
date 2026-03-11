import { useEffect, useRef } from "react";
import { Clock, Users, Award, ArrowRight, GraduationCap, BookOpen, Code, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
const courseSections = {
    BCA: {
        title: "Bachelor of Computer Applications",
        icon: Code,
        description: "Comprehensive computer applications and software development programs",
        color: "from-blue-500 to-cyan-500",
        branches: [
            {
                id: 1,
                title: "BCA - Bechlor in Computer Applications",
                description: "Master programming languages, software engineering, and application development.",
                image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                duration: "3 Years",
                students: "1.2K",
                subjects: ["Java", "Python", "Web Development", "Database Management"],
                featured: true
            },
        ]
    },
    BTECH: {
        title: "Bachelor of Technology",
        icon: Cpu,
        description: "Advanced engineering and technology programs for future innovators",
        color: "from-purple-500 to-pink-500",
        branches: [
            {
                id: 5,
                title: "B.Tech - Computer Science Engineering",
                description: "Comprehensive computer science with focus on algorithms and system design.",
                image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                duration: "4 Years",
                students: "2.1K",
                subjects: ["Data Structures", "Algorithms", "Computer Networks", "AI/ML"],
                featured: true
            },
            {
                id: 7,
                title: "B.Tech - Electronics & Communication",
                description: "Electronic systems, communication networks, and signal processing.",
                image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                duration: "4 Years",
                students: "1.5K",
                subjects: ["Digital Electronics", "Signal Processing", "VLSI Design", "Communication Systems"],
                featured: false
            },
            {
                id: 8,
                title: "B.Tech - Agriculture Engineering",
                description: "Food Engineering, Farm Engineeing, manufacturing processes, and design engineering.",
                image: "https://images.unsplash.com/photo-1581092786450-6c4b0de0d6d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                duration: "4 Years",
                students: "1.3K",
                subjects: ["Thermodynamics", "Manufacturing", "CAD/CAM", "Robotics"],
                featured: true
            },
            {
                id: 9,
                title: "B.Tech - Civil Engineering",
                description: "Infrastructure development, construction management, and structural design.",
                image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                duration: "4 Years",
                students: "1.1K",
                subjects: ["Structural Engineering", "Construction Management", "Environmental Engineering", "Surveying"],
                featured: false
            },
            {
                id: 10,
                title: "B.Tech - Electrical Engineering",
                description: "Power systems, electrical machines, and renewable energy technologies.",
                image: "https://images.unsplash.com/photo-1559302504-1774c8b6c7e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                duration: "4 Years",
                students: "900",
                subjects: ["Power Systems", "Electrical Machines", "Control Systems", "Renewable Energy"],
                featured: false
            }
        ]
    }
};
const Courses = () => {
    const heroRef = useRef<HTMLElement>(null);
    const sectionsRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        gsap.fromTo(heroRef.current?.children, {
            opacity: 0,
            y: 100,
            scale: 0.8
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            stagger: 0.3,
            ease: "power4.out"
        });
        const floatingElements = document.querySelectorAll(".floating-element");
        floatingElements.forEach((element, index) => {
            gsap.to(element, {
                y: -30,
                rotation: 360,
                duration: 4 + index,
                repeat: -1,
                yoyo: true,
                ease: "power2.inOut",
                delay: index * 0.5
            });
        });
        gsap.utils.toArray(".section-header").forEach((header: any) => {
            gsap.fromTo(header, {
                opacity: 0,
                y: 50,
                rotationX: 45
            }, {
                opacity: 1,
                y: 0,
                rotationX: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: header,
                    start: "top 80%",
                }
            });
        });
        gsap.utils.toArray(".course-card").forEach((card: any, index) => {
            gsap.fromTo(card, {
                opacity: 0,
                y: 100,
                rotationY: 45,
                scale: 0.8
            }, {
                opacity: 1,
                y: 0,
                rotationY: 0,
                scale: 1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 90%",
                },
                delay: (index % 4) * 0.1
            });
        });
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);
    return (<div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <Header />
      
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="floating-element absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
        <div className="floating-element absolute top-40 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
        <div className="floating-element absolute bottom-40 left-20 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
        <div className="floating-element absolute bottom-20 right-10 w-28 h-28 bg-pink-500/10 rounded-full blur-xl"></div>
      </div>

      
      <section ref={heroRef} className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center shadow-xl">
              <GraduationCap className="w-10 h-10 text-primary-foreground"/>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Our Courses
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Explore our comprehensive range of <span className="text-primary font-semibold">BCA</span> and <span className="text-purple-600 font-semibold">B.Tech</span> programs designed to shape the future leaders of technology
          </p>

          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-primary"/>
              <span>10+ Specialized Branches</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary"/>
              <span>12,000+ Students</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-primary"/>
              <span>Industry Recognition</span>
            </div>
          </div>
        </div>
      </section>

      
      <section ref={sectionsRef} className="pb-20">
        <div className="container mx-auto px-4">
          {Object.entries(courseSections).map(([sectionKey, section]) => {
            const IconComponent = section.icon;
            return (<div key={sectionKey} className="mb-20">
                
                <div className="section-header text-center mb-16">
                  <div className="flex justify-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${section.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white"/>
                    </div>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-bold mb-4">
                    {section.title}
                  </h2>
                  
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    {section.description}
                  </p>
                </div>

                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {section.branches.map((course, index) => (<Card key={course.id} className={`course-card hover-scale group cursor-pointer overflow-hidden ${course.featured ? "ring-2 ring-primary shadow-xl" : "shadow-lg"} hover:shadow-2xl transition-all duration-500`}>
                      
                      {course.featured && (<div className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                          Featured
                        </div>)}

                      
                      <div className="relative h-48 overflow-hidden">
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        
                        
                        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                          {course.duration}
                        </div>
                      </div>

                      <CardHeader className="pb-3">
                        <CardTitle className="group-hover:text-primary transition-colors text-lg">
                          {course.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {course.description}
                        </p>
                        
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2 text-foreground">Key Subjects:</h4>
                          <div className="flex flex-wrap gap-1">
                            {course.subjects.map((subject, idx) => (<span key={idx} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
                                {subject}
                              </span>))}
                          </div>
                        </div>
                        
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4"/>
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4"/>
                            <span>{course.students} students</span>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter>
                        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                          Learn More
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"/>
                        </Button>
                      </CardFooter>
                    </Card>))}
                </div>
              </div>);
        })}
        </div>
      </section>

      
      <section className="py-20 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students who have transformed their careers with our industry-focused programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="group bg-gradient-to-r from-primary to-primary/80 hover:scale-105 transition-all duration-300" onClick={() => window.location.href = "/apply"}>
              Apply Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"/>
            </Button>
            <Button size="lg" variant="outline" className="hover:scale-105 transition-all duration-300" onClick={() => window.location.href = "/contact"}>
              Get More Info
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>);
};
export default Courses;
