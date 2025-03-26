
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WeatherForecast } from "@/lib/mock-data";
import { Sun, Cloud, CloudRain, CloudLightning, Thermometer, Droplets, Wind } from "lucide-react";

interface WeatherCardProps {
  data: WeatherForecast;
  className?: string;
}

const WeatherCard = ({ data, className }: WeatherCardProps) => {
  const date = new Date(data.date);
  const isToday = new Date().toDateString() === date.toDateString();
  
  const getWeatherIcon = () => {
    switch (data.condition) {
      case "sunny":
        return <Sun className="h-10 w-10 text-amber-500" />;
      case "cloudy":
        return <Cloud className="h-10 w-10 text-slate-500" />;
      case "rainy":
        return <CloudRain className="h-10 w-10 text-blue-500" />;
      case "stormy":
        return <CloudLightning className="h-10 w-10 text-purple-500" />;
      default:
        return <Sun className="h-10 w-10 text-amber-500" />;
    }
  };
  
  const formatDay = () => {
    if (isToday) return "Today";
    return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
  };
  
  return (
    <Card className={cn("bg-white/70 backdrop-blur shadow-subtle border", className)}>
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-sm font-medium">{formatDay()}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4">
        <div className="flex flex-col items-center justify-center gap-2">
          {getWeatherIcon()}
          <span className="text-xs capitalize">{data.condition}</span>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center text-sm font-medium">
              <Thermometer className="h-3.5 w-3.5 mr-1 text-rose-500" />
              <span>{data.temperature.max}°</span>
            </div>
            <span className="text-[10px] text-muted-foreground">High</span>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center text-sm font-medium">
              <Droplets className="h-3.5 w-3.5 mr-1 text-blue-500" />
              <span>{data.humidity}%</span>
            </div>
            <span className="text-[10px] text-muted-foreground">Humid</span>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center text-sm font-medium">
              <Wind className="h-3.5 w-3.5 mr-1 text-slate-500" />
              <span>{data.windSpeed}</span>
            </div>
            <span className="text-[10px] text-muted-foreground">km/h</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
