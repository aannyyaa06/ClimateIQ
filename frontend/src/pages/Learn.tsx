import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@headlessui/react";
import { BookOpen, PlayCircle, Award, Clock, X } from "lucide-react";

const courses = [
  {
    id: "1",
    title: "Understanding Digital Carbon Footprint",
    description: "Learn how your digital activities contribute to carbon emissions",
    duration: "10 min",
    level: "Beginner",
    badge: "Climate Basics",
    video: "https://www.youtube.com/embed/u5h7AyRLQPA",
  },
  {
    id: "2",
    title: "Blue Carbon Ecosystems Explained",
    description: "Explore mangroves, seagrass, and coastal wetlands",
    duration: "7 min",
    level: "Intermediate",
    badge: "Ocean Guardian",
    video: "https://www.youtube.com/embed/fox4a9ipYFI",
  },
  {
    id: "3",
    title: "Carbon Credit Verification Process",
    description: "How blockchain ensures transparency in carbon markets",
    duration: "5 min",
    level: "Advanced",
    badge: "Verification Expert",
    video: "https://www.youtube.com/embed/di1tZq3jUBA",
  },
  {
    id: "4",
    title: "AI-Powered Emission Reduction",
    description: "Automate your carbon reduction with AI workflows",
    duration: "4 min",
    level: "Intermediate",
    badge: "Automation Pro",
    video: "https://www.youtube.com/embed/SkWzwoDIGmE",
  },
  {
    id: "5",
    title: "Community-Led Restoration",
    description: "Best practices for local climate action projects",
    duration: "6 min",
    level: "Advanced",
    badge: "Community Leader",
    video: "https://www.youtube.com/embed/vYJQyAwzGt0",
  },
  {
    id: "6",
    title: "ESG Reporting Standards",
    description: "Navigate CSRD, ISO 14064, and global frameworks",
    duration: "5 min",
    level: "Advanced",
    badge: "Policy Navigator",
    video: "https://www.youtube.com/embed/OT3gsCbCKdI",
  },
];

const getLevelColor = (level) => {
  switch (level) {
    case "Beginner": return "bg-success text-success-foreground";
    case "Intermediate": return "bg-warning text-warning-foreground";
    case "Advanced": return "bg-destructive text-destructive-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

const Learn = () => {
  const [open, setOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-earth">
      <Navigation />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Climate Learning Hub
          </h1>
          <p className="text-lg text-muted-foreground">
            Expand your knowledge and earn badges through interactive courses
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
            <BookOpen className="h-8 w-8 text-primary mb-3" />
            <p className="text-sm text-muted-foreground mb-1">Courses Available</p>
            <p className="text-2xl font-bold">6</p>
          </Card>
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
            <Award className="h-8 w-8 text-accent mb-3" />
            <p className="text-sm text-muted-foreground mb-1">Badges Earned</p>
            <p className="text-2xl font-bold">3/12</p>
          </Card>
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
            <Clock className="h-8 w-8 text-secondary mb-3" />
            <p className="text-sm text-muted-foreground mb-1">Learning Time</p>
            <p className="text-2xl font-bold">~37 mins</p>
          </Card>
        </div>

        {/* Course cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="p-6 bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-medium transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {course.duration}
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{course.description}</p>

              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-accent" />
                  <span className="text-sm text-muted-foreground">{course.badge}</span>
                </div>
                <Button
                  size="sm"
                  className="gap-2"
                  onClick={() => {
                    setSelectedCourse(course);
                    setOpen(true);
                  }}
                >
                  <PlayCircle className="h-4 w-4" />
                  Start
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Video modal */}
        <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-card rounded-xl shadow-lg overflow-hidden max-w-4xl w-full">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold">{selectedCourse?.title}</h2>
                <button onClick={() => setOpen(false)}>
                  <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
              {selectedCourse && (
                <iframe
                  className="w-full aspect-video"
                  src={selectedCourse.video}
                  title={selectedCourse.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </Dialog.Panel>
          </div>
        </Dialog>
      </main>
    </div>
  );
};

export default Learn;
