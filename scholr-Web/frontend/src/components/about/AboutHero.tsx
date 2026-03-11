import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
const AboutHero = () => {
    const heroRef = useRef<HTMLElement>(null);
    const parallaxRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    useEffect(() => {
        const tl = gsap.timeline();
        gsap.set([titleRef.current, subtitleRef.current], {
            opacity: 0,
            y: 150,
            scale: 0.8,
            rotationX: -45
        });
        tl.to(titleRef.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            duration: 1.8,
            ease: "back.out(1.4)"
        })
            .to(subtitleRef.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            duration: 1.5,
            ease: "power4.out"
        }, "-=1.2");
        gsap.to(parallaxRef.current, {
            yPercent: -50,
            ease: "none",
            scrollTrigger: {
                trigger: heroRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);
    return (<section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div ref={parallaxRef} className="absolute inset-0 z-0" style={{
            backgroundImage: "url(\"https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80\")",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed"
        }}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-background/90"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center text-white">
        <h1 ref={titleRef} className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
          About Our
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white">
           College
          </span>
        </h1>
        <p ref={subtitleRef} className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed opacity-90">
          For over 5+ years, we've been at the forefront of educational excellence, 
          shaping minds and transforming lives through innovative learning and groundbreaking research.
        </p>
      </div>
    </section>);
};
export default AboutHero;
