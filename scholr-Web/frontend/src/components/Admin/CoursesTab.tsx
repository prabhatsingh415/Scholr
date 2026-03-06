import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
interface Course {
    id: string;
    title: string;
    description: string;
    duration: string;
    level: string;
    price: number;
    image?: string;
}
interface CoursesTabProps {
    courses: Course[];
    onAnimateAdd: (type: "course") => void;
    onAnimateDelete: (element: HTMLElement, type: "course", id: string) => void;
}
const CoursesTab: React.FC<CoursesTabProps> = ({ courses, onAnimateAdd, onAnimateDelete }) => {
    return (<div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Manage Courses</h3>
        <Button onClick={() => onAnimateAdd("course")}>
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
                      <Button size="sm" variant="destructive" onClick={(e) => onAnimateDelete(e.currentTarget, "course", course.id)}>
                        <Trash2 className="h-4 w-4"/>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>);
};
export default CoursesTab;
