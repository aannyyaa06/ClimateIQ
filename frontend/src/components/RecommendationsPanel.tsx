import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, ChevronRight, Sparkles } from "lucide-react";
import { toast } from "sonner";


interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: string;
  difficulty: string;
  enabled?: boolean;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "text-success";
    case "medium":
      return "text-warning";
    case "hard":
      return "text-destructive";
    default:
      return "text-muted-foreground";
  }
};



const featureDetails: Record<string, Omit<Recommendation, "id" | "enabled">> = {
  "Email": {
    title: "Enable Smart Email Scheduling",
    description: "Automatically batch non-urgent emails to reduce server load",
    impact: "~2.5 kg CO₂/month",
    difficulty: "easy",
  },
  "Online Storage": {
    title: "Archive Old Cloud Files",
    description: "Move inactive files to cold storage automatically",
    impact: "~3.8 kg CO₂/month",
    difficulty: "medium",
  },
  "Video Streaming": {
    title: "Optimize Video Streaming Quality",
    description: "AI adjusts video quality based on your network and device",
    impact: "~4.2 kg CO₂/month",
    difficulty: "easy",
  }
};


export const RecommendationsPanel = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [executing, setExecuting] = useState(false);

  // Fetch recommendation-like data from your backend (example /api/category/pie)
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/category/pie");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const recs = data.map((item: any, idx: number) => {
        const details = featureDetails[item.name];

        return {
          id: `${idx}`,
          title: details ? details.title : item.name,
          description: details ? details.description : `Current value: ${item.value}`,
          impact: details ? details.impact : `Estimated impact for ${item.name}`,
          difficulty: details ? details.difficulty : "medium",
          enabled: false,
        };
      });
        setRecommendations(recs);
        toast.success("AI Recommendations loaded successfully!");
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        toast.error("Backend connection failed");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  // Handle enabling a feature by calling /execute_plan
  const handleEnable = async (title: string, id: string) => {
    if (executing) return;
    setExecuting(true);
    toast.loading(`Enabling "${title}"...`);

    try {
      const res = await fetch("http://127.0.0.1:5000/execute_plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "enable_feature",
          target: title.toLowerCase().replace(/\s+/g, "_"),
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data.status === "done") {
        toast.success(`${title} enabled!`, {
          description: data.info || "Your AI-powered feature is now active.",
        });

        setRecommendations((prev) =>
          prev.map((rec) =>
            rec.id === id ? { ...rec, enabled: true } : rec
          )
        );
      } else {
        toast.error(`Failed to enable: ${data.info || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error enabling feature:", error);
      toast.error("Backend connection failed");
    } finally {
      toast.dismiss();
      setExecuting(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 text-center">
        <p className="text-sm text-muted-foreground">
          Loading AI recommendations...
        </p>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 text-center">
        <p className="text-sm text-muted-foreground">
          No recommendations available.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <h3 className="text-xl font-semibold">AI Recommendations</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Personalized suggestions powered by OpenAI to reduce your carbon footprint
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-all hover:shadow-soft bg-muted/20"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-accent/10">
                <Lightbulb className="h-5 w-5 text-accent" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold">{rec.title}</h4>
                  <span
                    className={`text-xs uppercase font-medium ${getDifficultyColor(
                      rec.difficulty
                    )}`}
                  >
                    {rec.difficulty}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  {rec.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">
                    Impact: {rec.impact}
                  </span>

                  <Button
                    size="sm"
                    className={`gap-1 ${
                      rec.enabled
                        ? "bg-green-600 hover:bg-green-700 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={rec.enabled}
                    onClick={() => handleEnable(rec.title, rec.id)}
                  >
                    {rec.enabled ? "Enabled" : "Enable"}
                    {!rec.enabled && (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};