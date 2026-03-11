import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Award } from "lucide-react";
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
interface AboutTabProps {
    aboutContent: AboutContent;
}
const AboutTab: React.FC<AboutTabProps> = ({ aboutContent }) => {
    return (<div className="space-y-6">
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
    </div>);
};
export default AboutTab;
