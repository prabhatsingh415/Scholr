import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Award, BookOpen, Users, GraduationCap, Star, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
gsap.registerPlugin(ScrollTrigger);
const Faculty = () => {
    const heroRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const floatingRef = useRef<HTMLDivElement>(null);
    const facultyRef = useRef<HTMLDivElement>(null);
    const staffRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const tl = gsap.timeline();
        gsap.set([headingRef.current, subtitleRef.current, ctaRef.current], {
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
        }, "-=1")
            .to(ctaRef.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "back.out(1.4)"
        }, "-=0.6");
        gsap.to(floatingRef.current?.children, {
            y: -40,
            rotation: 360,
            duration: 10,
            ease: "power2.inOut",
            yoyo: true,
            repeat: -1,
            stagger: 2
        });
        gsap.fromTo(facultyRef.current?.children, {
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
                trigger: facultyRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
        gsap.fromTo(staffRef.current?.children, {
            opacity: 0,
            x: -100,
            rotation: -5
        }, {
            opacity: 1,
            x: 0,
            rotation: 0,
            duration: 1.2,
            ease: "power4.out",
            stagger: 0.15,
            scrollTrigger: {
                trigger: staffRef.current,
                start: "top 75%",
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
        const cards = document.querySelectorAll(".faculty-card");
        cards.forEach(card => {
            const handleMouseEnter = () => {
                gsap.to(card, {
                    scale: 1.05,
                    y: -10,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)",
                    duration: 0.3,
                    ease: "power2.out"
                });
            };
            const handleMouseLeave = () => {
                gsap.to(card, {
                    scale: 1,
                    y: 0,
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    duration: 0.3,
                    ease: "power2.out"
                });
            };
            card.addEventListener("mouseenter", handleMouseEnter);
            card.addEventListener("mouseleave", handleMouseLeave);
        });
        return () => {
            tl.kill();
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);
    const facultyMembers = [
        {
            name: "Jayank Rai",
            position: "Head of Computer Science",
            department: "BCA & Department of Computer Science",
            experience: "5+ Years",
            specialization: "Artificial Intelligence & Machine Learning",
            email: "jayankrai@gmail.com",
            achievements: ["Best Faculty  2023", "Engineering Excellence "]
        },
        {
            name: "Dheeraj Sharma",
            position: "Head of Electrical Engineering",
            department: "Department of Electrical Engineering",
            experience: "5+ Years",
            specialization: "Power Electronics and Electrical Drive",
            achievements: ["Best Faculty  2023", "Engineering Excellence "]
        },
        {
            name: "Shailendra Goswami",
            position: "Head of Electronics Engineering",
            department: "Department of Electronics Engineering",
            experience: "5+ Years",
            specialization: "Digital Communication",
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            achievements: ["Best Faculty  2023", "Engineering Excellence "]
        },
        {
            name: "Chandan Patel",
            position: "Head of civil Engineering",
            department: "Department of Civil Engineering",
            experience: "5+ Years",
            specialization: "Civil Engineering",
            achievements: ["Best Faculty  2023", "Engineering Excellence "]
        },
        {
            name: "Sunil Nagar",
            position: "Head of Agriculture Engineering",
            department: "Department of Agriculture Engineering",
            experience: "3+ Years",
            specialization: "Agriculture Engineering",
            achievements: ["Best Faculty  2023", "Engineering Excellence "]
        },
        {
            name: "Dayyan Hasan",
            position: "Guest Faculty of Computer Science Engineering",
            department: "Department of Computer Science Engineering",
            experience: "1 Years",
            specialization: "Computer Science Engineering",
            achievements: ["Best Faculty  2025", "Engineering Excellence "]
        },
        {
            name: "Jitendra Sharma",
            position: "Guest Faculty of Computer Science Engineering",
            department: "BCA & Department of Computer Science Engineering",
            experience: "1 Years",
            specialization: "Computer Science Engineering",
            achievements: ["Best Faculty  202", "Engineering Excellence "]
        },
        {
            name: "Bhuvnesh Nagar",
            position: "Guest Faculty of Electrical Engineering",
            department: "Department of Electrical Engineering",
            experience: "1 Years",
            specialization: "Electrical Engineering",
            achievements: ["Best Faculty  2023", "Engineering Excellence "]
        },
        {
            name: "Prajapati Shantilal",
            position: "Guest Faculty of Electronics & Communication Engineering",
            department: "Department of Electronics & Communication Engineering",
            experience: "1 Years",
            specialization: "Electronics & Communication Engineering",
            achievements: ["Best Faculty  2023", "Engineering Excellence "]
        },
        {
            name: "Hemraj Meena",
            position: "Guest Faculty of Civil Engineering",
            department: "Department of Civil Engineering",
            experience: "1 Years",
            specialization: "Civil Engineering",
            achievements: ["Best Faculty  2023", "Engineering Excellence "]
        },
        {
            name: "Rajveer Singh",
            position: "Guest Faculty of Civil Engineering",
            department: "Department of Civil Engineering",
            experience: " ",
            specialization: "Civil Engineering",
            achievements: ["Best Faculty  2023", "Engineering Excellence "]
        },
        {
            name: "Dr. Pooja Shree Soni",
            position: "Guest Faculty of English",
            department: "Department of Applied Science",
            experience: "3+ Years",
            specialization: "English",
            achievements: ["Best Faculty  2023", "Engineering Excellence "]
        },
        {
            name: "Divyam Sharma",
            position: "Guest Faculty of Maths & Physics",
            department: "Department of Applied Science",
            experience: "2+ Years",
            specialization: "Maths & Physics",
            achievements: ["Best Faculty  2023", "Engineering Excellence "]
        }
    ];
    const staffDepartments = [
        { name: "Academic Affairs", count: "15", icon: BookOpen },
        { name: "Student Services", count: "12", icon: Users },
        { name: "IT Support", count: "8", icon: Award },
        { name: "Library Services", count: "10", icon: GraduationCap },
        { name: "Administration", count: "20", icon: MapPin },
        { name: "Campus Security", count: "6", icon: Star }
    ];
    return (<div className="min-h-screen">
      <Header />
      
      
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70 z-10"></div>
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
        }}></div>
        
        <div className="relative z-20 container mx-auto px-6 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 ref={headingRef} className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="block">Meet Our</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-200">
                Faculty & Staff
              </span>
            </h1>

            <p ref={subtitleRef} className="text-xl md:text-2xl mb-12 text-white/95 max-w-3xl mx-auto font-light">
              Discover the brilliant minds and dedicated professionals who shape the future of education and drive innovation in every classroom.
            </p>

             <div ref={ctaRef} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg font-semibold" onClick={() => window.location.href = "/contact-faculty"}>
                <Mail className="w-6 h-6 mr-3"/>
                Contact Faculty
              </Button>
             <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold" onClick={() => window.location.href = "/academic-programs"}>
                <BookOpen className="w-6 h-6 mr-3"/>
                Academic Programs
              </Button>
            </div>
          </div>
        </div>

        
        <div ref={floatingRef}>
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-yellow-300/30 to-yellow-400/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-32 right-20 w-48 h-48 bg-gradient-to-br from-white/20 to-white/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 right-10 w-24 h-24 bg-gradient-to-br from-yellow-200/40 to-yellow-300/30 rounded-full blur-lg"></div>
        </div>
      </section>

      
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our Distinguished <span className="text-gradient">Faculty</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Meet the academic leaders and researchers who bring world-class expertise to our classrooms.
            </p>
          </div>

          <div ref={facultyRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {facultyMembers.map((faculty, index) => (<Card key={index} className="faculty-card overflow-hidden group cursor-pointer">
                <div className="flex flex-col md:flex-row">
                  <div className="relative h-64 md:h-auto md:w-48 overflow-hidden">
                    <img src={faculty.image} alt={faculty.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  </div>
                  <CardContent className="flex-1 p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-foreground mb-1">{faculty.name}</h3>
                      <p className="text-primary font-semibold mb-2">{faculty.position}</p>
                      <p className="text-sm text-muted-foreground mb-2">{faculty.department}</p>
                      <p className="text-sm text-muted-foreground">{faculty.qualification}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-primary"/>
                        <span className="text-sm">{faculty.experience}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-primary"/>
                        <span className="text-sm">{faculty.specialization}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-primary"/>
                        <span className="text-sm">{faculty.email}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-semibold mb-2">Key Achievements:</h4>
                      <div className="space-y-1">
                        {faculty.achievements.map((achievement, idx) => (<div key={idx} className="flex items-center space-x-2">
                            <Star className="w-3 h-3 text-yellow-500 flex-shrink-0"/>
                            <span className="text-xs text-muted-foreground">{achievement}</span>
                          </div>))}
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>))}
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our Dedicated <span className="text-gradient">Staff</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Behind every great institution is a team of dedicated professionals committed to student success.
            </p>
          </div>

          <div ref={staffRef} className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {staffDepartments.map((department, index) => (<Card key={index} className="text-center p-8 hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300">
                    <department.icon className="w-8 h-8 text-primary"/>
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{department.count}</div>
                  <div className="text-muted-foreground font-medium">{department.name}</div>
                </CardContent>
              </Card>))}
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Excellence in Numbers
            </h2>
          </div>

          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <GraduationCap className="w-12 h-12 text-yellow-300 mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300"/>
              <div className="text-4xl font-bold text-yellow-300 mb-2">150+</div>
              <div className="text-white/80 font-medium">Faculty Members</div>
            </div>
            <div className="text-center group">
              <Award className="w-12 h-12 text-yellow-300 mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300"/>
              <div className="text-4xl font-bold text-yellow-300 mb-2">25+</div>
              <div className="text-white/80 font-medium">PhD Holders</div>
            </div>
            <div className="text-center group">
              <BookOpen className="w-12 h-12 text-yellow-300 mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300"/>
              <div className="text-4xl font-bold text-yellow-300 mb-2">500+</div>
              <div className="text-white/80 font-medium">Research Papers</div>
            </div>
            <div className="text-center group">
              <Users className="w-12 h-12 text-yellow-300 mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300"/>
              <div className="text-4xl font-bold text-yellow-300 mb-2">75+</div>
              <div className="text-white/80 font-medium">Support Staff</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>);
};
export default Faculty;
