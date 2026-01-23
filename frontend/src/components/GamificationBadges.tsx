import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Trophy, Star, Target, Zap, Leaf } from "lucide-react";

interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  progress?: number;
}

const badges: BadgeItem[] = [
  {
    id: "1",
    name: "First Step",
    description: "Complete your first carbon reduction action",
    icon: <Leaf className="h-6 w-6" />,
    earned: true
  },
  {
    id: "2",
    name: "Week Warrior",
    description: "7 consecutive days of reduced emissions",
    icon: <Target className="h-6 w-6" />,
    earned: true
  },
  {
    id: "3",
    name: "Automation Master",
    description: "Enable 10 automated reduction workflows",
    icon: <Zap className="h-6 w-6" />,
    earned: true,
    progress: 100
  },
  {
    id: "4",
    name: "Carbon Champion",
    description: "Offset 5 tons of carbon emissions",
    icon: <Trophy className="h-6 w-6" />,
    earned: false,
    progress: 75
  },
  {
    id: "5",
    name: "Community Leader",
    description: "Support 3 restoration projects",
    icon: <Star className="h-6 w-6" />,
    earned: false,
    progress: 33
  },
  {
    id: "6",
    name: "Elite Guardian",
    description: "Reach Level 10 and mentor others",
    icon: <Award className="h-6 w-6" />,
    earned: false,
    progress: 20
  }
];

export const GamificationBadges = () => {
  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Achievements</h3>
        <p className="text-sm text-muted-foreground">
          Unlock badges and track your climate impact journey
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`p-4 rounded-lg border transition-all ${
              badge.earned 
                ? 'border-primary/50 bg-primary/5 hover:shadow-glow' 
                : 'border-border/50 bg-muted/20 opacity-60 hover:opacity-100'
            }`}
          >
            <div className={`p-3 rounded-full mb-3 mx-auto w-fit ${
              badge.earned ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
            }`}>
              {badge.icon}
            </div>
            <h4 className="text-sm font-semibold text-center mb-1">{badge.name}</h4>
            <p className="text-xs text-muted-foreground text-center mb-2">{badge.description}</p>
            
            {!badge.earned && badge.progress !== undefined && (
              <div className="mt-3">
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-primary transition-all duration-500"
                    style={{ width: `${badge.progress}%` }}
                  />
                </div>
                <p className="text-xs text-center mt-1 text-muted-foreground">{badge.progress}%</p>
              </div>
            )}
            
            {badge.earned && (
              <Badge className="w-full justify-center bg-primary text-primary-foreground mt-2">
                Earned
              </Badge>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
