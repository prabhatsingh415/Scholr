import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CoursesSection from "@/components/CoursesSection";
import AboutSection from "@/components/AboutSection";
import AboutLeadership from "@/components/about/AboutLeadership";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import EnquiryModal from "@/components/EnquiryModal";
import NewsAlert from "@/components/NewsAlert";
const Index = () => {
    const [showEnquiryModal, setShowEnquiryModal] = useState(false);
    useEffect(() => {
        const hasVisited = localStorage.getItem("hasVisitedBefore");
        if (!hasVisited) {
            const timer = setTimeout(() => {
                setShowEnquiryModal(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);
    const handleCloseModal = () => {
        setShowEnquiryModal(false);
        localStorage.setItem("hasVisitedBefore", "true");
    };
    return (<div className="min-h-screen">
      <EnquiryModal isOpen={showEnquiryModal} onClose={handleCloseModal}/>
      
      <NewsAlert />
      
      <Header />
      <Hero />
      <CoursesSection />
      <AboutLeadership />
      <AboutSection />
      <TestimonialsSection />
      <Footer />
    </div>);
};
export default Index;
