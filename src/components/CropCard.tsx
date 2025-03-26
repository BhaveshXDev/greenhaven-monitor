
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Crop } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock, MapPin, Info } from "lucide-react";

interface CropCardProps {
  crop: Crop;
  className?: string;
  onClick?: () => void;
}

const CropCard = ({ crop, className, onClick }: CropCardProps) => {
  const getStatusColor = (status: Crop["status"]) => {
    switch (status) {
      case "growing":
        return "text-emerald-700 border-emerald-200 bg-emerald-50";
      case "harvested":
        return "text-amber-700 border-amber-200 bg-amber-50";
      case "issue":
        return "text-rose-700 border-rose-200 bg-rose-50";
      default:
        return "";
    }
  };
  
  const getDaysRemaining = () => {
    const today = new Date();
    const harvestDate = new Date(crop.harvestDate);
    const diffTime = harvestDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  
  return (
    <Card 
      className={cn("overflow-hidden border transition-all duration-300 hover:shadow-lg", className)}
      onClick={onClick}
    >
      <div className="relative h-40 overflow-hidden">
        <img 
          src={crop.image} 
          alt={crop.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge 
            variant="outline" 
            className={cn(
              "capitalize",
              getStatusColor(crop.status)
            )}
          >
            {crop.status}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          {crop.name}
          <span className="text-xs font-normal text-muted-foreground">
            {crop.variety}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pb-4 space-y-2">
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5 mr-1.5" />
          <span>
            {crop.status === "growing" 
              ? `${getDaysRemaining()} days until harvest` 
              : `Harvested on ${new Date(crop.harvestDate).toLocaleDateString()}`}
          </span>
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 mr-1.5" />
          <span>{crop.location}</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-xs h-8"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          <Info className="h-3.5 w-3.5 mr-1" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CropCard;
