import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { values } from "./AboutData";
gsap.registerPlugin(ScrollTrigger);
const AboutValues = () => {
    const valuesRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        gsap.fromTo(valuesRef.current?.children, {
            opacity: 0,
            scale: 0.3,
            rotation: -15,
            transformOrigin: "center center"
        }, {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1.8,
            stagger: 0.25,
            ease: "elastic.out(1, 0.5)",
            scrollTrigger: {
                trigger: valuesRef.current,
                start: "top 80%",
            }
        });
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);
    return (<section className="py-32 bg-gradient-to-br from-accent/5 to-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-bold mb-8">
            Our <span className="text-primary">Core Values</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The principles that guide everything we do and shape our commitment to excellence.
          </p>
        </div>

        <div ref={valuesRef} className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {values.map((value, index) => (<div key={index} className="group p-10 rounded-3xl bg-gradient-to-br from-background to-accent/5 border border-border/50 hover:border-primary/30 transition-all duration-700 hover:shadow-2xl hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                <value.icon className="w-10 h-10 text-primary"/>
              </div>
              <h3 className="text-2xl font-bold mb-6 group-hover:text-primary transition-colors duration-300">
                {value.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {value.description}
              </p>
            </div>))}
        </div>
      </div>
    </section>);
};
export default AboutValues;
