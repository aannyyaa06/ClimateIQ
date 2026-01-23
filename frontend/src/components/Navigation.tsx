import { Button } from "@/components/ui/button";
import { LayoutDashboard, Activity, Leaf, ShoppingBag, BookOpen, Settings, Menu } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard", path: "/" },
    { icon: <Activity className="h-5 w-5" />, label: "Activity", path: "/activity" },
    { icon: <Leaf className="h-5 w-5" />, label: "Projects", path: "/projects" },
    { icon: <ShoppingBag className="h-5 w-5" />, label: "Marketplace", path: "/marketplace" },
    { icon: <BookOpen className="h-5 w-5" />, label: "Learn", path: "/learn" },
    { icon: <Settings className="h-5 w-5" />, label: "Settings", path: "/settings" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                CarbonScope
              </span>
            </div>

            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                  asChild
                >
                  <Link to={item.path}>
                    {item.icon}
                    {item.label}
                  </Link>
                </Button>
              ))}
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {isOpen && (
            <div className="md:hidden pb-4 space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start gap-2"
                  asChild
                  onClick={() => setIsOpen(false)}
                >
                  <Link to={item.path}>
                    {item.icon}
                    {item.label}
                  </Link>
                </Button>
              ))}
            </div>
          )}
        </div>
      </nav>
    </>
  );
};
