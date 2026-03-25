import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, User, Send, X, GraduationCap } from "lucide-react";
interface EnquiryModalProps {
    isOpen: boolean;
    onClose: () => void;
}
const EnquiryModal = ({ isOpen, onClose }: EnquiryModalProps) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        course: "",
        message: ""
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (isOpen) {
            if (modalRef.current && overlayRef.current) {
                gsap.set([overlayRef.current, modalRef.current], {
                    opacity: 0,
                    visibility: "visible"
                });
                gsap.set(modalRef.current, { scale: 0.8, y: 50 });
                const tl = gsap.timeline();
                tl.to(overlayRef.current, {
                    opacity: 1,
                    duration: 0.3,
                    ease: "power2.out"
                })
                    .to(modalRef.current, {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "back.out(1.4)"
                }, "-=0.1");
            }
        }
    }, [isOpen]);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formRef.current) {
            gsap.to(formRef.current, {
                scale: 0.95,
                opacity: 0.7,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    setIsSubmitted(true);
                    if (formRef.current) {
                        gsap.to(formRef.current, {
                            scale: 1,
                            opacity: 1,
                            duration: 0.5,
                            ease: "back.out(1.4)"
                        });
                    }
                }
            });
        }
    };
    const handleClose = () => {
        if (modalRef.current && overlayRef.current) {
            gsap.to(modalRef.current, {
                scale: 0.8,
                y: 50,
                opacity: 0,
                duration: 0.3,
                ease: "power2.in"
            });
            gsap.to(overlayRef.current, {
                opacity: 0,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    onClose();
                }
            });
        }
        else {
            onClose();
        }
    };
    if (!isOpen) {
        return null;
    }
    return (<div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
      
      <div ref={overlayRef} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose}/>
      
      
      <div ref={modalRef} className="relative max-h-[calc(100vh-1.5rem)] w-full max-w-2xl overflow-y-auto sm:max-h-[90vh]">
        <Card className="bg-white border shadow-2xl">
          <CardHeader className="relative px-4 pb-4 pt-5 text-center sm:px-6 sm:pt-6">
            <Button variant="ghost" size="icon" className="absolute right-2 top-2 transition-all duration-300 hover:scale-110 sm:right-3 sm:top-3" onClick={handleClose}>
              <X className="w-5 h-5"/>
            </Button>
            
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 sm:h-16 sm:w-16">
              <GraduationCap className="h-7 w-7 text-white sm:h-8 sm:w-8"/>
            </div>
            
            <CardTitle className="mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl text-transparent sm:text-3xl">
              Welcome to GECB    
            </CardTitle>
            <p className="text-sm text-gray-600 sm:text-base lg:text-lg">
              Start your educational journey with us. Fill out this quick enquiry form to get personalized information about our programs.
            </p>
          </CardHeader>
          
          <CardContent ref={formRef} className="px-4 pb-5 sm:px-6 sm:pb-6">
            {!isSubmitted ? (<form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="w-4 h-4"/>
                      Full Name *
                    </Label>
                    <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="transition-all duration-300 focus:scale-105" placeholder="Enter your full name"/>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4"/>
                      Email Address *
                    </Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="transition-all duration-300 focus:scale-105" placeholder="Enter your email"/>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4"/>
                      Phone Number *
                    </Label>
                    <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required className="transition-all duration-300 focus:scale-105" placeholder="Enter your phone number"/>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="course" className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4"/>
                      Course Interest
                    </Label>
                    <select id="course" value={formData.course} onChange={(e) => setFormData({ ...formData, course: e.target.value })} className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-all duration-300 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select a course</option>
                      <option value="btech">B.Tech - Bachelor of Technology</option>
                      <option value="bca">BCA - Bachelor of Computer Applications</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">
                    Tell us about your interests
                  </Label>
                  <Textarea id="message" rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="transition-all duration-300 focus:scale-105 resize-none" placeholder="What would you like to know about our programs?"/>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-blue-700 hover:to-purple-700" size="lg">
                    <Send className="w-5 h-5 mr-2"/>
                    Submit Enquiry
                  </Button>
                  
                  
                </div>
              </form>) : (<div className="space-y-6 py-6 text-center sm:py-8">
                <div className="mx-auto flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-green-500 sm:h-20 sm:w-20">
                  <Send className="h-8 w-8 text-white sm:h-10 sm:w-10"/>
                </div>
                <div>
                  <h3 className="mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-2xl font-bold text-transparent">Thank You!</h3>
                  <p className="text-sm text-gray-600 sm:text-base lg:text-lg">
                    Your enquiry has been submitted successfully. Our admissions team will contact you within 24 hours.
                  </p>
                </div>
                <Button onClick={handleClose} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white transition-all duration-300 hover:scale-[1.02] hover:from-blue-700 hover:to-purple-700 sm:w-auto" size="lg">
                  Explore Our Website
                </Button>
              </div>)}
          </CardContent>
        </Card>
      </div>
    </div>);
};
export default EnquiryModal;
