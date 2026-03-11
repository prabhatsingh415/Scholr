import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play, MapPin, Users, Calendar, Award, Camera, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
gsap.registerPlugin(ScrollTrigger);
const Experience = () => {
    const heroRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const floatingRef = useRef<HTMLDivElement>(null);
    const experiencesRef = useRef<HTMLDivElement>(null);
    const facilitiesRef = useRef<HTMLDivElement>(null);
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
        gsap.fromTo(experiencesRef.current?.children, {
            opacity: 0,
            y: 100,
            scale: 0.8
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power4.out",
            stagger: 0.2,
            scrollTrigger: {
                trigger: experiencesRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
        gsap.fromTo(facilitiesRef.current?.children, {
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
                trigger: facilitiesRef.current,
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
        const cards = document.querySelectorAll(".experience-card");
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
    const experiences = [
        {
            title: "Campus Life",
            description: "Vibrant community with over 200 student organizations",
            image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            icon: Users
        },
        {
            title: "Modern Facilities",
            description: "State-of-the-art laboratories and learning spaces",
            image: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            icon: MapPin
        },
        {
            title: "Research Excellence",
            description: "Groundbreaking research opportunities with world-class faculty",
            image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            icon: Award
        },
        {
            title: "Global Network",
            description: "Connect with students and alumni from around the world",
            image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            icon: Heart
        }
    ];
    const facilities = [
        { name: "Innovation Labs", count: "15+" },
        { name: "Libraries", count: "2" },
        { name: "Sports Facilities", count: "25+" },
        { name: "Student Centers", count: "6" },
    ];
    return (<div className="min-h-screen">
      <Header />
      
      
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70 z-10"></div>
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110" style={{
            backgroundImage: "url('/images/1.jpg')"
        }}></div>
        
        <div className="relative z-20 container mx-auto px-6 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 ref={headingRef} className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="block">Experience</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-200">
                Excellence
              </span>
            </h1>

            <p ref={subtitleRef} className="text-xl md:text-2xl mb-12 text-white/95 max-w-3xl mx-auto font-light">
              Immerse yourself in a world-class educational environment where innovation meets tradition, and dreams become reality.
            </p>

            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button variant="outline" className="border-2 hover:scale-105 transition-all duration-300" onClick={() => window.location.href = "/virtual-tour"}>
                <Play className="w-6 h-6 mr-3"/>
                Virtual Tour
              </Button>
              <Button variant="outline" className="border-2 hover:scale-105 transition-all duration-300" onClick={() => window.location.href = "/photo-gallery"}>
                <Camera className="w-6 h-6 mr-3"/>
                Photo Gallery
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
              Discover Your <span className="text-gradient">Journey</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every moment at our university is designed to inspire, challenge, and transform your perspective.
            </p>
          </div>

          <div ref={experiencesRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {experiences.map((experience, index) => (<Card key={index} className="experience-card overflow-hidden group cursor-pointer">
                <div className="relative h-64 overflow-hidden">
                  <img src={experience.image} alt={experience.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <experience.icon className="w-6 h-6 text-yellow-300"/>
                      <h3 className="text-xl font-bold text-white">{experience.title}</h3>
                    </div>
                    <p className="text-white/90 text-sm">{experience.description}</p>
                  </div>
                </div>
              </Card>))}
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Best-Class <span className="text-gradient">Facilities</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our campus features cutting-edge facilities designed to support your academic and personal growth.
            </p>
          </div>

          <div ref={facilitiesRef} className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {facilities.map((facility, index) => (<Card key={index} className="text-center p-8 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <div className="text-3xl font-bold text-primary mb-2">{facility.count}</div>
                  <div className="text-muted-foreground font-medium">{facility.name}</div>
                </CardContent>
              </Card>))}
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Experience by the Numbers
            </h2>
          </div>

          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <Star className="w-12 h-12 text-yellow-300 mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300"/>
              <div className="text-4xl font-bold text-yellow-300 mb-2">4.8/5</div>
              <div className="text-white/80 font-medium">Student Satisfaction</div>
            </div>
            <div className="text-center group">
              <Calendar className="w-12 h-12 text-yellow-300 mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300"/>
              <div className="text-4xl font-bold text-yellow-300 mb-2">100+</div>
              <div className="text-white/80 font-medium">Annual Events</div>
            </div>
            <div className="text-center group">
              <Users className="w-12 h-12 text-yellow-300 mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300"/>
              <div className="text-4xl font-bold text-yellow-300 mb-2">200+</div>
              <div className="text-white/80 font-medium">Student Organizations</div>
            </div>
            <div className="text-center group">
              <Award className="w-12 h-12 text-yellow-300 mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300"/>
              <div className="text-4xl font-bold text-yellow-300 mb-2">95%</div>
              <div className="text-white/80 font-medium">Alumni Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>);
};
export default Experience;
