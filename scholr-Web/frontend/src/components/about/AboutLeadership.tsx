import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Award, GraduationCap } from "lucide-react";
import { leadershipData } from "./AboutData";
gsap.registerPlugin(ScrollTrigger);
const AboutLeadership = () => {
    const leadershipRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        gsap.fromTo(contentRef.current, {
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
                start: "top 80%"
            }
        });
        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);
    const renderLeaderCard = (leader: any) => (<div className="grid grid-cols-1 items-center gap-8 rounded-3xl bg-background p-5 shadow-xl sm:p-8 lg:gap-12 xl:grid-cols-2 xl:gap-20">
      <div className="relative">
        <div className="relative rounded-3xl overflow-hidden bg-slate-100 shadow-2xl group">
          <img src={leader.image} alt={leader.name} className="h-[340px] w-full object-contain object-top p-3 transition-all duration-700 group-hover:scale-[1.02] sm:h-[460px] sm:p-4 lg:h-[560px] xl:h-[600px]"/>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent"></div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 lg:contents">
          <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-4 text-white shadow-2xl sm:p-6 lg:absolute lg:-bottom-8 lg:-right-8">
            <div className="text-center">
              <leader.badge.icon className="mx-auto mb-2 h-7 w-7 sm:h-8 sm:w-8"/>
              <div className="text-xs font-bold sm:text-sm">{leader.badge.text}</div>
              <div className="text-[11px] opacity-90 sm:text-xs">{leader.badge.year}</div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-background/95 p-4 shadow-2xl backdrop-blur-xl sm:p-6 lg:absolute lg:-left-8 lg:-top-8">
            <div className="text-center">
              <GraduationCap className="mx-auto mb-2 h-7 w-7 text-primary sm:h-8 sm:w-8"/>
              <div className="text-base font-bold text-primary sm:text-lg">{leader.stats.number}</div>
              <div className="text-[11px] font-medium text-muted-foreground sm:text-xs">{leader.stats.label}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-4 py-2 sm:px-6">
          <Award className="h-4 w-4 text-primary sm:h-5 sm:w-5"/>
          <span className="text-xs font-semibold tracking-[0.18em] text-primary sm:text-sm sm:tracking-wide">
            {leader.title.toUpperCase()}
          </span>
        </div>

        <h3 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">{leader.name}</h3>

        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
            <p className="text-sm font-semibold text-foreground sm:text-base">{leader.education}</p>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
            <p className="text-sm font-semibold text-foreground sm:text-base">{leader.experience}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xl font-bold text-foreground">Key Achievements</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leader.achievements.map((achievement: string, index: number) => (<div key={index} className="flex items-center space-x-3 group">
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
          <div className="relative rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-5 sm:p-8">
            <div className="absolute -top-4 left-5 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 sm:left-6">
              <span className="text-lg text-white">"</span>
            </div>
            <p className="text-base font-medium leading-relaxed text-foreground italic sm:text-lg">{leader.quote}</p>
            <div className="mt-6 flex items-center space-x-4">
              <div className="w-12 h-0.5 bg-primary"></div>
              <span className="text-primary font-semibold text-sm">{leader.name}</span>
              <div className="w-12 h-0.5 bg-primary"></div>
            </div>
          </div>
        </div>
      </div>
    </div>);
    return (<section ref={leadershipRef} className="relative overflow-hidden bg-gradient-to-br from-accent/5 to-background py-20 sm:py-24 lg:py-32">
      <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary)) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: "40px 40px, 60px 60px"
        }}></div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="mb-12 text-center sm:mb-16 lg:mb-20">
          <h2 className="mb-6 text-3xl font-bold sm:mb-8 sm:text-5xl lg:text-7xl">
            Our <span className="text-primary">Leadership</span>
          </h2>
          <p className="mx-auto max-w-3xl text-base text-muted-foreground sm:text-lg xl:text-xl">
            Meet the visionary leaders driving our institution toward excellence and innovation.
          </p>
        </div>

        <div ref={contentRef} className="mx-auto max-w-7xl space-y-16 sm:space-y-20 lg:space-y-28">
          {leadershipData.map((leader) => (<div key={leader.name}>{renderLeaderCard(leader)}</div>))}
        </div>
      </div>
    </section>);
};
export default AboutLeadership;
