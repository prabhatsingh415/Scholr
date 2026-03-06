import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [submenus, setSubmenus] = useState<Record<string, boolean>>({});
    const headerRef = useRef<HTMLElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const navRef = useRef<HTMLElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const tl = gsap.timeline();
        gsap.set([logoRef.current, navRef.current, ctaRef.current], {
            opacity: 0,
            y: -30
        });
        tl.to(logoRef.current, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power4.out"
        })
            .to(navRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power4.out"
        }, "-=0.8")
            .to(ctaRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power4.out"
        }, "-=0.6");
        let lastScrollY = 0;
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                gsap.to(headerRef.current, {
                    y: -100,
                    scaleY: 0.8,
                    duration: 0.6,
                    ease: "power3.inOut"
                });
            }
            else {
                gsap.to(headerRef.current, {
                    y: 0,
                    scaleY: 1,
                    duration: 0.8,
                    ease: "back.out(1.4)"
                });
            }
            lastScrollY = currentScrollY;
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            tl.kill();
        };
    }, []);
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const toggleSubmenu = (menuName: string) => {
        setSubmenus(prev => ({
            ...prev,
            [menuName]: !prev[menuName]
        }));
    };
    const navItems = [
        { name: "Home", href: "/" },
        {
            name: "Academics",
            submenu: [
                { name: "Academic Calendar", href: "https://rtu.ac.in/index/viewdata.php?page=Academic-Calendar1" },
                { name: "Syllabus", href: "#syllabus" },
                { name: "Results", href: "https://rtu.sumsraj.com/Exam/Report/DownloadGradesheet.aspx" },
                { name: "Time Table Management", href: "#timetable" },
                { name: "Your Career", href: "#career" },
                { name: "Campuses", href: "#campuses" }
            ]
        },
        {
            name: "Cells",
            submenu: [
                { name: "AICTE Cells", href: "#aicte" },
                { name: "Alumni Cells", href: "#alumni" },
                { name: "Campus Development & Planning Cells", href: "#campus-dev" },
                { name: "EAP Cells", href: "#eap" },
                { name: "Environment Cells", href: "#environment" },
                { name: "IIC Cells", href: "#iic" },
                { name: "NBA Cells", href: "#nba" },
                { name: "Sports Department Cells", href: "#sports" }
            ]
        },
        { name: "faculty", href: "/Faculty" },
        { name: "Event", href: "/events" },
        { name: "About Us", href: "/about" },
        { name: "Contact Us", href: "/contact" }
    ];
    return (<header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50">
  <div className="container mx-auto px-6">
    <div className="flex items-center justify-between h-20">
      
      
      <div ref={logoRef} className="flex items-center">
        <div className="flex items-center justify-center p-5 z-[1] w-full md:w-full">
          <a href="/" className="block w-full">
            <img src="/images/ENGNEERING COLLEGE BARAN.png" alt="University Logo" className="h-full md:w-32 w-full min-w-[60px] object-contain translate-x-4"/>
          </a>
        </div>
      </div>

          
          <nav ref={navRef} className="hidden lg:flex items-center space-x-12">
            {navItems.map((item, index) => (<div key={index} className="relative group">
                {item.submenu ? (<>
                    <button className="flex items-center space-x-1 text-foreground hover:text-primary transition-all duration-300 font-medium uppercase" onClick={() => toggleSubmenu(item.name)}>
                      <span>{item.name}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${submenus[item.name] ? "rotate-0" : "-rotate-90"}`}/>
                    </button>
                    {submenus[item.name] && (<div className="absolute top-full min-w-[calc(100%+112px)] opacity-100 pb-10 transition-opacity pointer-events-auto font-normal -translate-x-10 pt-8">
                        <ul className="bg-white shadow-lg">
                          {item.submenu.map((subItem, subIndex) => (<li key={subIndex} className="group/child relative whitespace-nowrap bg-white transition-colors cursor-pointer">
                              <a href={subItem.href} className="flex gap-2 items-center group-hover/child:text-primary group-hover/child:font-bold transition-colors px-10 py-7">
                                {subItem.name}
                              </a>
                            </li>))}
                        </ul>
                      </div>)}
                  </>) : (<a href={item.href} className="relative text-foreground hover:text-primary transition-all duration-300 font-medium uppercase">
                    {item.name}
                  </a>)}
              </div>))}
          </nav>

         
          <div ref={ctaRef} className="hidden lg:flex items-center space-x-4">
            
            <Button variant="outline" className="border-2 hover:scale-105 transition-all duration-300" onClick={() => window.location.href = "/login"}>
              Login
            </Button>
            <Button onClick={() => window.location.href = "/apply"} className="bg-gradient-to-r from-primary to-primary/80 hover:scale-105 transition-all duration-300 shadow-lg">
              Enquiry Now
            </Button>
          </div>


          
          <button className="lg:hidden p-3 rounded-lg hover:bg-accent transition-colors" onClick={toggleMenu}>
            {isMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
          </button>
        </div>

        
        {isMenuOpen && (<div className="lg:hidden fixed inset-0 z-40">
            
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={toggleMenu}/>
            
            
            <div className="absolute right-0 bg-black top-0 min-h-screen text-white w-full lg:w-1/2 md:min-w-[500px] pt-32 pb-32 px-10 xl:px-20 overflow-y-auto">
              <ul className="flex flex-col gap-4 w-full">
                {navItems.map((item, index) => (<li key={index} className="max-w-96 w-full">
                    {item.submenu ? (<>
                        <div className="flex justify-between items-center gap-5 text-3xl font-bold cursor-pointer transition-opacity hover:opacity-80 w-full" onClick={() => toggleSubmenu(item.name)}>
                          <span>{item.name}</span>
                          <ChevronDown className={`transition-transform ${submenus[item.name] ? "rotate-0" : "-rotate-90"}`}/>
                        </div>
                        {submenus[item.name] && (<ul className="pl-5">
                            {item.submenu.map((subItem, subIndex) => (<li key={subIndex} className="relative cursor-pointer font-bold transition-opacity hover:opacity-80 py-2">
                                <a href={subItem.href} className="flex items-center px-5 py-2 text-xl">
                                  {subItem.name}
                                </a>
                              </li>))}
                          </ul>)}
                      </>) : (<a href={item.href} className="flex justify-between items-center gap-5 text-3xl font-bold cursor-pointer transition-opacity hover:opacity-80 w-full">
                        {item.name}
                      </a>)}
                  </li>))}
              </ul>

              <div className="mt-10 flex flex-col gap-5">
                <Button className="w-full bg-gradient-to-r from-primary to-primary/80">
                  Apply
                </Button>
                
                <Button variant="outline" className="w-full text-black bg-white" onClick={() => window.location.href = "/login"}>
                  Login
                </Button>
              </div>

              <div className="mt-10 flex gap-5 items-center justify-center">
                <button className="p-2 hover:scale-110 transition-transform">
                  <Search className="w-6 h-6"/>
                </button>
                <button className="p-2 hover:scale-110 transition-transform">
                  
                  <svg className="w-6 h-6" viewBox="0 0 22 22" fill="currentColor">
                    
                  </svg>
                </button>
              </div>
            </div>
          </div>)}
      </div>
    </header>);
};
export default Header;
