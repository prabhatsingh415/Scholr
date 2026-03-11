import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X, Grid3X3, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { gsap } from "gsap";
interface GalleryImage {
    id: string;
    src: string;
    title: string;
    description: string;
    category: "campus" | "facilities" | "events" | "students";
}
const galleryImages: GalleryImage[] = [
    {
        id: "1",
        src: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop",
        title: "Modern Learning Spaces",
        description: "State-of-the-art classrooms with cutting-edge technology",
        category: "facilities"
    },
    {
        id: "2",
        src: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=800&h=600&fit=crop",
        title: "Grand Hall",
        description: "Our magnificent main auditorium for ceremonies and events",
        category: "campus"
    },
    {
        id: "3",
        src: "https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?w=800&h=600&fit=crop",
        title: "Historic Architecture",
        description: "Beautiful blend of traditional and modern architecture",
        category: "campus"
    },
    {
        id: "4",
        src: "https://images.unsplash.com/photo-1551038247-3d9af20df552?w=800&h=600&fit=crop",
        title: "Science Complex",
        description: "Advanced laboratories and research facilities",
        category: "facilities"
    },
    {
        id: "5",
        src: "https://images.unsplash.com/photo-1524230572899-a752b3835840?w=800&h=600&fit=crop",
        title: "Student Center",
        description: "Hub of student activities and social gatherings",
        category: "students"
    },
    {
        id: "6",
        src: "https://images.unsplash.com/photo-1433832597046-4f10e10ac764?w=800&h=600&fit=crop",
        title: "Innovation Tower",
        description: "Our newest addition housing technology programs",
        category: "facilities"
    },
    {
        id: "7",
        src: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop",
        title: "Graduation Ceremony",
        description: "Celebrating academic achievements",
        category: "events"
    },
    {
        id: "8",
        src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
        title: "Library",
        description: "Quiet study spaces and extensive resources",
        category: "facilities"
    }
];
const PhotoGallery = () => {
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [viewMode, setViewMode] = useState<"grid" | "masonry">("grid");
    const heroRef = useRef<HTMLDivElement>(null);
    const galleryRef = useRef<HTMLDivElement>(null);
    const imageRefs = useRef<HTMLDivElement[]>([]);
    const categories = [
        { id: "all", name: "All Photos" },
        { id: "campus", name: "Campus Views" },
        { id: "facilities", name: "Facilities" },
        { id: "students", name: "Student Life" },
        { id: "events", name: "Events" }
    ];
    const filteredImages = selectedCategory === "all"
        ? galleryImages
        : galleryImages.filter(img => img.category === selectedCategory);
    useEffect(() => {
        const tl = gsap.timeline();
        tl.from(heroRef.current, {
            opacity: 0,
            y: 80,
            duration: 1.2,
            ease: "power4.out"
        })
            .from(".filter-button", {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.4)"
        }, "-=0.6")
            .from(galleryRef.current, {
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        }, "-=0.4");
    }, []);
    useEffect(() => {
        if (imageRefs.current.length > 0) {
            gsap.fromTo(imageRefs.current, {
                opacity: 0,
                scale: 0.8,
                y: 50
            }, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "back.out(1.2)"
            });
        }
    }, [filteredImages]);
    const addImageRef = (el: HTMLDivElement) => {
        if (el && !imageRefs.current.includes(el)) {
            imageRefs.current.push(el);
        }
    };
    const openLightbox = (image: GalleryImage, index: number) => {
        setSelectedImage(image);
        setCurrentIndex(index);
        gsap.fromTo(".lightbox-modal", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.4)" });
    };
    const closeLightbox = () => {
        gsap.to(".lightbox-modal", {
            opacity: 0,
            scale: 0.8,
            duration: 0.3,
            ease: "power2.inOut",
            onComplete: () => setSelectedImage(null)
        });
    };
    const nextImage = () => {
        const nextIndex = (currentIndex + 1) % filteredImages.length;
        setCurrentIndex(nextIndex);
        setSelectedImage(filteredImages[nextIndex]);
    };
    const prevImage = () => {
        const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
        setCurrentIndex(prevIndex);
        setSelectedImage(filteredImages[prevIndex]);
    };
    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategory(categoryId);
        imageRefs.current = [];
    };
    return (<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      
      <section ref={heroRef} className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-8">
            <ImageIcon className="w-10 h-10 text-white"/>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-gray-900 to-indigo-600 bg-clip-text text-transparent mb-6">
            Photo Gallery
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover the beauty of our campus through our comprehensive photo collection showcasing facilities, events, and student life
          </p>
          
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <Button onClick={() => setViewMode("grid")} variant={viewMode === "grid" ? "default" : "outline"} className="hover:scale-105 transition-transform">
              <Grid3X3 className="w-4 h-4 mr-2"/>
              Grid View
            </Button>
            <Button onClick={() => setViewMode("masonry")} variant={viewMode === "masonry" ? "default" : "outline"} className="hover:scale-105 transition-transform">
              <ImageIcon className="w-4 h-4 mr-2"/>
              Masonry
            </Button>
          </div>
        </div>
      </section>

      
      <section className="pb-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (<Button key={category.id} variant={selectedCategory === category.id ? "default" : "outline"} onClick={() => handleCategoryChange(category.id)} className="filter-button hover:scale-105 transition-all duration-300 shadow-lg">
                {category.name}
              </Button>))}
          </div>
        </div>
      </section>

      
      <section ref={galleryRef} className="pb-16 px-4">
        <div className="container mx-auto">
          <div className={`grid gap-6 ${viewMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "columns-1 md:columns-2 lg:columns-3 xl:columns-4"}`}>
            {filteredImages.map((image, index) => (<Card key={`${image.id}-${selectedCategory}`} ref={addImageRef} className="group cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden" onClick={() => openLightbox(image, index)}>
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img src={image.src} alt={image.title} className={`w-full object-cover group-hover:scale-110 transition-transform duration-700 ${viewMode === "grid" ? "h-64" : "h-auto"}`}/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"/>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="font-bold text-lg mb-2">{image.title}</h3>
                      <p className="text-sm opacity-90">{image.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>))}
          </div>
        </div>
      </section>

      
      {selectedImage && (<div className="lightbox-modal fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl w-full">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 hover:scale-110 transition-all" onClick={closeLightbox}>
              <X className="w-6 h-6"/>
            </Button>
            
            <Button variant="ghost" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 hover:scale-110 transition-all" onClick={prevImage}>
              <ChevronLeft className="w-8 h-8"/>
            </Button>
            
            <Button variant="ghost" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 hover:scale-110 transition-all" onClick={nextImage}>
              <ChevronRight className="w-8 h-8"/>
            </Button>

            <img src={selectedImage.src} alt={selectedImage.title} className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl"/>
            
            <div className="absolute bottom-6 left-6 right-6 text-white bg-black/50 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-3xl font-bold mb-3">{selectedImage.title}</h3>
              <p className="text-lg opacity-90 mb-2">{selectedImage.description}</p>
              <p className="text-sm opacity-70">
                {currentIndex + 1} of {filteredImages.length} photos
              </p>
            </div>
          </div>
        </div>)}

      <Footer />
    </div>);
};
export default PhotoGallery;
