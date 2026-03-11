import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, Phone, MapPin, Clock, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
gsap.registerPlugin(ScrollTrigger);
const ContactFaculty = () => {
    const heroRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const contactInfoRef = useRef<HTMLDivElement>(null);
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
        gsap.fromTo(formRef.current, {
            opacity: 0,
            x: -100,
            scale: 0.9
        }, {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
                trigger: formRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
        gsap.fromTo(contactInfoRef.current?.children, {
            opacity: 0,
            y: 50,
            scale: 0.8
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power4.out",
            stagger: 0.2,
            scrollTrigger: {
                trigger: contactInfoRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
        return () => {
            tl.kill();
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);
    return (<div className="min-h-screen">
      <Header />
      
      
      <section ref={heroRef} className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70 z-10"></div>
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
        }}></div>
        
        <div className="relative z-20 container mx-auto px-6 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 ref={headingRef} className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              Contact Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-200">Faculty</span>
            </h1>

            <p ref={subtitleRef} className="text-xl md:text-2xl mb-12 text-white/95 max-w-3xl mx-auto font-light">
              Connect with our distinguished faculty members for academic guidance, research opportunities, and expert consultation.
            </p>
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            
            <div ref={formRef}>
              <Card className="p-8">
                <CardContent className="p-0">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Send a Message</h2>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">First Name</label>
                        <Input placeholder="Your first name"/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Last Name</label>
                        <Input placeholder="Your last name"/>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address</label>
                      <Input type="email" placeholder="your.email@example.com"/>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Department of Interest</label>
                      <select className="w-full px-3 py-2 border border-input rounded-md bg-background">
                        <option>Computer Science</option>
                        <option>Mechanical Engineering</option>
                        <option>Business Administration</option>
                        <option>Data Science</option>
                        <option>Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Subject</label>
                      <Input placeholder="Brief subject of your inquiry"/>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Message</label>
                      <Textarea placeholder="Please describe your inquiry, research interests, or questions in detail..." rows={6}/>
                    </div>
                    
                    <Button size="lg" className="w-full">
                      <Send className="w-5 h-5 mr-2"/>
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            
            <div ref={contactInfoRef} className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">Get in Touch</h2>
                <p className="text-muted-foreground mb-8">
                  Our faculty members are available to discuss academic programs, research opportunities, 
                  and provide expert guidance in their respective fields.
                </p>
              </div>

              <Card className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-primary"/>
                    </div>
                    <div>
                      <h3 className="font-semibold">Faculty Office</h3>
                      <p className="text-muted-foreground">123 University Drive, Academic Building, Floor 3</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-primary"/>
                    </div>
                    <div>
                      <h3 className="font-semibold">Phone</h3>
                      <p className="text-muted-foreground">+91 94148101144", "+91  9928709032</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-primary"/>
                    </div>
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-muted-foreground">principalgecbaran@.gmail.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-primary"/>
                    </div>
                    <div>
                      <h3 className="font-semibold">Office Hours</h3>
                      <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 4:00 PM</p>
                      <p className="text-muted-foreground">Saturday: 10:00 AM - 2:00 PM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>);
};
export default ContactFaculty;
