
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center max-w-md animate-fade-in">
        <h1 className="text-6xl font-light mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          The page you're looking for can't be found
        </p>
        <div className="space-y-2">
          <Button 
            onClick={() => navigate("/")}
            className="w-full"
          >
            Return to Dashboard
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
