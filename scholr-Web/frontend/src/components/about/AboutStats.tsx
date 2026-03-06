import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { stats } from "./AboutData";
gsap.registerPlugin(ScrollTrigger);
const AboutStats = () => {
    const statsRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        gsap.fromTo(statsRef.current?.children, {
            opacity: 0,
            y: 100,
            scale: 0.5,
            rotationY: -45,
            transformOrigin: "center center"
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationY: 0,
            duration: 1.5,
            stagger: 0.2,
            ease: "back.out(2)",
            scrollTrigger: {
                trigger: statsRef.current,
                start: "top 85%",
            }
        });
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);
    return (<section className="py-32 bg-gradient-to-br from-background to-accent/10">
      <div className="container mx-auto px-6">
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, index) => (<div key={index} className="text-center group">
              <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-primary to-primary/70 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <stat.icon className="w-12 h-12 text-white"/>
              </div>
              <div className="text-5xl font-bold text-primary mb-4 group-hover:scale-110 transition-all duration-300">
                {stat.number}
              </div>
              <div className="text-lg font-semibold text-muted-foreground">
                {stat.label}
              </div>
            </div>))}
        </div>
      </div>
    </section>);
};
export default AboutStats;
