import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, User, Calendar, CheckCircle, Building, Globe, Award } from "lucide-react";
import Header from "@/components/Header";
const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        inquiryType: "general"
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const heroRef = useRef<HTMLDivElement>(null);
    const contactInfoRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<HTMLDivElement>(null);
    const floatingElementsRef = useRef<HTMLDivElement[]>([]);
    const statsRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const tl = gsap.timeline();
        gsap.set([heroRef.current], { opacity: 0, y: 100 });
        gsap.set([contactInfoRef.current, formRef.current, mapRef.current, statsRef.current], {
            opacity: 0,
            y: 60
        });
        tl.to(heroRef.current, {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: "power4.out"
        })
            .to(contactInfoRef.current, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out"
        }, "-=1")
            .to(formRef.current, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out"
        }, "-=0.8")
            .to(statsRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out"
        }, "-=0.6")
            .to(mapRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out"
        }, "-=0.4");
        floatingElementsRef.current.forEach((el, index) => {
            if (el) {
                gsap.to(el, {
                    y: "+=20",
                    rotation: "+=5",
                    duration: 3 + index * 0.5,
                    ease: "sine.inOut",
                    repeat: -1,
                    yoyo: true,
                    delay: index * 0.3
                });
            }
        });
        return () => {
            tl.kill();
        };
    }, []);
    const handleFieldFocus = (field: HTMLElement) => {
        gsap.to(field, {
            scale: 1.02,
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            duration: 0.3,
            ease: "power2.out"
        });
    };
    const handleFieldBlur = (field: HTMLElement) => {
        gsap.to(field, {
            scale: 1,
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
            duration: 0.3,
            ease: "power2.out"
        });
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        gsap.to(formRef.current, {
            scale: 0.95,
            opacity: 0.7,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => {
                setIsSubmitted(true);
                gsap.to(formRef.current, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.8,
                    ease: "back.out(1.4)"
                });
            }
        });
    };
    const contactInfo = [
        {
            icon: Phone,
            title: "Phone",
            details: ["+91 94148101144", "+91  9928709032"],
            color: "text-blue-500"
        },
        {
            icon: Mail,
            title: "Email",
            details: ["principalgecbaran@.gmail.com"],
            color: "text-green-500"
        },
        {
            icon: MapPin,
            title: "Address",
            details: ["Government Engineering College", "Baran, Rajasthan, India, Pin: 325205"],
            color: "text-purple-500"
        },
        {
            icon: Clock,
            title: "Office Hours",
            details: ["Mon - Fri: 9:00 AM - 4:00 PM", "Sat: 9:00 AM - 2:00 PM"],
            color: "text-orange-500"
        }
    ];
    const inquiryTypes = [
        { value: "general", label: "General Information" },
        { value: "admissions", label: "Admissions" },
        { value: "academics", label: "Academic Programs" },
        { value: "financial", label: "Financial Aid" },
        { value: "campus", label: "Campus Life" },
        { value: "support", label: "Technical Support" }
    ];
    if (isSubmitted) {
        return (<div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <Header />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-6 flex items-center justify-center min-h-[60vh]">
            <Card className="max-w-md w-full premium-border award-shadow text-center">
              <CardContent className="p-8 space-y-6">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto animate-pulse-premium">
                  <CheckCircle className="w-10 h-10 text-white"/>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gradient mb-2">Thank You!</h2>
                  <p className="text-muted-foreground">
                    Your message has been sent successfully. We'll get back to you within 24 hours.
                  </p>
                </div>
                <Button onClick={() => setIsSubmitted(false)} className="premium-gradient hover:scale-105 transition-all duration-300">
                  Send Another Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <Header />
      
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (<div key={i} ref={el => floatingElementsRef.current[i] = el!} className={`absolute w-32 h-32 rounded-full opacity-10 ${i % 3 === 0 ? "bg-primary" : i % 3 === 1 ? "bg-secondary" : "bg-accent"}`} style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
            }}/>))}
      </div>

      <div className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-6">
          
          <div ref={heroRef} className="text-center mb-20">
            <Badge variant="outline" className="mb-6 animate-float-premium">
              <MessageCircle className="w-4 h-4 mr-2"/>
              Get In Touch
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gradient mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We're here to help you take the next step in your educational journey. 
              Reach out to us with any questions about our programs, admissions, or campus life.
            </p>
          </div>

          
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {[
            { number: "24/7", label: "Support Available", icon: Clock },
            { number: "< 24hrs", label: "Response Time", icon: MessageCircle },
            { number: "50+", label: "Expert Staff", icon: User },
            { number: "99%", label: "Satisfaction Rate", icon: Award }
        ].map((stat, index) => (<Card key={stat.label} className="premium-border text-center hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-3"/>
                  <div className="text-2xl font-bold text-gradient mb-1">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            
            <div ref={contactInfoRef} className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gradient mb-6">Get in Touch</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Ready to start your journey with us? We're available through multiple channels 
                  to provide you with the information and support you need.
                </p>
              </div>

              <div className="grid gap-6">
                {contactInfo.map((info, index) => (<Card key={info.title} className="premium-border hover:scale-105 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-lg bg-background border-2 border-border flex items-center justify-center ${info.color}`}>
                          <info.icon className="w-6 h-6"/>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2">{info.title}</h3>
                          {info.details.map((detail, idx) => (<p key={idx} className="text-muted-foreground">
                              {detail}
                            </p>))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>))}
              </div>

              
              <div ref={mapRef}>
                <Card className="premium-border overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-br from-primary/20 to-primary/10 h-64 flex items-center justify-center">
                      <div className="text-center">
                        <Building className="w-16 h-16 text-primary mx-auto mb-4"/>
                        <h3 className="text-xl font-bold mb-2">Campus Location</h3>
                        <p className="text-muted-foreground">Interactive map coming soon</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            
            <div ref={formRef}>
              <Card className="premium-border award-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl text-gradient">Send us a Message</CardTitle>
                  <p className="text-muted-foreground">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} onFocus={(e) => handleFieldFocus(e.target)} onBlur={(e) => handleFieldBlur(e.target)} required className="transition-all duration-300"/>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} onFocus={(e) => handleFieldFocus(e.target)} onBlur={(e) => handleFieldBlur(e.target)} required className="transition-all duration-300"/>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} onFocus={(e) => handleFieldFocus(e.target)} onBlur={(e) => handleFieldBlur(e.target)} className="transition-all duration-300"/>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inquiryType">Inquiry Type</Label>
                        <select id="inquiryType" value={formData.inquiryType} onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-all duration-300 focus:scale-105">
                          {inquiryTypes.map(type => (<option key={type.value} value={type.value}>
                              {type.label}
                            </option>))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input id="subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} onFocus={(e) => handleFieldFocus(e.target)} onBlur={(e) => handleFieldBlur(e.target)} required className="transition-all duration-300"/>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea id="message" rows={6} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} onFocus={(e) => handleFieldFocus(e.target)} onBlur={(e) => handleFieldBlur(e.target)} required className="transition-all duration-300 resize-none" placeholder="Tell us how we can help you..."/>
                    </div>

                    <Button type="submit" className="w-full premium-gradient hover:scale-105 transition-all duration-300 shadow-lg" size="lg">
                      <Send className="w-5 h-5 mr-2"/>
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
export default Contact;
