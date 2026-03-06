import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Image } from "lucide-react";
interface HeroContent {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    buttonText: string;
    backgroundImage?: string;
}
interface HeroTabProps {
    heroContent: HeroContent;
}
const HeroTab: React.FC<HeroTabProps> = ({ heroContent }) => {
    return (<div className="space-y-6">
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
    </div>);
};
export default HeroTab;
