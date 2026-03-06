import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
interface Event {
    id: string;
    title: string;
    date: string;
    description: string;
    location: string;
    image?: string;
}
interface EventsTabProps {
    events: Event[];
    onAnimateAdd: (type: "event") => void;
    onAnimateDelete: (element: HTMLElement, type: "event", id: string) => void;
}
const EventsTab: React.FC<EventsTabProps> = ({ events, onAnimateAdd, onAnimateDelete }) => {
    return (<div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Manage Events</h3>
        <Button onClick={() => onAnimateAdd("event")}>
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
                  <Button size="sm" variant="destructive" onClick={(e) => onAnimateDelete(e.currentTarget, "event", event.id)}>
                    <Trash2 className="h-4 w-4"/>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>))}
      </div>
    </div>);
};
export default EventsTab;
