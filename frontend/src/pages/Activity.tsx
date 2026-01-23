import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingDown, Mail, Cloud, Video, FileText } from "lucide-react";
import { ActivityFeed } from "@/components/ActivityFeed";

interface ActivityStat {
  label: string;
  icon: React.ReactNode;
  count: number;
  savings: string;
}

interface CategoryStat {
  name: string;
  value: number;
  icon: React.ReactNode;
}

const Activity = () => {
  const [dailyStats, setDailyStats] = useState<ActivityStat[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivityData() {
      try {
        // Fetch daily breakdown (emails sent, cloud storage actions, video hours)
        const dailyResp = await fetch("http://127.0.0.1:5000/api/daily_breakdown");
        const dailyData = await dailyResp.json();

        // Transform daily data into ActivityStat for cards
        const activityStats: ActivityStat[] = [
          {
            label: "Emails Sent",
            icon: <Mail className="h-4 w-4" />,
            count: dailyData.emails_sent,
            savings: "~" + (dailyData.emails_sent * 0.04).toFixed(1) + " kg CO₂",
          },
          {
            label: "Cloud Storage Actions",
            icon: <Cloud className="h-4 w-4" />,
            count: Math.round(dailyData.cloud_storage),
            savings: "~" + (dailyData.cloud_storage * 0.1).toFixed(1) + " kg CO₂",
          },
          {
            label: "Video Streaming Hours",
            icon: <Video className="h-4 w-4" />,
            count: Math.round(dailyData.video_hours),
            savings: "~" + (dailyData.video_hours * 0.05).toFixed(1) + " kg CO₂",
          },
        ];
        setDailyStats(activityStats);

        // Fetch category data (Email, Online Storage, Video Streaming)
        const categoryResp = await fetch("http://127.0.0.1:5000/api/category/pie");
        const categoryData = await categoryResp.json();
        // Map category data to icons and structure
        const categoryStats: CategoryStat[] = categoryData.map((cat: any) => {
          let icon = <FileText className="h-5 w-5 text-success" />;
          if (cat.name.toLowerCase().includes("email")) icon = <Mail className="h-5 w-5 text-primary" />;
          else if (cat.name.toLowerCase().includes("storage")) icon = <Cloud className="h-5 w-5 text-secondary" />;
          else if (cat.name.toLowerCase().includes("video")) icon = <Video className="h-5 w-5 text-accent" />;
          return { name: cat.name, value: cat.value, icon };
        });
        setCategoryStats(categoryStats);
      } catch (error) {
        console.error("Error fetching activity ", error);
      } finally {
        setLoading(false);
      }
    }

    fetchActivityData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-earth">
      <Navigation />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Activity Timeline
          </h1>
          <p className="text-lg text-muted-foreground">
            Track all your carbon reduction activities and automated workflows
          </p>
        </div>

        {/* Activity stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array(3).fill(null).map((_, idx) => (
                <Card key={idx} className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
                  <div className="h-20 animate-pulse bg-muted rounded" />
                </Card>
              ))
            : dailyStats.map((stat) => (
                <Card key={stat.label} className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    {stat.icon}
                    <span className="text-sm">{stat.label}</span>
                  </div>
                  <p className="text-2xl font-bold mb-1">{stat.count}</p>
                  <p className="text-sm text-success flex items-center gap-1">
                    <TrendingDown className="h-4 w-4" />
                    {stat.savings}
                  </p>
                </Card>
              ))}
        </div>

        {/* Activity feed and category breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivityFeed />
          </div>

          {/* Category breakdown card */}
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
            <h3 className="text-xl font-semibold mb-4">Activity Breakdown</h3>
            <div className="space-y-4">
              {loading
                ? Array(4).fill(null).map((_, idx) => (
                    <div key={idx} className="h-10 bg-muted rounded animate-pulse" />
                  ))
                : categoryStats.map((cat) => (
                    <div
                      key={cat.name}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                    >
                      <div className="flex items-center gap-3">
                        {cat.icon}
                        <span>{cat.name}</span>
                      </div>
                      <Badge>{cat.value} actions</Badge>
                    </div>
                  ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Activity;








// import { Navigation } from "@/components/Navigation";
// import { Card } from "@/components/ui/card";
// import { ActivityFeed } from "@/components/ActivityFeed";
// import { Badge } from "@/components/ui/badge";
// import { Calendar, TrendingDown, Mail, Cloud, Video, FileText } from "lucide-react";

// const activityData = [
//   { date: "Today", count: 8, savings: "3.2 kg CO₂" },
//   { date: "Yesterday", count: 12, savings: "4.8 kg CO₂" },
//   { date: "This Week", count: 47, savings: "18.5 kg CO₂" },
//   { date: "This Month", count: 203, savings: "78.3 kg CO₂" },
// ];

// const Activity = () => {
//   return (
//     <div className="min-h-screen bg-gradient-earth">
//       <Navigation />
      
//       <main className="container mx-auto px-4 py-8 space-y-8">
//         <div>
//           <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
//             Activity Timeline
//           </h1>
//           <p className="text-lg text-muted-foreground">
//             Track all your carbon reduction activities and automated workflows
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {activityData.map((stat) => (
//             <Card key={stat.date} className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
//               <div className="flex items-center gap-2 mb-2 text-muted-foreground">
//                 <Calendar className="h-4 w-4" />
//                 <span className="text-sm">{stat.date}</span>
//               </div>
//               <p className="text-2xl font-bold mb-1">{stat.count} actions</p>
//               <p className="text-sm text-success flex items-center gap-1">
//                 <TrendingDown className="h-4 w-4" />
//                 {stat.savings}
//               </p>
//             </Card>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2">
//             <ActivityFeed />
//           </div>
          
//           <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
//             <h3 className="text-xl font-semibold mb-4">Activity Breakdown</h3>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
//                 <div className="flex items-center gap-3">
//                   <Mail className="h-5 w-5 text-primary" />
//                   <span>Email Optimization</span>
//                 </div>
//                 <Badge>89 actions</Badge>
//               </div>
//               <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
//                 <div className="flex items-center gap-3">
//                   <Cloud className="h-5 w-5 text-secondary" />
//                   <span>Cloud Storage</span>
//                 </div>
//                 <Badge>64 actions</Badge>
//               </div>
//               <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
//                 <div className="flex items-center gap-3">
//                   <Video className="h-5 w-5 text-accent" />
//                   <span>Video Streaming</span>
//                 </div>
//                 <Badge>38 actions</Badge>
//               </div>
//               <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
//                 <div className="flex items-center gap-3">
//                   <FileText className="h-5 w-5 text-success" />
//                   <span>Document Management</span>
//                 </div>
//                 <Badge>12 actions</Badge>
//               </div>
//             </div>
//           </Card>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Activity;
