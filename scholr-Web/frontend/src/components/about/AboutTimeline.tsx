import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { milestones } from "./AboutData";
gsap.registerPlugin(ScrollTrigger);
const AboutTimeline = () => {
    const timelineRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        gsap.fromTo(timelineRef.current?.children, {
            opacity: 0,
            x: -200,
            scale: 0.8,
            skewX: -15
        }, {
            opacity: 1,
            x: 0,
            scale: 1,
            skewX: 0,
            duration: 1.2,
            stagger: 0.3,
            ease: "power3.out",
            scrollTrigger: {
                trigger: timelineRef.current,
                start: "top 85%",
            }
        });
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);
    return (<section className="py-32 bg-gradient-to-br from-background to-primary/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-bold mb-8">
            Our <span className="text-primary">Journey</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Milestones that define our commitment to educational excellence and innovation.
          </p>
        </div>

        <div ref={timelineRef} className="space-y-16">
          {milestones.map((milestone, index) => (<div key={index} className="flex items-center gap-12 group">
              <div className="flex-shrink-0 w-32 h-32 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                <span className="text-2xl font-bold text-white">{milestone.year}</span>
              </div>
              <div className="flex-1 p-8 rounded-2xl bg-gradient-to-r from-background to-accent/5 border border-border/50 group-hover:border-primary/30 transition-all duration-500 group-hover:shadow-xl">
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                  {milestone.title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {milestone.description}
                </p>
              </div>
            </div>))}
        </div>
      </div>
    </section>);
};
export default AboutTimeline;
