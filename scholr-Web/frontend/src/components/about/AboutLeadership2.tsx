import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Award, GraduationCap } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { leadershipData } from "./AboutData";
gsap.registerPlugin(ScrollTrigger);
const AboutLeadership = () => {
    const leadershipRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        gsap.fromTo(sliderRef.current, {
            opacity: 0,
            y: 100,
            scale: 0.9,
            rotationX: -20
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            duration: 2,
            ease: "power4.out",
            scrollTrigger: {
                trigger: leadershipRef.current,
                start: "top 80%",
            }
        });
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);
    return (<section ref={leadershipRef} className="py-32 bg-gradient-to-br from-accent/5 to-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary)) 1px, transparent 1px),
                         radial-gradient(circle at 75% 75%, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: "40px 40px, 60px 60px"
        }}></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-bold mb-8">
            Our <span className="text-primary">Leadership</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Meet the visionary leaders driving our institution toward excellence and innovation.
          </p>
        </div>

        <div ref={sliderRef} className="max-w-7xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {leadershipData.map((leader) => (<CarouselItem key={leader.id}>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-20 items-center p-8">
                    
                    <div className="relative">
                      <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                        <img src={leader.image} alt={leader.name} className="w-full h-[600px] object-cover group-hover:scale-110 transition-all duration-700"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent"></div>
                      </div>
                      
                      
                      <div className="absolute -bottom-8 -right-8 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-2xl p-6 text-white">
                        <div className="text-center">
                          <leader.badge.icon className="w-8 h-8 mx-auto mb-2"/>
                          <div className="text-sm font-bold">{leader.badge.text}</div>
                          <div className="text-xs opacity-90">{leader.badge.year}</div>
                        </div>
                      </div>

                      
                      <div className="absolute -top-8 -left-8 bg-background/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-border/50">
                        <div className="text-center">
                          <GraduationCap className="w-8 h-8 mx-auto mb-2 text-primary"/>
                          <div className="text-lg font-bold text-primary">{leader.stats.number}</div>
                          <div className="text-xs text-muted-foreground font-medium">{leader.stats.label}</div>
                        </div>
                      </div>
                    </div>

                    
                    <div className="space-y-8">
                      <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-6 py-2">
                        <Award className="w-5 h-5 text-primary"/>
                        <span className="text-sm font-semibold text-primary tracking-wide">{leader.title.toUpperCase()}</span>
                      </div>

                      <h3 className="text-4xl md:text-5xl font-bold text-foreground">
                        {leader.name}
                      </h3>

                      <div className="space-y-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                          <div>
                            <p className="font-semibold text-foreground">{leader.education}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                          <div>
                            <p className="font-semibold text-foreground">{leader.experience}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xl font-bold text-foreground">Key Achievements</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {leader.achievements.map((achievement, index) => (<div key={index} className="flex items-center space-x-3 group">
                              <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                                <Award className="w-3 h-3 text-white"/>
                              </div>
                              <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors duration-300">
                                {achievement}
                              </span>
                            </div>))}
                        </div>
                      </div>

                      
                      <div className="mt-12">
                        <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 relative">
                          <div className="absolute -top-4 left-6 w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                            <span className="text-lg text-white">"</span>
                          </div>
                          <p className="text-lg font-medium text-foreground leading-relaxed italic">
                            {leader.quote}
                          </p>
                          <div className="mt-6 flex items-center space-x-4">
                            <div className="w-12 h-0.5 bg-primary"></div>
                            <span className="text-primary font-semibold text-sm">{leader.name}</span>
                            <div className="w-12 h-0.5 bg-primary"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>))}
            </CarouselContent>
            
            <CarouselPrevious className="left-4 w-12 h-12 bg-primary/90 hover:bg-primary text-white border-0 hover:scale-110 transition-all duration-300"/>
            <CarouselNext className="right-4 w-12 h-12 bg-primary/90 hover:bg-primary text-white border-0 hover:scale-110 transition-all duration-300"/>
          </Carousel>
        </div>
      </div>
    </section>);
};
export default AboutLeadership;
