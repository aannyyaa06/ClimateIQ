import { Navigation } from "@/components/Navigation";
import { RestorationProjects } from "@/components/RestorationProjects";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";

const Projects = () => {
  return (
    <div className="min-h-screen bg-gradient-earth">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
              Restoration Projects
            </h1>
            <p className="text-lg text-muted-foreground">
              Support verified ecological restoration initiatives worldwide
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Submit Project
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
            <p className="text-sm text-muted-foreground mb-2">Total Projects</p>
            <p className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              20
            </p>
          </Card>
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
            <p className="text-sm text-muted-foreground mb-2">Carbon Offset</p>
            <p className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              12,450 tons
            </p>
          </Card>
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
            <p className="text-sm text-muted-foreground mb-2">Communities Engaged</p>
            <p className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              89
            </p>
          </Card>
        </div>

        <RestorationProjects />
      </main>
    </div>
  );
};

export default Projects;
