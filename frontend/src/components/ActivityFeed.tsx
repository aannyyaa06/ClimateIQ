import { Card } from "@/components/ui/card";
import { Mail, Cloud, Video, FileText, TrendingDown } from "lucide-react";

interface Activity {
  id: string;
  type: "email" | "cloud" | "video" | "document";
  title: string;
  emissions: string;
  timestamp: string;
  reduction?: string;
}

const activities: Activity[] = [
  {
    id: "1",
    type: "email",
    title: "Automated email batching",
    emissions: "0.2 kg CO₂ saved",
    timestamp: "1 minute ago",
    reduction: "15%"
  },
  {
    id: "2",
    type: "cloud",
    title: "Cloud storage optimization",
    emissions: "1.5 kg CO₂ saved",
    timestamp: "50 seconds ago",
    reduction: "25%"
  },
  {
    id: "3",
    type: "video",
    title: "Video quality auto-adjusted",
    emissions: "0.8 kg CO₂ saved",
    timestamp: "2 minutes ago",
    reduction: "30%"
  },
  {
    id: "4",
    type: "document",
    title: "Document archiving scheduled",
    emissions: "0.3 kg CO₂ saved",
    timestamp: "2 minutes ago",
    reduction: "12%"
  }
];

const getIcon = (type: Activity["type"]) => {
  const iconClass = "h-5 w-5";
  switch (type) {
    case "email": return <Mail className={iconClass} />;
    case "cloud": return <Cloud className={iconClass} />;
    case "video": return <Video className={iconClass} />;
    case "document": return <FileText className={iconClass} />;
  }
};

export const ActivityFeed = () => {
  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Recent Activity</h3>
        <p className="text-sm text-muted-foreground">
          AI-automated carbon reduction actions
        </p>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {getIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium mb-1">{activity.title}</p>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-success font-medium">{activity.emissions}</span>
                {activity.reduction && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <TrendingDown className="h-3 w-3" />
                    {activity.reduction}
                  </span>
                )}
              </div>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {activity.timestamp}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};
