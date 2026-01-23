import { Navigation } from "@/components/Navigation";
import { DashboardHeader } from "@/components/DashboardHeader";
import { CarbonChart } from "@/components/CarbonChart";
import { ActivityFeed } from "@/components/ActivityFeed";
import { RecommendationsPanel } from "@/components/RecommendationsPanel";
import { RestorationProjects } from "@/components/RestorationProjects";
import { GamificationBadges } from "@/components/GamificationBadges";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-earth">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <DashboardHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CarbonChart />
          </div>
          <div>
            <ActivityFeed />
          </div>
        </div>

        <RecommendationsPanel />
        
        <RestorationProjects />
        
        <GamificationBadges />
      </main>
    </div>
  );
};

export default Index;
