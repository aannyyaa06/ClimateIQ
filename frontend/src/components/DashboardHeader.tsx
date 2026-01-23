import React, { useEffect, useState } from "react";
import { Leaf, Award, TrendingDown, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: string;
  trendPositive?: boolean;
}

const StatCard = ({
  icon,
  label,
  value,
  trend,
  trendPositive,
}: StatCardProps) => (
  <Card className="p-6 transition-all duration-300 hover:shadow-glow border-border/50 bg-card/80 backdrop-blur-sm">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm text-muted-foreground mb-2">{label}</p>
        <p className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          {value}
        </p>
        {trend && (
          <p
            className={`text-sm mt-2 flex items-center gap-1 ${
              trendPositive ? "text-success" : "text-destructive"
            }`}
          >
            <TrendingDown
              className={`h-4 w-4 ${trendPositive ? "" : "rotate-180"}`}
            />
            {trend}
          </p>
        )}
      </div>
      <div className="p-3 rounded-xl bg-primary/10">{icon}</div>
    </div>
  </Card>
);

export const DashboardHeader = () => {
  const [carbonFootprint, setCarbonFootprint] = useState("Loading...");
  const [co2Offset, setCo2Offset] = useState("Loading...");
  const [actionsAutomated, setActionsAutomated] = useState("847"); // static as before
  const [greenPoints, setGreenPoints] = useState("12,450"); // static as before

  useEffect(() => {
    async function fetchCarbonData() {
      try {
        const totalResp = await fetch("http://127.0.0.1:5000/api/total_co2");
        const totalData = await totalResp.json();
        setCarbonFootprint(`${totalData.total.toFixed(2)} tons`);

        const chartResp = await fetch("http://127.0.0.1:5000/api/carbonchart");
        const chartData = await chartResp.json();
        const totalOffset = chartData.reduce(
          (acc: number, cur: any) => acc + cur.offset,
          0
        );
        setCo2Offset(`${totalOffset.toFixed(2)} tons`);
      } catch {
        setCarbonFootprint("N/A");
        setCo2Offset("N/A");
      }
    }
    fetchCarbonData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Welcome to CarbonScope
          </h1>
          <p className="text-lg text-muted-foreground">
            Track, reduce, and verify your carbon footprint with AI-powered
            insights
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30">
          <Award className="h-5 w-5 text-accent" />
          <span className="font-semibold text-accent-foreground">
            Level 3 - Automation Master
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Leaf className="h-6 w-6 text-primary" />}
          label="Carbon Footprint (Monthly)"
          value={carbonFootprint}
          trend="12% reduction"
          trendPositive={true}
        />
        <StatCard
          icon={<Zap className="h-6 w-6 text-accent" />}
          label="Actions Automated"
          value={actionsAutomated}
          trend="23% increase"
          trendPositive={true}
        />
        <StatCard
          icon={<Award className="h-6 w-6 text-secondary" />}
          label="Green Points"
          value={greenPoints}
          trend="+1,200 this week"
          trendPositive={true}
        />
        <StatCard
          icon={<TrendingDown className="h-6 w-6 text-success" />}
          label="CO₂ Offset"
          value={co2Offset}
          trend="Lifetime total"
          trendPositive={true}
        />
      </div>
    </div>
  );
};





