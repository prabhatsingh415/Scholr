import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
interface Testimonial {
    id: string;
    name: string;
    role: string;
    content: string;
    rating: number;
    image?: string;
}
interface TestimonialsTabProps {
    testimonials: Testimonial[];
    onAnimateAdd: (type: "testimonial") => void;
    onAnimateDelete: (element: HTMLElement, type: "testimonial", id: string) => void;
}
const TestimonialsTab: React.FC<TestimonialsTabProps> = ({ testimonials, onAnimateAdd, onAnimateDelete }) => {
    return (<div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Manage Testimonials</h3>
        <Button onClick={() => onAnimateAdd("testimonial")}>
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
                  <Button size="sm" variant="destructive" onClick={(e) => onAnimateDelete(e.currentTarget, "testimonial", testimonial.id)}>
                    <Trash2 className="h-4 w-4"/>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>))}
      </div>
    </div>);
};
export default TestimonialsTab;
