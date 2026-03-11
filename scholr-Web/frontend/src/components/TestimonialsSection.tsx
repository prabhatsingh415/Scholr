import { useState, useEffect, useRef } from "react";
import { Star, ChevronLeft, ChevronRight, Quote, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
const testimonials = [
    {
        id: 1,
        name: "Sameeksha Meena",
        role: "JEN",
        course: "Electrical Engineering",
        image: "/images/Sameeksha Meena.png",
        content: "This institution didn't just educate me\u2014it transformed my entire perspective on innovation and leadership. The visionary approach here is unmatched anywhere in the world.",
        rating: 5,
        achievement: "Graduate From GECB"
    },
    {
        id: 2,
        name: "Sandeep Thakur",
        role: "Sr. Software Developer at TCS",
        course: "Computer Science Engineering ",
        image: "/images/Sandeep Thakur.png",
        content: "The cutting-edge research environment and world-class mentorship here shaped my career in ways I never imagined. This is where the future is born.",
        rating: 5,
        achievement: "Graduate From GECB"
    },
    {
        id: 3,
        name: "Vishnu Mahawar",
        role: "Sr. Software Developer at Five Holidays",
        course: "Computer Science Engineering",
        image: "/images/Vishnu Mahawar.png",
        content: "The global perspective and strategic thinking I developed here have been the foundation of my success across three continents. Truly transformational.",
        rating: 5,
        achievement: "Graduate From GECB"
    },
    {
        id: 4,
        name: "Vivek Bairwa",
        role: "Power Grid",
        course: "Global Tech Policy",
        image: "/images/Vivek Bairwa.png",
        content: "This place gave me the confidence and tools to influence global decisions on AI ethics.",
        rating: 5,
        achievement: "Graduate From GECB"
    },
    {
        id: 5,
        name: "Ayushi Goyal",
        role: "CTO at QuantumLeap",
        course: "Computer Science Engineering",
        image: "/images/Ayushi Goyal.png",
        content: "Quantum theory finally made sense here\u2014thanks to brilliant professors and hands-on labs.",
        rating: 5,
        achievement: "Graduate From GECB"
    },
    {
        id: 6,
        name: "Kartik Nama",
        role: "UX Design Lead at Airbnb",
        course: "Computer Science Engineering",
        image: "/images/kartik.png",
        content: "Human empathy and design thinking merged into something beautiful during my time here.",
        rating: 4,
        achievement: "Graduate From GECB"
    },
    {
        id: 7,
        name: "Ashutosh Singh",
        role: "DevOps Engineer",
        course: "Computer Science Engineering",
        image: "/images/blank.jpg",
        content: "They nurtured my startup dream from an idea into a company with global impact.",
        rating: 5,
        achievement: "Graduate From GECB"
    },
    {
        id: 8,
        name: "Ashutosh Sharma",
        role: "Informative Assistant",
        course: "Computer Science Engineering",
        image: "/images/blank.jpg",
        content: "We worked on real-world energy projects that are saving lives and the planet.",
        rating: 4,
        achievement: "Graduate From GECB"
    },
    {
        id: 9,
        name: "Ankit Saini",
        role: "Informative Assistant",
        course: "Computer Science Engineering",
        image: "/images/ankit saini.jpg",
        content: "Cyber threats are evolving\u2014and so did my mindset and skills here.",
        rating: 5,
        achievement: "Graduate From GECB"
    },
    {
        id: 10,
        name: "Sahil Khan",
        role: "Architect at Shree Ji Architecture",
        course: "Civil Engineering",
        image: "/images/sahil - Edited.jpg",
        content: "We're using AI to make life-saving diagnoses\u2014and it started with the knowledge I gained here.",
        rating: 5,
        achievement: "Graduate From GECB"
    },
    {
        id: 11,
        name: "Arvind Meghwal",
        role: "Field Engineer at NTPC",
        course: "Electrical Engineering",
        image: "/images/arvind.jpg",
        content: "The XR lab was a game changer for my passion in building virtual worlds.",
        rating: 4,
        achievement: "Graduate From GECB"
    },
    {
        id: 12,
        name: "Sonu Nagar",
        role: "Technical Executive at J.K Super Cement",
        course: "Civil Engineering",
        image: "/images/sonu bijora.jpg",
        content: "I learned to think like an economist and a strategist under one roof.",
        rating: 4,
        achievement: "Graduate From GECB"
    },
    {
        id: 14,
        name: "Deepika Suman",
        role: "Paint Consultant (C.R.M) at Birla opus",
        course: "Computer Science Engineering",
        image: "/images/deepika suman.jpg",
        content: "Merging legal expertise with digital rights advocacy started in this course.",
        rating: 5,
        achievement: "Graduate From GECB"
    },
    {
        id: 15,
        name: "Yash Prajapati",
        role: "Power Grid",
        course: "Computer Science Engineering",
        image: "/images/AVI_0227 - Edited.jpg",
        content: "CRISPR, gene editing, and ethical research\u2014it all came together in our labs.",
        rating: 5,
        achievement: "Graduate From GECB"
    },
    {
        id: 16,
        name: "Jai Prakash Bairwa",
        role: "Civil Engneering at Adani Cement",
        course: "Civil Engineering",
        image: "/images/jppy.jpg",
        content: "I work with global agencies now, but it all began with my professors\u2019 mentorship.",
        rating: 4,
        achievement: "Graduate From GECB"
    },
    {
        id: 17,
        name: "Devansh Panchal",
        role: "Satellite Systems Engineer",
        course: "Computer Science Engineering",
        image: "/images/AVI_0109 - Edited.jpg",
        content: "From blueprint to orbit\u2014this college launched more than just ideas.",
        rating: 5,
        achievement: "Graduate From GECB"
    },
    {
        id: 18,
        name: "Hemant Ojha",
        role: "Digital Artist & NFT Creator",
        course: "Civil Engineering",
        image: "/images/hemant ojha.jpg",
        content: "I turned my passion for art into a career powered by tech and storytelling.",
        rating: 4,
        achievement: "Graduate From GECB"
    },
    {
        id: 19,
        name: "Surendra Mahawar",
        role: "Architect at Shree Ji Architecture",
        course: "Civil Engineering",
        image: "/images/Surendra mahawar.jpg",
        content: "We're using AI to make life-saving diagnoses\u2014and it started with the knowledge I gained here.",
        rating: 5,
        achievement: "Graduate From GECB"
    },
    {
        id: 20,
        name: "Kumkum Chouhan",
        role: "Digital Artist & NFT Creator",
        course: "Computer Science Engineering",
        image: "/images/kumkum.jpg",
        content: "I turned my passion for art into a career powered by tech and storytelling.",
        rating: 4,
        achievement: "Graduate From GECB"
    }
];
const TestimonialsSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const testimonialRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        gsap.fromTo(titleRef.current, { opacity: 0, y: 100, scale: 0.8 }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.5,
            ease: "power4.out",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
            }
        });
        gsap.fromTo(testimonialRef.current, { opacity: 0, y: 80, scale: 0.9 }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: "back.out(1.4)",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 70%",
            }
        });
    }, []);
    useEffect(() => {
        gsap.fromTo(testimonialRef.current, { opacity: 0, x: 50, scale: 0.95 }, { opacity: 1, x: 0, scale: 1, duration: 0.8, ease: "power3.out" });
    }, [currentIndex]);
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);
    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };
    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };
    const currentTestimonial = testimonials[currentIndex];
    return (<section ref={sectionRef} className="py-32 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground relative overflow-hidden">
      
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-40 h-40 border-2 border-current rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 border border-current rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 border border-current rounded-full animate-pulse"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
            <Award className="w-5 h-5 text-yellow-300"/>
            <span className="text-sm font-semibold tracking-wide">GRADUATE SUCCESS STORIES</span>
          </div>
          
          <h2 ref={titleRef} className="text-5xl md:text-7xl font-bold mb-8">
            <span className="block">Voices of</span>
            <span className="block text-yellow-300">Excellence</span>
          </h2>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Hear from visionaries who transformed their ambitions into world-changing achievements through our exceptional programs.
          </p>
        </div>

        
        <div className="max-w-6xl mx-auto">
          <div ref={testimonialRef} className="relative bg-background/15 backdrop-blur-xl rounded-3xl p-12 md:p-16 border border-white/20 shadow-2xl">
            
            <div className="absolute -top-8 left-12">
              <div className="w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center shadow-xl">
                <Quote className="w-8 h-8 text-primary"/>
              </div>
            </div>

            
            <blockquote className="text-2xl md:text-4xl font-light mb-12 leading-relaxed text-center italic">
              "{currentTestimonial.content}"
            </blockquote>

            
            <div className="flex items-center justify-center space-x-2 mb-8">
              {[...Array(currentTestimonial.rating)].map((_, i) => (<Star key={i} className="w-7 h-7 fill-yellow-300 text-yellow-300"/>))}
            </div>

            
            <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-8">
              <img src={currentTestimonial.image} alt={currentTestimonial.name} className="w-[200px] h-[300px]  rounded-full object-cover border-4 border-yellow-300 shadow-xl transition-all duration-500"/>
              <div className="text-center md:text-left">
                <div className="font-bold text-2xl mb-1">{currentTestimonial.name}</div>
                <div className="text-primary-foreground/90 text-lg mb-2">{currentTestimonial.role}</div>
                <div className="text-yellow-300 font-medium">{currentTestimonial.course} Graduate</div>
                <div className="inline-flex items-center space-x-2 mt-3 bg-yellow-300/20 rounded-full px-3 py-1">
                  <Award className="w-4 h-4 text-yellow-300"/>
                  <span className="text-sm font-medium">{currentTestimonial.achievement}</span>
                </div>
              </div>
            </div>

            
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/20">
              <Button variant="outline" size="lg" onClick={prevTestimonial} className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-all duration-300">
                <ChevronLeft className="w-5 h-5 mr-2"/>
                Previous Story
              </Button>

              
              <div className="flex space-x-3">
                {testimonials.map((_, index) => (<button key={index} onClick={() => setCurrentIndex(index)} className={`w-4 h-4 rounded-full transition-all duration-300 ${index === currentIndex
                ? "bg-yellow-300 scale-125"
                : "bg-primary-foreground/40 hover:bg-primary-foreground/60"}`}/>))}
              </div>

              <Button variant="outline" size="lg" onClick={nextTestimonial} className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-all duration-300">
                Next Story
                <ChevronRight className="w-5 h-5 ml-2"/>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>);
};
export default TestimonialsSection;
