import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowDown, FileText, UserPlus, Sparkles, Award } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
const applicationSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    address: z.string().min(10, "Please enter your full address"),
    program: z.string().min(1, "Please select a program"),
    previousEducation: z.string().min(10, "Please describe your educational background"),
    personalStatement: z.string().min(100, "Personal statement must be at least 100 characters"),
    expectedGraduation: z.string().min(1, "Expected graduation year is required"),
});
type ApplicationForm = z.infer<typeof applicationSchema>;
const ApplyNow = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const heroRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);
    const arrowRef = useRef<any>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const floatingRef = useRef<HTMLDivElement>(null);
    const successRef = useRef<HTMLDivElement>(null);
    const form = useForm<ApplicationForm>({
        resolver: zodResolver(applicationSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            dateOfBirth: "",
            address: "",
            program: "",
            previousEducation: "",
            personalStatement: "",
            expectedGraduation: "",
        },
    });
    useEffect(() => {
        if (isSubmitted) {
            const tl = gsap.timeline();
            gsap.set(successRef.current, { opacity: 0, scale: 0.5, y: 100 });
            tl.to(successRef.current, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 1.5,
                ease: "back.out(1.7)"
            });
            return;
        }
        const tl = gsap.timeline();
        gsap.set([badgeRef.current, titleRef.current, subtitleRef.current, arrowRef.current], {
            opacity: 0,
            y: 80,
            scale: 0.8
        });
        gsap.set(cardRef.current, {
            opacity: 0,
            y: 150,
            scale: 0.9,
            rotationX: 20
        });
        tl.to(badgeRef.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: "power4.out"
        })
            .to(titleRef.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.5,
            ease: "power4.out"
        }, "-=0.8")
            .to(subtitleRef.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: "power4.out"
        }, "-=1")
            .to(arrowRef.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "bounce.out"
        }, "-=0.6");
        ScrollTrigger.create({
            trigger: cardRef.current,
            start: "top 85%",
            onEnter: () => {
                gsap.to(cardRef.current, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotationX: 0,
                    duration: 1.8,
                    ease: "power4.out"
                });
            }
        });
        ScrollTrigger.create({
            trigger: formRef.current,
            start: "top 80%",
            onEnter: () => {
                const formFields = formRef.current?.querySelectorAll(".form-field");
                gsap.fromTo(formFields, { opacity: 0, x: -50, scale: 0.95 }, {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out"
                });
            }
        });
        gsap.to(floatingRef.current?.children, {
            y: -30,
            rotation: 360,
            duration: 8,
            ease: "power2.inOut",
            yoyo: true,
            repeat: -1,
            stagger: 2
        });
        gsap.to(arrowRef.current, {
            y: -15,
            duration: 2,
            ease: "power2.inOut",
            yoyo: true,
            repeat: -1,
            delay: 2
        });
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            tl.kill();
        };
    }, [isSubmitted]);
    const onSubmit = async (data: ApplicationForm) => {
        setIsSubmitting(true);
        gsap.to(formRef.current, {
            scale: 0.95,
            opacity: 0.7,
            duration: 0.3
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Application submitted:", data);
        setIsSubmitted(true);
        setIsSubmitting(false);
    };
    if (isSubmitted) {
        return (<div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
        <Header />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-6 text-center">
            <div ref={successRef} className="max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-8">
                <FileText className="w-10 h-10 text-primary-foreground"/>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Application Submitted!
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Thank you for your application. We'll review it and get back to you within 3-5 business days.
              </p>
              <Button onClick={() => window.location.href = "/"} className="bg-gradient-to-r from-primary to-primary/80 hover:scale-105 transition-all duration-300">
                Back to Home
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>);
    }
    return (<div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 relative overflow-hidden">
      <Header />
      
      
      <div ref={floatingRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-20 w-48 h-48 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-br from-accent/30 to-accent/20 rounded-full blur-lg"></div>
      </div>
      
      
      <section ref={heroRef} className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div ref={badgeRef} className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-6 py-3 mb-6 backdrop-blur-sm border border-primary/20">
              <UserPlus className="w-5 h-5 text-primary"/>
              <span className="text-primary font-medium">Start Your Journey</span>
              <Sparkles className="w-4 h-4 text-primary"/>
            </div>
            <h1 ref={titleRef} className="text-5xl md:text-7xl font-bold text-foreground mb-6">
              Apply <span className="text-gradient bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">Now</span>
            </h1>
            <p ref={subtitleRef} className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Take the first step towards your academic excellence. Join thousands of students who have transformed their futures with our world-class education.
            </p>
            <div ref={arrowRef}>
              <ArrowDown className="w-8 h-8 text-primary mx-auto"/>
            </div>
          </div>

          
          <div className="max-w-4xl mx-auto">
            <Card ref={cardRef} className="premium-border award-shadow backdrop-blur-xl bg-background/95">
              <CardHeader className="text-center pb-8 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary-foreground"/>
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-foreground">
                  Application Form
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  Please fill out all required fields to complete your application
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <Form {...form}>
                  <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-foreground border-b border-border pb-2 flex items-center space-x-2">
                        <UserPlus className="w-5 h-5 text-primary"/>
                        <span>Personal Information</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="firstName" render={({ field }) => (<FormItem className="form-field">
                              <FormLabel>First Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your first name" {...field} className="transition-all duration-300 focus:scale-105"/>
                              </FormControl>
                              <FormMessage />
                            </FormItem>)}/>
                        <FormField control={form.control} name="lastName" render={({ field }) => (<FormItem className="form-field">
                              <FormLabel>Last Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your last name" {...field} className="transition-all duration-300 focus:scale-105"/>
                              </FormControl>
                              <FormMessage />
                            </FormItem>)}/>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="email" render={({ field }) => (<FormItem className="form-field">
                              <FormLabel>Email Address *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="your.email@example.com" {...field} className="transition-all duration-300 focus:scale-105"/>
                              </FormControl>
                              <FormMessage />
                            </FormItem>)}/>
                        <FormField control={form.control} name="phone" render={({ field }) => (<FormItem className="form-field">
                              <FormLabel>Phone Number *</FormLabel>
                              <FormControl>
                                <Input placeholder="+1 (555) 123-4567" {...field} className="transition-all duration-300 focus:scale-105"/>
                              </FormControl>
                              <FormMessage />
                            </FormItem>)}/>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="dateOfBirth" render={({ field }) => (<FormItem className="form-field">
                              <FormLabel>Date of Birth *</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} className="transition-all duration-300 focus:scale-105"/>
                              </FormControl>
                              <FormMessage />
                            </FormItem>)}/>
                        <FormField control={form.control} name="expectedGraduation" render={({ field }) => (<FormItem className="form-field">
                              <FormLabel>Expected Graduation Year *</FormLabel>
                              <FormControl>
                                <Input placeholder="2028" {...field} className="transition-all duration-300 focus:scale-105"/>
                              </FormControl>
                              <FormMessage />
                            </FormItem>)}/>
                      </div>
                      <FormField control={form.control} name="address" render={({ field }) => (<FormItem className="form-field">
                            <FormLabel>Full Address *</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Enter your complete address including street, city, state, and zip code" className="resize-none transition-all duration-300 focus:scale-105" {...field}/>
                            </FormControl>
                            <FormMessage />
                          </FormItem>)}/>
                    </div>

                    
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-foreground border-b border-border pb-2 flex items-center space-x-2">
                        <Award className="w-5 h-5 text-primary"/>
                        <span>Academic Information</span>
                      </h3>
                      <FormField control={form.control} name="program" render={({ field }) => (<FormItem className="form-field">
                            <FormLabel>Preferred Program *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Computer Science, Business Administration, Engineering" {...field} className="transition-all duration-300 focus:scale-105"/>
                            </FormControl>
                            <FormMessage />
                          </FormItem>)}/>
                      <FormField control={form.control} name="previousEducation" render={({ field }) => (<FormItem className="form-field">
                            <FormLabel>Previous Education *</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Describe your educational background, including schools attended, degrees earned, and relevant achievements" className="resize-none h-24 transition-all duration-300 focus:scale-105" {...field}/>
                            </FormControl>
                            <FormMessage />
                          </FormItem>)}/>
                      <FormField control={form.control} name="personalStatement" render={({ field }) => (<FormItem className="form-field">
                            <FormLabel>Personal Statement *</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Tell us about yourself, your goals, and why you want to join our university (minimum 100 characters)" className="resize-none h-32 transition-all duration-300 focus:scale-105" {...field}/>
                            </FormControl>
                            <FormMessage />
                          </FormItem>)}/>
                    </div>

                    
                    <div className="pt-6">
                      <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-primary to-primary/80 hover:scale-105 transition-all duration-300 h-12 text-lg font-semibold relative overflow-hidden group">
                        <span className="relative z-10">
                          {isSubmitting ? "Submitting Application..." : "Submit Application"}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </Button>
                      <p className="text-sm text-muted-foreground text-center mt-4">
                        By submitting this application, you agree to our terms and conditions.
                      </p>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>);
};
export default ApplyNow;
