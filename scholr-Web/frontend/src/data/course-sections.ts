import { Code, Cpu, type LucideIcon } from "lucide-react";

export type CourseProgramKey = "BTECH" | "BCA";

export type CourseBranch = {
    id: number;
    title: string;
    description: string;
    image: string;
    duration: string;
    students: string;
    subjects: string[];
    featured: boolean;
};

export type CourseSection = {
    title: string;
    icon: LucideIcon;
    description: string;
    color: string;
    branches: CourseBranch[];
};

export const courseSections: Record<CourseProgramKey, CourseSection> = {
    BTECH: {
        title: "Bachelor of Technology",
        icon: Cpu,
        description: "Advanced engineering and technology programs for future innovators",
        color: "from-purple-500 to-pink-500",
        branches: [
            {
                id: 5,
                title: "B.Tech - Computer Science Engineering",
                description: "Comprehensive computer science with focus on algorithms and system design.",
                image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                duration: "4 Years",
                students: "2.1K",
                subjects: ["Data Structures", "Algorithms", "Computer Networks", "AI/ML"],
                featured: true
            },
            {
                id: 7,
                title: "B.Tech - Electronics & Communication",
                description: "Electronic systems, communication networks, and signal processing.",
                image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                duration: "4 Years",
                students: "1.5K",
                subjects: ["Digital Electronics", "Signal Processing", "VLSI Design", "Communication Systems"],
                featured: false
            },
            {
                id: 8,
                title: "B.Tech - Agriculture Engineering",
                description: "Food Engineering, Farm Engineeing, manufacturing processes, and design engineering.",
                image: "/images/IMG_0189.JPG",
                duration: "4 Years",
                students: "1.3K",
                subjects: ["Thermodynamics", "Manufacturing", "CAD/CAM", "Robotics"],
                featured: true
            },
            {
                id: 9,
                title: "B.Tech - Civil Engineering",
                description: "Infrastructure development, construction management, and structural design.",
                image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                duration: "4 Years",
                students: "1.1K",
                subjects: ["Structural Engineering", "Construction Management", "Environmental Engineering", "Surveying"],
                featured: false
            },
            {
                id: 10,
                title: "B.Tech - Electrical Engineering",
                description: "Power systems, electrical machines, and renewable energy technologies.",
                image: "/images/1.jpg",
                duration: "4 Years",
                students: "900",
                subjects: ["Power Systems", "Electrical Machines", "Control Systems", "Renewable Energy"],
                featured: false
            }
        ]
    },
    BCA: {
        title: "Bachelor of Computer Applications",
        icon: Code,
        description: "Comprehensive computer applications and software development programs",
        color: "from-blue-500 to-cyan-500",
        branches: [
            {
                id: 1,
                title: "BCA - Bechlor in Computer Applications",
                description: "Master programming languages, software engineering, and application development.",
                image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                duration: "3 Years",
                students: "1.2K",
                subjects: ["Java", "Python", "Web Development", "Database Management"],
                featured: true
            },
        ]
    }
};
