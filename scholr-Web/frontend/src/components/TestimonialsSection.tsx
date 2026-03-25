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
        image: "/images/blank.jpg",
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
    const fallbackImage = "/images/blank.jpg";
    const normalizeImageSrc = (path: string) => {
        if (!path)
            return encodeURI(fallbackImage);
        const normalized = path.startsWith("/") ? path : `/images/${path}`;
        return encodeURI(normalized);
    };
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
    return (<section ref={sectionRef} id="testimonials" className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 py-20 text-primary-foreground sm:py-24 lg:py-32">
      
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-6 top-16 hidden h-24 w-24 animate-pulse rounded-full border-2 border-current sm:block lg:left-20 lg:top-20 lg:h-40 lg:w-40"></div>
        <div className="absolute bottom-10 right-6 hidden h-32 w-32 animate-pulse rounded-full border border-current sm:block lg:bottom-20 lg:right-20 lg:h-60 lg:w-60"></div>
        <div className="absolute left-1/4 top-1/2 hidden h-20 w-20 animate-pulse rounded-full border border-current md:block lg:h-32 lg:w-32"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        
        <div className="mb-12 text-center sm:mb-16 lg:mb-20">
          <div className="mb-6 inline-flex items-center space-x-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm sm:mb-8 sm:px-6 sm:py-3">
            <Award className="h-4 w-4 text-yellow-300 sm:h-5 sm:w-5"/>
            <span className="text-xs font-semibold tracking-[0.18em] sm:text-sm sm:tracking-wide">GRADUATE SUCCESS STORIES</span>
          </div>
          
          <h2 ref={titleRef} className="mb-6 text-3xl font-bold sm:mb-8 sm:text-5xl lg:text-7xl">
            <span className="block">Voices of</span>
            <span className="block text-yellow-300">Excellence</span>
          </h2>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-primary-foreground/90 sm:text-lg xl:text-xl">
            Hear from visionaries who transformed their ambitions into world-changing achievements through our exceptional programs.
          </p>
        </div>

        
        <div className="max-w-6xl mx-auto">
          <div ref={testimonialRef} className="relative rounded-3xl border border-white/20 bg-background/15 p-5 shadow-2xl backdrop-blur-xl sm:p-8 md:p-12 lg:p-16">
            
            <div className="absolute -top-6 left-5 sm:-top-8 sm:left-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-300 shadow-xl sm:h-16 sm:w-16">
                <Quote className="h-6 w-6 text-primary sm:h-8 sm:w-8"/>
              </div>
            </div>

            
            <blockquote className="mb-8 pt-4 text-center text-lg font-light italic leading-relaxed sm:mb-10 sm:text-2xl md:text-3xl lg:mb-12 lg:text-4xl">
              "{currentTestimonial.content}"
            </blockquote>

            
            <div className="mb-8 flex items-center justify-center space-x-2">
              {[...Array(currentTestimonial.rating)].map((_, i) => (<Star key={i} className="w-7 h-7 fill-yellow-300 text-yellow-300"/>))}
            </div>

            
            <div className="flex flex-col items-center justify-center gap-5 md:flex-row md:gap-8">
              <img src={normalizeImageSrc(currentTestimonial.image)} alt={currentTestimonial.name} onError={(event) => {
            event.currentTarget.src = encodeURI(fallbackImage);
        }} className="h-32 w-32 rounded-[1.75rem] border-4 border-yellow-300 object-cover shadow-xl transition-all duration-500 sm:h-40 sm:w-40 md:h-[220px] md:w-[180px] md:rounded-[2.25rem] lg:h-[300px] lg:w-[200px] lg:rounded-full"/>
              <div className="text-center md:text-left">
                <div className="mb-1 text-xl font-bold sm:text-2xl">{currentTestimonial.name}</div>
                <div className="mb-2 text-base text-primary-foreground/90 sm:text-lg">{currentTestimonial.role}</div>
                <div className="text-yellow-300 font-medium">{currentTestimonial.course}</div>
                <div className="mt-3 inline-flex items-center space-x-2 rounded-full bg-yellow-300/20 px-3 py-1">
                  <Award className="h-4 w-4 text-yellow-300"/>
                  <span className="text-sm font-medium">{currentTestimonial.achievement}</span>
                </div>
              </div>
            </div>

            
            <div className="mt-8 flex flex-col gap-4 border-t border-white/20 pt-6 sm:mt-10 sm:pt-8 lg:mt-12 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center justify-between gap-3 lg:hidden">
                <Button variant="outline" size="icon" onClick={prevTestimonial} className="h-11 w-11 border-2 border-white/40 bg-white/10 text-white transition-all duration-300 hover:bg-white/20 hover:text-white">
                  <ChevronLeft className="h-5 w-5"/>
                </Button>
                <span className="text-sm font-medium text-white/80">{currentIndex + 1} / {testimonials.length}</span>
                <Button variant="outline" size="icon" onClick={nextTestimonial} className="h-11 w-11 border-2 border-white/40 bg-white/10 text-white transition-all duration-300 hover:bg-white/20 hover:text-white">
                  <ChevronRight className="h-5 w-5"/>
                </Button>
              </div>

              <Button variant="outline" size="lg" onClick={prevTestimonial} className="hidden w-full border-2 border-white/40 bg-white/10 text-white transition-all duration-300 hover:bg-white/20 hover:text-white lg:inline-flex lg:w-auto">
                <ChevronLeft className="w-5 h-5 mr-2"/>
                Previous Story
              </Button>

              
              <div className="hidden flex-wrap items-center justify-center gap-3 lg:flex">
                {testimonials.map((_, index) => (<button key={index} type="button" aria-label={`Show testimonial ${index + 1}`} onClick={() => setCurrentIndex(index)} className={`w-4 h-4 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 ${index === currentIndex
                ? "bg-yellow-300 scale-125"
                : "bg-primary-foreground/40 hover:bg-primary-foreground/60"}`}/>))}
              </div>

              <Button variant="outline" size="lg" onClick={nextTestimonial} className="hidden w-full border-2 border-white/40 bg-white/10 text-white transition-all duration-300 hover:bg-white/20 hover:text-white lg:inline-flex lg:w-auto">
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
