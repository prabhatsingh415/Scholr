import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { gsap } from "gsap";
import { User, BookOpen, Calendar, FileText, CreditCard, Bell, Settings, GraduationCap, Trophy, Clock, Mail, Phone, MapPin } from "lucide-react";
const StudentPortal = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const loginFormRef = useRef<HTMLDivElement>(null);
    const dashboardRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement[]>([]);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement[]>([]);
    useEffect(() => {
        const tl = gsap.timeline();
        gsap.set([heroRef.current, loginFormRef.current], {
            opacity: 0,
            y: 50
        });
        tl.to(heroRef.current, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power4.out"
        })
            .to(loginFormRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power4.out"
        }, "-=0.6");
        gsap.to(heroRef.current, {
            y: -10,
            duration: 3,
            ease: "power2.inOut",
            yoyo: true,
            repeat: -1
        });
        return () => tl.kill();
    }, []);
    useEffect(() => {
        if (isLoggedIn && dashboardRef.current) {
            const tl = gsap.timeline();
            tl.to(loginFormRef.current, {
                opacity: 0,
                y: -50,
                duration: 0.6,
                ease: "power3.in"
            });
            tl.set(dashboardRef.current, { display: "block" })
                .from(sidebarRef.current, {
                x: -100,
                opacity: 0,
                duration: 0.8,
                ease: "power4.out"
            })
                .from(statsRef.current, {
                scale: 0.8,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "back.out(1.7)"
            }, "-=0.4")
                .from(cardsRef.current, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power4.out"
            }, "-=0.6");
            gsap.to(statsRef.current, {
                y: -5,
                duration: 2,
                ease: "power2.inOut",
                yoyo: true,
                repeat: -1,
                stagger: 0.2
            });
            return () => tl.kill();
        }
    }, [isLoggedIn]);
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const button = e.currentTarget.querySelector("button");
        gsap.to(button, {
            scale: 0.95,
            duration: 0.1,
            ease: "power2.out",
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                setIsLoggedIn(true);
            }
        });
    };
    const addToCardsRef = (el: HTMLDivElement | null) => {
        if (el && !cardsRef.current.includes(el)) {
            cardsRef.current.push(el);
        }
    };
    const addToStatsRef = (el: HTMLDivElement | null) => {
        if (el && !statsRef.current.includes(el)) {
            statsRef.current.push(el);
        }
    };
    const handleCardHover = (e: React.MouseEvent<HTMLDivElement>) => {
        gsap.to(e.currentTarget, {
            scale: 1.05,
            y: -10,
            duration: 0.3,
            ease: "power2.out"
        });
    };
    const handleCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        gsap.to(e.currentTarget, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
        });
    };
    if (!isLoggedIn) {
        return (<div ref={containerRef} className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
        
        <div ref={heroRef} className="relative pt-32 pb-16 px-6">
          <div className="container mx-auto text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary via-primary/80 to-primary/60 rounded-full mx-auto mb-8 flex items-center justify-center shadow-2xl">
              <GraduationCap className="w-12 h-12 text-primary-foreground"/>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gradient mb-6">
              Student Portal
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Access your academic journey, manage courses, view grades, and connect with your university community.
            </p>
          </div>
        </div>

        
        <div ref={loginFormRef} className="max-w-md mx-auto px-6 pb-20">
          <Card className="premium-border backdrop-blur-xl bg-card/80 shadow-premium">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl text-gradient">Welcome Back</CardTitle>
              <p className="text-muted-foreground">Sign in to access your portal</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@university.edu" className="h-12 transition-all duration-300 focus:scale-105" required/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="h-12 transition-all duration-300 focus:scale-105" required/>
                </div>
                <Button type="submit" className="w-full h-12 text-lg bg-gradient-to-r from-primary to-primary/80 hover:shadow-glow transition-all duration-300">
                  Sign In to Portal
                </Button>
                <div className="text-center">
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot your password?
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>);
    }
    return (<div ref={dashboardRef} className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10" style={{ display: "none" }}>
      <div className="flex">
        
        <div ref={sidebarRef} className="w-64 bg-card/80 backdrop-blur-xl border-r border-border/50 min-h-screen p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-primary-foreground"/>
            </div>
            <div>
              <h3 className="font-semibold">Nitin </h3>
              <p className="text-sm text-muted-foreground">Student ID: 2024001</p>
            </div>
          </div>

          <nav className="space-y-2">
            {[
            { icon: BookOpen, label: "My Courses", active: true },
            { icon: Calendar, label: "Schedule" },
            { icon: FileText, label: "Assignments" },
            { icon: Trophy, label: "Grades" },
            { icon: CreditCard, label: "Billing" },
            { icon: Bell, label: "Notifications" },
            { icon: Settings, label: "Settings" }
        ].map((item, index) => (<button key={index} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-primary/10 hover:scale-105 ${item.active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                <item.icon className="w-5 h-5"/>
                <span className="text-sm font-medium">{item.label}</span>
              </button>))}
          </nav>
        </div>

        
        <div className="flex-1 p-8">
          
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gradient">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, John! Here's your academic overview.</p>
            </div>
            <Button className="bg-gradient-to-r from-primary to-primary/80 hover:scale-105 transition-all duration-300">
              <Bell className="w-4 h-4 mr-2"/>
              3 New Updates
            </Button>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
            { label: "Current GPA", value: "3.85", icon: Trophy, color: "from-green-500 to-emerald-500" },
            { label: "Credits Completed", value: "87/120", icon: BookOpen, color: "from-blue-500 to-cyan-500" },
            { label: "Active Courses", value: "5", icon: Calendar, color: "from-purple-500 to-violet-500" },
            { label: "Pending Tasks", value: "12", icon: Clock, color: "from-orange-500 to-amber-500" }
        ].map((stat, index) => (<div key={index} ref={addToStatsRef} className="bg-card/80 backdrop-blur-xl p-6 rounded-xl border border-border/50 hover:shadow-glow transition-all duration-300 cursor-pointer" onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2 })} onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white"/>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>))}
          </div>

          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <Card ref={addToCardsRef} className="premium-border backdrop-blur-xl bg-card/80 hover:shadow-glow transition-all duration-300" onMouseEnter={handleCardHover} onMouseLeave={handleCardLeave}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-primary"/>
                  <span>Current Courses</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
            { name: "Advanced Mathematics", code: "MATH 401", progress: 85 },
            { name: "Computer Science Theory", code: "CS 301", progress: 92 },
            { name: "Physics Laboratory", code: "PHYS 201", progress: 78 },
            { name: "English Literature", code: "ENG 301", progress: 88 }
        ].map((course, index) => (<div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{course.name}</h4>
                      <p className="text-sm text-muted-foreground">{course.code}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-primary">{course.progress}%</div>
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-1000" style={{ width: `${course.progress}%` }}/>
                      </div>
                    </div>
                  </div>))}
              </CardContent>
            </Card>

            
            <Card ref={addToCardsRef} className="premium-border backdrop-blur-xl bg-card/80 hover:shadow-glow transition-all duration-300" onMouseEnter={handleCardHover} onMouseLeave={handleCardLeave}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-primary"/>
                  <span>Upcoming Assignments</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
            { title: "Calculus Problem Set", due: "Due Tomorrow", urgent: true },
            { title: "Physics Lab Report", due: "Due in 3 days", urgent: false },
            { title: "Literature Essay", due: "Due in 1 week", urgent: false },
            { title: "CS Project Milestone", due: "Due in 2 weeks", urgent: false }
        ].map((assignment, index) => (<div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${assignment.urgent ? "bg-red-500" : "bg-green-500"}`}/>
                      <div>
                        <h4 className="font-medium">{assignment.title}</h4>
                        <p className={`text-sm ${assignment.urgent ? "text-red-500" : "text-muted-foreground"}`}>
                          {assignment.due}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="hover:scale-105 transition-all duration-200">
                      View
                    </Button>
                  </div>))}
              </CardContent>
            </Card>

            
            <Card ref={addToCardsRef} className="premium-border backdrop-blur-xl bg-card/80 hover:shadow-glow transition-all duration-300" onMouseEnter={handleCardHover} onMouseLeave={handleCardLeave}>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                {[
            { icon: Calendar, label: "Schedule", color: "from-blue-500 to-cyan-500" },
            { icon: FileText, label: "Grades", color: "from-green-500 to-emerald-500" },
            { icon: CreditCard, label: "Billing", color: "from-purple-500 to-violet-500" },
            { icon: Mail, label: "Messages", color: "from-orange-500 to-amber-500" }
        ].map((action, index) => (<button key={index} className="flex flex-col items-center p-6 bg-muted/50 rounded-lg hover:scale-105 transition-all duration-300 group">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                      <action.icon className="w-6 h-6 text-white"/>
                    </div>
                    <span className="text-sm font-medium">{action.label}</span>
                  </button>))}
              </CardContent>
            </Card>

            
            <Card ref={addToCardsRef} className="premium-border backdrop-blur-xl bg-card/80 hover:shadow-glow transition-all duration-300" onMouseEnter={handleCardHover} onMouseLeave={handleCardLeave}>
              <CardHeader>
                <CardTitle>Contact & Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <Mail className="w-5 h-5 text-primary"/>
                  <div>
                    <p className="font-medium">Academic Advisor</p>
                    <p className="text-sm text-muted-foreground">advisor@university.edu</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <Phone className="w-5 h-5 text-primary"/>
                  <div>
                    <p className="font-medium">Student Services</p>
                    <p className="text-sm text-muted-foreground">(555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary"/>
                  <div>
                    <p className="font-medium">Campus Location</p>
                    <p className="text-sm text-muted-foreground">Student Center, Room 201</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>);
};
export default StudentPortal;
