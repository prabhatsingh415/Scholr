import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, MessageSquare, Calendar } from "lucide-react";
interface StatsCardsProps {
    courses: any[];
    testimonials: any[];
    events: any[];
    aboutContent: {
        stats: {
            students: number;
            courses: number;
            instructors: number;
            experience: number;
        };
    };
    onCardHover: (e: React.MouseEvent<HTMLDivElement>) => void;
    onCardLeave: (e: React.MouseEvent<HTMLDivElement>) => void;
    addCardRef: (el: HTMLDivElement) => void;
}
const StatsCards: React.FC<StatsCardsProps> = ({ courses, testimonials, events, aboutContent, onCardHover, onCardLeave, addCardRef }) => {
    const stats = [
        { icon: Users, label: "Total Students", value: aboutContent.stats.students.toString(), color: "text-blue-600" },
        { icon: BookOpen, label: "Active Courses", value: courses.length.toString(), color: "text-green-600" },
        { icon: MessageSquare, label: "Testimonials", value: testimonials.length.toString(), color: "text-purple-600" },
        { icon: Calendar, label: "Events", value: events.length.toString(), color: "text-orange-600" }
    ];
    return (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (<Card key={stat.label} ref={addCardRef} className="hover:shadow-lg transition-all duration-300 cursor-pointer" onMouseEnter={onCardHover} onMouseLeave={onCardLeave}>
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
    </div>);
};
export default StatsCards;
