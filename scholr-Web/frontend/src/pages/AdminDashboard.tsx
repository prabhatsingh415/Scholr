import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Users, BookOpen, MessageSquare, BarChart3, Image, Settings, Award, Calendar } from "lucide-react";
interface Course {
    id: string;
    title: string;
    description: string;
    duration: string;
    level: string;
    price: number;
    image?: string;
}
interface Testimonial {
    id: string;
    name: string;
    role: string;
    content: string;
    rating: number;
    image?: string;
}
interface HeroContent {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    buttonText: string;
    backgroundImage?: string;
}
interface AboutContent {
    id: string;
    title: string;
    description: string;
    mission: string;
    vision: string;
    stats: {
        students: number;
        courses: number;
        instructors: number;
        experience: number;
    };
}
interface Event {
    id: string;
    title: string;
    date: string;
    description: string;
    location: string;
    image?: string;
}
const AdminDashboard = () => {
    const dashboardRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement[]>([]);
    const tabsRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"course" | "testimonial" | "event" | null>(null);
    const [courses, setCourses] = useState<Course[]>([
        {
            id: "1",
            title: "Advanced React Development",
            description: "Master modern React patterns and best practices",
            duration: "12 weeks",
            level: "Advanced",
            price: 299,
            image: "/images/placeholder.svg"
        },
        {
            id: "2",
            title: "Full Stack JavaScript",
            description: "Complete web development with Node.js and React",
            duration: "16 weeks",
            level: "Intermediate",
            price: 399,
            image: "/images/placeholder.svg"
        }
    ]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([
        {
            id: "1",
            name: "John Smith",
            role: "Software Engineer",
            content: "Excellent learning experience with practical projects",
            rating: 5,
            image: "/images/placeholder.svg"
        },
        {
            id: "2",
            name: "Sarah Johnson",
            role: "Web Developer",
            content: "Great instructors and comprehensive curriculum",
            rating: 5,
            image: "/images/placeholder.svg"
        }
    ]);
    const [heroContent, setHeroContent] = useState<HeroContent>({
        id: "1",
        title: "Transform Your Future",
        subtitle: "Premium Education Platform",
        description: "Join thousands of students in our cutting-edge courses",
        buttonText: "Get Started Today",
        backgroundImage: "/images/placeholder.svg"
    });
    const [aboutContent, setAboutContent] = useState<AboutContent>({
        id: "1",
        title: "About Our Institute",
        description: "Leading education provider with excellence in teaching",
        mission: "To provide world-class education and training",
        vision: "To be the leading institute in professional development",
        stats: {
            students: 1234,
            courses: 50,
            instructors: 25,
            experience: 10
        }
    });
    const [events, setEvents] = useState<Event[]>([
        {
            id: "1",
            title: "Tech Conference 2024",
            date: "2024-08-15",
            description: "Annual technology conference with industry experts",
            location: "Main Auditorium",
            image: "/images/placeholder.svg"
        },
        {
            id: "2",
            title: "Workshop: AI & Machine Learning",
            date: "2024-08-20",
            description: "Hands-on workshop on AI and ML fundamentals",
            location: "Lab 101",
            image: "/images/placeholder.svg"
        }
    ]);
    const stats = [
        { icon: Users, label: "Total Students", value: aboutContent.stats.students.toString(), color: "text-blue-600" },
        { icon: BookOpen, label: "Active Courses", value: courses.length.toString(), color: "text-green-600" },
        { icon: MessageSquare, label: "Testimonials", value: testimonials.length.toString(), color: "text-purple-600" },
        { icon: Calendar, label: "Events", value: events.length.toString(), color: "text-orange-600" }
    ];
    useEffect(() => {
        const tl = gsap.timeline();
        tl.from(dashboardRef.current, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power2.out"
        })
            .from(cardsRef.current, {
            opacity: 0,
            y: 50,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=0.4")
            .from(tabsRef.current, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.3");
    }, []);
    const handleTabChange = (value: string) => {
        setActiveTab(value);
        gsap.fromTo(`[data-state="active"]`, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
    };
    const addCardRef = (el: HTMLDivElement) => {
        if (el && !cardsRef.current.includes(el)) {
            cardsRef.current.push(el);
        }
    };
    const animateAdd = (type: "course" | "testimonial" | "event") => {
        setModalType(type);
        setIsAddModalOpen(true);
        gsap.from(".modal-content", {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            ease: "back.out(1.7)"
        });
    };
    const animateDelete = (element: HTMLElement, type: "course" | "testimonial" | "event", id: string) => {
        gsap.to(element.closest("tr") || element.closest(".card-item"), {
            opacity: 0,
            x: -100,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                if (type === "course") {
                    setCourses(prev => prev.filter(item => item.id !== id));
                }
                else if (type === "testimonial") {
                    setTestimonials(prev => prev.filter(item => item.id !== id));
                }
                else if (type === "event") {
                    setEvents(prev => prev.filter(item => item.id !== id));
                }
            }
        });
    };
    const handleCardHover = (e: React.MouseEvent<HTMLDivElement>) => {
        gsap.to(e.currentTarget, {
            y: -5,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            duration: 0.3,
            ease: "power2.out"
        });
    };
    const handleCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        gsap.to(e.currentTarget, {
            y: 0,
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            duration: 0.3,
            ease: "power2.out"
        });
    };
    return (<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div ref={dashboardRef} className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage all sections of your website with animated controls</p>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (<Card key={stat.label} ref={addCardRef} className="hover:shadow-lg transition-all duration-300 cursor-pointer" onMouseEnter={handleCardHover} onMouseLeave={handleCardLeave}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`}/>
                </div>
              </CardContent>
            </Card>))}
        </div>

        
        <Card ref={tabsRef} className="shadow-xl">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-6 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="hero">Hero</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="testimonials">Reviews</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5"/>
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">New student enrolled in React course</span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Course completion rate increased by 15%</span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-50">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-sm">New testimonial received</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5"/>
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full justify-start" onClick={() => animateAdd("course")}>
                        <Plus className="h-4 w-4 mr-2"/>
                        Add New Course
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => animateAdd("testimonial")}>
                        <MessageSquare className="h-4 w-4 mr-2"/>
                        Add Testimonial
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => animateAdd("event")}>
                        <Calendar className="h-4 w-4 mr-2"/>
                        Add Event
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="hero" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Hero Section Management</h3>
                  <Button>
                    <Edit className="h-4 w-4 mr-2"/>
                    Edit Hero
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="heroTitle">Main Title</Label>
                          <Input id="heroTitle" value={heroContent.title} readOnly/>
                        </div>
                        <div>
                          <Label htmlFor="heroSubtitle">Subtitle</Label>
                          <Input id="heroSubtitle" value={heroContent.subtitle} readOnly/>
                        </div>
                        <div>
                          <Label htmlFor="heroDescription">Description</Label>
                          <Input id="heroDescription" value={heroContent.description} readOnly/>
                        </div>
                        <div>
                          <Label htmlFor="heroButton">Button Text</Label>
                          <Input id="heroButton" value={heroContent.buttonText} readOnly/>
                        </div>
                      </div>
                      <div className="flex items-center justify-center bg-gray-100 rounded-lg p-8">
                        <div className="text-center">
                          <Image className="h-16 w-16 mx-auto mb-4 text-gray-400"/>
                          <p className="text-sm text-gray-500">Hero Background Image</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="courses" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Manage Courses</h3>
                  <Button onClick={() => animateAdd("course")}>
                    <Plus className="h-4 w-4 mr-2"/>
                    Add Course
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Level</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {courses.map((course) => (<TableRow key={course.id} className="hover:bg-gray-50 transition-colors">
                            <TableCell className="font-medium">{course.title}</TableCell>
                            <TableCell>{course.duration}</TableCell>
                            <TableCell>
                              <Badge variant={course.level === "Advanced" ? "destructive" : "secondary"}>
                                {course.level}
                              </Badge>
                            </TableCell>
                            <TableCell>${course.price}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4"/>
                                </Button>
                                <Button size="sm" variant="destructive" onClick={(e) => animateDelete(e.currentTarget, "course", course.id)}>
                                  <Trash2 className="h-4 w-4"/>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="testimonials" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Manage Testimonials</h3>
                  <Button onClick={() => animateAdd("testimonial")}>
                    <Plus className="h-4 w-4 mr-2"/>
                    Add Testimonial
                  </Button>
                </div>

                <div className="grid gap-4">
                  {testimonials.map((testimonial) => (<Card key={testimonial.id} className="hover:shadow-md transition-shadow card-item">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold">{testimonial.name}</h4>
                              <Badge variant="outline">{testimonial.role}</Badge>
                              <div className="flex text-yellow-400">
                                {"\u2605".repeat(testimonial.rating)}
                              </div>
                            </div>
                            <p className="text-gray-600">{testimonial.content}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4"/>
                            </Button>
                            <Button size="sm" variant="destructive" onClick={(e) => animateDelete(e.currentTarget, "testimonial", testimonial.id)}>
                              <Trash2 className="h-4 w-4"/>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>))}
                </div>
              </TabsContent>

              <TabsContent value="events" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Manage Events</h3>
                  <Button onClick={() => animateAdd("event")}>
                    <Plus className="h-4 w-4 mr-2"/>
                    Add Event
                  </Button>
                </div>

                <div className="grid gap-4">
                  {events.map((event) => (<Card key={event.id} className="hover:shadow-md transition-shadow card-item">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold">{event.title}</h4>
                              <Badge variant="outline">{event.date}</Badge>
                            </div>
                            <p className="text-gray-600 mb-2">{event.description}</p>
                            <p className="text-sm text-gray-500">📍 {event.location}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4"/>
                            </Button>
                            <Button size="sm" variant="destructive" onClick={(e) => animateDelete(e.currentTarget, "event", event.id)}>
                              <Trash2 className="h-4 w-4"/>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>))}
                </div>
              </TabsContent>

              <TabsContent value="about" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">About Section Management</h3>
                  <Button>
                    <Edit className="h-4 w-4 mr-2"/>
                    Edit About
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Content</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="aboutTitle">Title</Label>
                        <Input id="aboutTitle" value={aboutContent.title} readOnly/>
                      </div>
                      <div>
                        <Label htmlFor="aboutDescription">Description</Label>
                        <Input id="aboutDescription" value={aboutContent.description} readOnly/>
                      </div>
                      <div>
                        <Label htmlFor="aboutMission">Mission</Label>
                        <Input id="aboutMission" value={aboutContent.mission} readOnly/>
                      </div>
                      <div>
                        <Label htmlFor="aboutVision">Vision</Label>
                        <Input id="aboutVision" value={aboutContent.vision} readOnly/>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5"/>
                        Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{aboutContent.stats.students}</p>
                          <p className="text-sm text-gray-600">Students</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{aboutContent.stats.courses}</p>
                          <p className="text-sm text-gray-600">Courses</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">{aboutContent.stats.instructors}</p>
                          <p className="text-sm text-gray-600">Instructors</p>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <p className="text-2xl font-bold text-orange-600">{aboutContent.stats.experience}+</p>
                          <p className="text-sm text-gray-600">Years</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>);
};
export default AdminDashboard;
