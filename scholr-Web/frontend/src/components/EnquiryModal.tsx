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
    console.log("EnquiryModal rendered with isOpen:", isOpen);
    useEffect(() => {
        if (isOpen) {
            console.log("Modal is open, starting animations");
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
        console.log("Form submitted:", formData);
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
        console.log("Handling modal close");
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
                    console.log("Close animation complete, calling onClose");
                    onClose();
                }
            });
        }
        else {
            console.log("No refs available, calling onClose directly");
            onClose();
        }
    };
    if (!isOpen) {
        console.log("Modal not open, returning null");
        return null;
    }
    console.log("Rendering modal content");
    return (<div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      
      <div ref={overlayRef} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose}/>
      
      
      <div ref={modalRef} className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card className="bg-white border shadow-2xl">
          <CardHeader className="text-center relative">
            <Button variant="ghost" size="icon" className="absolute right-2 top-2 hover:scale-110 transition-all duration-300" onClick={handleClose}>
              <X className="w-5 h-5"/>
            </Button>
            
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-white"/>
            </div>
            
            <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Welcome to ECB    
            </CardTitle>
            <p className="text-gray-600 text-lg">
              Start your educational journey with us. Fill out this quick enquiry form to get personalized information about our programs.
            </p>
          </CardHeader>
          
          <CardContent ref={formRef}>
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
                      <option value="bca">BCA - Bachelor of Computer Applications</option>
                      <option value="btech">B.Tech - Bachelor of Technology</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">
                    Tell us about your interests
                  </Label>
                  <Textarea id="message" rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="transition-all duration-300 focus:scale-105 resize-none" placeholder="What would you like to know about our programs?"/>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all duration-300 shadow-lg text-white" size="lg">
                    <Send className="w-5 h-5 mr-2"/>
                    Submit Enquiry
                  </Button>
                  
                  
                </div>
              </form>) : (<div className="text-center space-y-6 py-8">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <Send className="w-10 h-10 text-white"/>
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">Thank You!</h3>
                  <p className="text-gray-600 text-lg">
                    Your enquiry has been submitted successfully. Our admissions team will contact you within 24 hours.
                  </p>
                </div>
                <Button onClick={handleClose} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all duration-300 text-white" size="lg">
                  Explore Our Website
                </Button>
              </div>)}
          </CardContent>
        </Card>
      </div>
    </div>);
};
export default EnquiryModal;
