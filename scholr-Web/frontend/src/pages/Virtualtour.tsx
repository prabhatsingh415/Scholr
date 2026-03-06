import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Navigation, MapPin, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { gsap } from "gsap";
interface TourLocation {
    id: string;
    name: string;
    description: string;
    image: string;
    video?: string;
    category: "academic" | "recreational" | "residential" | "administrative";
    hotspots: Array<{
        x: number;
        y: number;
        title: string;
        description: string;
    }>;
}
const tourLocations: TourLocation[] = [
    {
        id: "1",
        name: "GECB Tour",
        description: "Explore our state-of-the-art library with over 500,000 books and digital resources",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=800&fit=crop",
        video: "lv_0_20250705230659 (2).mp4",
        category: "academic",
        hotspots: [
            { x: 25, y: 60, title: "Reading Area", description: "Quiet study spaces for focused learning" }
        ]
    }
];
const VirtualTour = () => {
    const [currentLocation, setCurrentLocation] = useState<TourLocation>(tourLocations[0]);
    const [isAutoTour, setIsAutoTour] = useState(false);
    const [tourProgress, setTourProgress] = useState(0);
    const [selectedHotspot, setSelectedHotspot] = useState<number | null>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const tourRef = useRef<HTMLDivElement>(null);
    const controlsRef = useRef<HTMLDivElement>(null);
    const locationRefs = useRef<HTMLDivElement[]>([]);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    useEffect(() => {
        const tl = gsap.timeline();
        tl.from(heroRef.current, {
            opacity: 0,
            y: 100,
            duration: 1.5,
            ease: "power4.out"
        })
            .from(controlsRef.current, {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "back.out(1.4)"
        }, "-=0.8")
            .from(tourRef.current, {
            opacity: 0,
            scale: 0.9,
            duration: 1.2,
            ease: "power3.out"
        }, "-=0.6")
            .from(".location-card", {
            opacity: 0,
            x: -50,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out"
        }, "-=0.4");
    }, []);
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isAutoTour) {
            interval = setInterval(() => {
                setTourProgress(prev => {
                    const newProgress = prev + 1;
                    if (newProgress >= 100) {
                        const currentIndex = tourLocations.findIndex(loc => loc.id === currentLocation.id);
                        const nextIndex = (currentIndex + 1) % tourLocations.length;
                        setCurrentLocation(tourLocations[nextIndex]);
                        return 0;
                    }
                    return newProgress;
                });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isAutoTour, currentLocation]);
    const addLocationRef = (el: HTMLDivElement) => {
        if (el && !locationRefs.current.includes(el)) {
            locationRefs.current.push(el);
        }
    };
    const selectLocation = (location: TourLocation) => {
        setCurrentLocation(location);
        setTourProgress(0);
        setSelectedHotspot(null);
        gsap.fromTo(".tour-viewer", { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" });
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };
    const toggleAutoTour = () => {
        setIsAutoTour(prev => {
            const newState = !prev;
            if (videoRef.current) {
                if (newState) {
                    videoRef.current.play();
                }
                else {
                    videoRef.current.pause();
                }
            }
            if (newState)
                setTourProgress(0);
            return newState;
        });
    };
    const resetTour = () => {
        setCurrentLocation(tourLocations[0]);
        setTourProgress(0);
        setIsAutoTour(false);
        setSelectedHotspot(null);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };
    return (<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      <Header />

      
      <section ref={heroRef} className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-8">
            <Navigation className="w-10 h-10 text-white"/>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-6">
            Virtual Campus Tour
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Take an immersive video/image journey through our campus facilities and discover what makes our university special
          </p>
        </div>
      </section>

      
      <section ref={controlsRef} className="pb-8 px-4">
        <div className="container mx-auto">
          <Card className="shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Button onClick={toggleAutoTour} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:scale-105 transition-all">
                    {isAutoTour ? <Pause className="w-4 h-4 mr-2"/> : <Play className="w-4 h-4 mr-2"/>}
                    {isAutoTour ? "Pause Tour" : "Start Auto Tour"}
                  </Button>
                  <Button variant="outline" onClick={resetTour} className="hover:scale-105 transition-transform">
                    <RotateCcw className="w-4 h-4 mr-2"/>
                    Reset
                  </Button>
                </div>
              </div>

              {isAutoTour && (<div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-100" style={{ width: `${tourProgress}%` }}/>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Auto tour progress: {tourProgress}%</p>
                </div>)}
            </CardContent>
          </Card>
        </div>
      </section>

      
      <section ref={tourRef} className="pb-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Tour Locations</h3>
              {tourLocations.map((location) => (<Card key={location.id} ref={addLocationRef} className={`location-card cursor-pointer transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${currentLocation.id === location.id
                ? "ring-2 ring-blue-500 shadow-xl bg-blue-50"
                : "hover:bg-gray-50"}`} onClick={() => selectLocation(location)}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full mt-2 ${currentLocation.id === location.id ? "bg-blue-500" : "bg-gray-300"}`}/>
                      <div>
                        <h4 className="font-semibold text-gray-900">{location.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{location.description}</p>
                        <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          {location.category}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>))}
            </div>

            
            <div className="lg:col-span-3">
              <Card className="shadow-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5"/>
                    {currentLocation.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="tour-viewer relative">
                    {currentLocation.video ? (<video ref={videoRef} src={currentLocation.video} controls muted loop className="w-full h-96 lg:h-[500px] object-cover"/>) : (<img src={currentLocation.image} alt={currentLocation.name} className="w-full h-96 lg:h-[500px] object-cover"/>)}

                    
                    {currentLocation.hotspots.map((hotspot, index) => (<button key={index} className={`absolute w-8 h-8 bg-blue-500 rounded-full border-4 border-white shadow-lg hover:scale-125 transition-all duration-300 ${selectedHotspot === index ? "bg-red-500 animate-pulse" : "hover:bg-blue-600"}`} style={{
                left: `${hotspot.x}%`,
                top: `${hotspot.y}%`,
                transform: "translate(-50%, -50%)"
            }} onClick={() => setSelectedHotspot(selectedHotspot === index ? null : index)}>
                        <Camera className="w-4 h-4 text-white m-auto"/>
                      </button>))}

                    
                    {selectedHotspot !== null && (<div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-xl animate-fade-in">
                        <h4 className="font-bold text-gray-900">{currentLocation.hotspots[selectedHotspot].title}</h4>
                        <p className="text-gray-600 text-sm mt-1">{currentLocation.hotspots[selectedHotspot].description}</p>
                      </div>)}

                    
                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white rounded-lg p-3">
                      <p className="text-sm font-medium">{currentLocation.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>);
};
export default VirtualTour;
