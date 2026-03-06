import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Calendar, BarChart3, Settings } from "lucide-react";
interface OverviewTabProps {
    onAnimateAdd: (type: "course" | "testimonial" | "event") => void;
}
const OverviewTab: React.FC<OverviewTabProps> = ({ onAnimateAdd }) => {
    return (<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          <Button className="w-full justify-start" onClick={() => onAnimateAdd("course")}>
            <Plus className="h-4 w-4 mr-2"/>
            Add New Course
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => onAnimateAdd("testimonial")}>
            <MessageSquare className="h-4 w-4 mr-2"/>
            Add Testimonial
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => onAnimateAdd("event")}>
            <Calendar className="h-4 w-4 mr-2"/>
            Add Event
          </Button>
        </CardContent>
      </Card>
    </div>);
};
export default OverviewTab;
