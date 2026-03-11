import { useEffect, useRef } from "react";
import { Calendar, MapPin, Clock, Users, ArrowRight, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
const pastEvents = [
    {
        id: 1,
        title: "Alumni Homecoming 2023",
        description: "A grand reunion celebrating our distinguished alumni and their achievements across various fields.",
        date: "2023-12-15",
        time: "5:00 PM - 10:00 PM",
        location: "Grand Hall",
        attendees: 600,
        category: "Alumni",
        image: "https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        rating: 4.8,
        featured: true
    },
    {
        id: 2,
        title: "Sports Championship 2023",
        description: "Inter-university sports competition showcasing athletic excellence and team spirit.",
        date: "2023-11-20",
        time: "8:00 AM - 6:00 PM",
        location: "Sports Stadium",
        attendees: 1500,
        category: "Sports",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        rating: 4.9,
        featured: false
    },
    {
        id: 3,
        title: "Tech Innovation Summit 2023",
        description: "Exploring the future of technology with industry leaders and innovative startups.",
        date: "2023-10-10",
        time: "9:00 AM - 6:00 PM",
        location: "Main Auditorium",
        attendees: 800,
        category: "Technology",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        rating: 4.7,
        featured: true
    },
    {
        id: 4,
        title: "Cultural Festival - Spectrum 2023",
        description: "A vibrant celebration of arts, music, dance, and cultural diversity from around the world.",
        date: "2023-09-15",
        time: "6:00 PM - 11:00 PM",
        location: "Campus Grounds",
        attendees: 1200,
        category: "Cultural",
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        rating: 4.6,
        featured: false
    },
    {
        id: 5,
        title: "Research Symposium 2023",
        description: "Showcase of groundbreaking research projects by students and faculty members.",
        date: "2023-08-20",
        time: "2:00 PM - 8:00 PM",
        location: "Research Center",
        attendees: 400,
        category: "Academic",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        rating: 4.5,
        featured: false
    }
];
const Events = () => {
    const headerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const pastRef = useRef<HTMLDivElement>(null);
    const pastGridRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const tl = gsap.timeline();
        gsap.set([headerRef.current, heroRef.current], { opacity: 0, y: -30 });
        tl.to(headerRef.current, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power4.out"
        })
            .to(heroRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out"
        }, "-=0.6");
        gsap.fromTo(pastRef.current, { opacity: 0, scale: 0.8, rotationY: -45 }, {
            opacity: 1,
            scale: 1,
            rotationY: 0,
            duration: 1.2,
            ease: "back.out(1.4)",
            scrollTrigger: {
                trigger: pastRef.current,
                start: "top 80%",
            }
        });
        gsap.fromTo(pastGridRef.current?.children, {
            opacity: 0,
            y: 100,
            rotationX: 45,
            scale: 0.7
        }, {
            opacity: 1,
            y: 0,
            rotationX: 0,
            scale: 1,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
                trigger: pastGridRef.current,
                start: "top 85%",
            }
        });
        gsap.to(".featured-event", {
            y: -10,
            duration: 3,
            ease: "power2.inOut",
            yoyo: true,
            repeat: -1
        });
        const buttons = document.querySelectorAll(".event-button");
        buttons.forEach(button => {
            button.addEventListener("mouseenter", () => {
                gsap.to(button, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            button.addEventListener("mouseleave", () => {
                gsap.to(button, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            tl.kill();
        };
    }, []);
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };
    const getCategoryColor = (category: string) => {
        const colors = {
            Technology: "bg-blue-500",
            Career: "bg-green-500",
            Cultural: "bg-purple-500",
            Academic: "bg-orange-500",
            Alumni: "bg-pink-500",
            Sports: "bg-red-500"
        };
        return colors[category as keyof typeof colors] || "bg-gray-500";
    };
    const handleViewGallery = (eventId: number) => {
        gsap.to(window, {
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
                window.location.href = "/photo-gallery";
            }
        });
    };
    const handleViewHighlights = (eventId: number) => {
        gsap.to(window, {
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
                console.log(`Viewing highlights for event ${eventId}`);
            }
        });
    };
    return (<div className="min-h-screen bg-background">
      <div ref={headerRef} className="relative z-50">
        <Header />
      </div>

      
      <section ref={heroRef} className="pt-32 pb-20 bg-gradient-to-br from-primary/20 via-background to-secondary/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
            Past Events Gallery
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Relive the memorable moments and celebrate the success of our amazing campus events and achievements.
          </p>
        </div>
      </section>

      
      <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div ref={pastRef} className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Event <span className="text-primary">Highlights</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the incredible moments, achievements, and memories from our successful events.
            </p>
          </div>

          <div ref={pastGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map((event) => (<Card key={event.id} className={`hover-scale group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-2xl ${event.featured ? "featured-event ring-2 ring-primary shadow-xl" : ""}`}>
                
                <div className="relative h-64 overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  
                  
                  <Badge className={`absolute top-4 left-4 ${getCategoryColor(event.category)} text-white font-semibold`}>
                    {event.category}
                  </Badge>

                  
                  {event.featured && (<div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center">
                      <Star className="w-3 h-3 mr-1 fill-current"/>
                      Featured
                    </div>)}

                  
                  <div className="absolute bottom-4 right-4 bg-white/90 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400"/>
                    {event.rating}
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors text-lg">
                    {event.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {event.description}
                  </p>
                  
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-primary"/>
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-primary"/>
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-primary"/>
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-primary"/>
                      <span>{event.attendees} attended</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="space-y-2">
                  <Button variant="default" className="w-full event-button bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300" onClick={() => handleViewGallery(event.id)}>
                    <Eye className="w-4 h-4 mr-2"/>
                    View Gallery
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"/>
                  </Button>
                 
                </CardFooter>
              </Card>))}
          </div>
        </div>
      </section>
    </div>);
};
export default Events;
