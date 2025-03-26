
import { Outlet, NavLink } from "react-router-dom";
import { Home, Wind, Sprout, Cloud, Settings, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const Layout = () => {
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { to: "/", icon: <Home className="h-5 w-5" />, label: "Dashboard" },
    { to: "/ventilation", icon: <Wind className="h-5 w-5" />, label: "Ventilation" },
    { to: "/crops", icon: <Sprout className="h-5 w-5" />, label: "Crops" },
    { to: "/weather", icon: <Cloud className="h-5 w-5" />, label: "Weather" },
    { to: "/settings", icon: <Settings className="h-5 w-5" />, label: "Settings" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top navigation bar (mobile) */}
      <header className="md:hidden border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-lg">GreenHaven</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Side navigation (desktop) */}
        <aside className="hidden md:flex flex-col w-64 p-4 border-r border-border">
          <div className="py-4 mb-6">
            <h1 className="text-xl font-semibold tracking-tight">GreenHaven</h1>
            <p className="text-muted-foreground text-sm">Smart Ventilation System</p>
          </div>

          <nav className="space-y-1 flex-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "nav-link flex items-center gap-3 w-full",
                    isActive ? "nav-link active" : ""
                  )
                }
                end={item.to === "/"}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="pt-4 border-t border-border mt-auto">
            {mounted && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </Button>
            )}
          </div>
        </aside>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-background animate-fade-in">
            <div className="flex flex-col h-full p-4">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-semibold">Menu</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="space-y-4 flex-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 p-3 rounded-md transition-colors",
                        isActive ? "bg-accent/10 text-accent" : "hover:bg-muted/50"
                      )
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                    end={item.to === "/"}
                  >
                    {item.icon}
                    <span className="text-lg">{item.label}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="pt-4 border-t border-border">
                {mounted && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  >
                    {theme === "light" ? "Dark Mode" : "Light Mode"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 h-full overflow-y-auto">
          <div className="container mx-auto p-4 md:p-6 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
