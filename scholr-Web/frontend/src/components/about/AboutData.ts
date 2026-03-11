import { Award, Users, Globe, Target, BookOpen, Lightbulb, Heart, Zap, Medal, GraduationCap } from "lucide-react";
export const stats = [
    { number: "300+", label: "Students ", icon: Users },
    { number: "30+", label: "Expert Faculty", icon: Award },
    { number: "98%", label: "Success Rate", icon: Globe },
    { number: "5+", label: "Years of Excellence", icon: Target }
];
export const values = [
    {
        icon: BookOpen,
        title: "Academic Excellence",
        description: "Pursuing the highest standards in education, research, and scholarly achievement across all disciplines."
    },
    {
        icon: Lightbulb,
        title: "Innovation & Discovery",
        description: "Fostering creativity, critical thinking, and breakthrough discoveries that shape the future."
    },
    {
        icon: Heart,
        title: "Community Impact",
        description: "Creating positive change in communities through service, leadership, and social responsibility."
    },
    {
        icon: Zap,
        title: "Global Leadership",
        description: "Developing leaders who make meaningful contributions to society on a global scale."
    }
];
export const milestones = [
    { year: "2017", title: "College Founded", description: "Established with a vision to transform education" },
    { year: "2005", title: "First International Campus", description: "Expanded globally with our Singapore campus" },
    { year: "2012", title: "Research Excellence Award", description: "Recognized for groundbreaking research initiatives" },
    { year: "2018", title: "Digital Transformation", description: "Pioneered online and hybrid learning platforms" },
    { year: "2023", title: "Sustainability Leader", description: "Achieved carbon neutrality across all campuses" }
];
export const leadershipData = [
    {
        id: "principal",
        name: "Prof. S.K. Singh",
        title: "Vice-Chancellor",
        education: "Ph.D, M.Tech, B.E, FIE, FICS, FUWA, FIAH, FIEE, FIGS, FIIBE, FIWRS",
        experience: "25+ Years in Higher Education",
        image: "/images/DSC07351.JPG",
        achievements: [
            "Dr. A.P.J Abdul Kalam Memorial Award 2016.",
            "Unnat Bharat Sewashri Award - 2019.",
            "Commendable Research Award-2017 at DTU, Delhi.",
            "Excellent Services Award-1997, Constitution Club, New Delhi."
        ],
        quote: "Education is not just about imparting knowledge; it's about igniting the spark of curiosity that transforms minds and shapes the future of humanity.",
        badge: { icon: Medal, text: "Unnat Bharat Sewashri Award", year: "2019" },
        stats: { number: "25+", label: "Years Experience" }
    },
    {
        id: "vice-principal",
        name: "Dr. B.L. Gupta",
        title: "Principal ",
        education: "Ph.D, M.Tech, B.E, Diploma",
        experience: "20+ Years in Academic Leadership",
        image: "/images/Principal sir.png",
        achievements: [
            "Research Publications Journals: 20+",
            "Research Publications Conference: 20+",
            "Published Book 2+ Research Papers 20+"
        ],
        quote: "Technology and tradition must work hand in hand to create an educational experience that prepares students for tomorrow's challenges.",
        badge: { icon: Lightbulb, text: "Innovation Award", year: "2021" },
        stats: { number: "20+", label: "Years Leadership" }
    },
    {
        id: "vice-principal",
        name: " Vishal Namdev",
        title: "Assistant Professor",
        education: "M.Tech, B.Tech",
        experience: "18+ Years in Education Management",
        image: "/images/vishal.jpg",
        achievements: [
            "Vice Principal",
            "FIC (Academic)",
            "FIC (Exam)",
        ],
        quote: "True leadership in education is not about control, but about empowering others to reach their highest potential.",
        badge: { icon: Award, text: "Teaching Excellence", year: "2020" },
        stats: { number: "18+", label: "Years of Service" }
    },
    {
        id: "vice-principal",
        name: "Mahaveer Kumar Meghvanshi",
        title: "Assistant Professor",
        education: "M.Tech, B.Tech",
        experience: "15+ Years of Academic Excellence",
        image: "/images/mahaveer2.jpg",
        achievements: [
            "FIC (Finance)",
            "FIC (Procator)",
            "FIC (Establishment)"
        ],
        quote: "Academic excellence is a journey paved with dedication, vision, and the willingness to embrace change.",
        badge: { icon: GraduationCap, text: "Teaching Excellence", year: "2020" },
        stats: { number: "15+", label: "Years Teaching" }
    }
];
