import { cn } from "@/lib/utils";
import { 
  Phone, 
  Mail, 
  FileText, 
  Calendar, 
  ArrowRight,
  MessageSquare,
  CheckCircle2,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface Activity {
  id: string;
  type: "call" | "email" | "meeting" | "note" | "stage_change" | "task";
  title: string;
  description?: string;
  timestamp: string;
  user: string;
}

const iconMap = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  note: MessageSquare,
  stage_change: ArrowRight,
  task: CheckCircle2,
};

const colorMap = {
  call: "bg-info/10 text-info",
  email: "bg-accent/10 text-accent",
  meeting: "bg-success/10 text-success",
  note: "bg-muted text-muted-foreground",
  stage_change: "bg-primary/10 text-primary",
  task: "bg-success/10 text-success",
};

interface ActivityTimelineProps {
  activities: Activity[];
  onAddActivity?: () => void;
}

export function ActivityTimeline({ activities, onAddActivity }: ActivityTimelineProps) {
  return (
    <Card className="card-elevated">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Activity Timeline</CardTitle>
        {onAddActivity && (
          <Button variant="outline" size="sm" onClick={onAddActivity}>
            <Plus className="h-4 w-4 mr-1" />
            Log Activity
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No activities recorded yet
            </p>
          ) : (
            activities.map((activity, index) => {
              const Icon = iconMap[activity.type];
              return (
                <div
                  key={activity.id}
                  className="flex gap-4 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full",
                        colorMap[activity.type]
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    {index < activities.length - 1 && (
                      <div className="absolute left-1/2 top-8 h-full w-px -translate-x-1/2 bg-border" />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-card-foreground">
                          {activity.title}
                        </p>
                        {activity.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {activity.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          by {activity.user}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {activity.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
