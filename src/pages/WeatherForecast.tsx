
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { WeatherForecast as WeatherForecastType } from "@/lib/mock-data";
import { api } from "@/lib/api";
import { toast } from "sonner";
import WeatherCard from "@/components/WeatherCard";
import { AlertCircle, Cloud, Info, Wind, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

const WeatherForecast = () => {
  const [forecast, setForecast] = useState<WeatherForecastType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchForecast = async () => {
      setIsLoading(true);
      try {
        const data = await api.getWeatherForecast();
        setForecast(data);
      } catch (error) {
        toast.error("Failed to load weather forecast");
      } finally {
        setIsLoading(false);
      }
    };

    fetchForecast();
  }, []);

  const getVentilationAdvice = () => {
    const today = forecast[0];
    
    if (!today) return null;
    
    if (today.condition === "stormy") {
      return {
        title: "Storm Alert",
        description: "Close all vents and secure greenhouse. High winds expected.",
        icon: <AlertCircle className="h-5 w-5 text-rose-500" />,
        color: "border-rose-200 bg-rose-50",
      };
    }
    
    if (today.condition === "rainy" && today.windSpeed > 10) {
      return {
        title: "Rain & Wind Alert",
        description: "Reduce vent openings to 30%. Monitor humidity levels.",
        icon: <Cloud className="h-5 w-5 text-amber-500" />,
        color: "border-amber-200 bg-amber-50",
      };
    }
    
    if (today.temperature.max > 26) {
      return {
        title: "High Temperature Alert",
        description: "Increase ventilation to maximum during peak hours (10AM-3PM).",
        icon: <Wind className="h-5 w-5 text-emerald-500" />,
        color: "border-emerald-200 bg-emerald-50",
      };
    }
    
    return {
      title: "Optimal Conditions",
      description: "Standard ventilation settings recommended. No weather concerns.",
      icon: <Leaf className="h-5 w-5 text-emerald-500" />,
      color: "border-emerald-200 bg-emerald-50",
    };
  };

  const ventilationAdvice = getVentilationAdvice();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-light">Weather Forecast</h1>
        <p className="text-muted-foreground">
          5-day forecast and ventilation recommendations
        </p>
      </div>

      {isLoading ? (
        <div className="h-40 rounded-xl bg-muted/50 animate-pulse-subtle" />
      ) : (
        <>
          {ventilationAdvice && (
            <Alert className={cn("border", ventilationAdvice.color)}>
              <div className="flex items-start">
                {ventilationAdvice.icon}
                <div className="ml-2">
                  <h3 className="font-medium">{ventilationAdvice.title}</h3>
                  <AlertDescription>
                    {ventilationAdvice.description}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {forecast.map((day, index) => (
              <WeatherCard key={index} data={day} />
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Weather Impact Analysis
              </CardTitle>
              <CardDescription>
                How weather conditions affect your greenhouse
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Temperature Trends</h3>
                <p className="text-sm text-muted-foreground">
                  Average temperature for the upcoming week is {
                    Math.round(
                      forecast.reduce((sum, day) => sum + (day.temperature.min + day.temperature.max) / 2, 0) / 
                      forecast.length
                    )
                  }°C. {
                    forecast.some(day => day.temperature.max > 25) 
                      ? "High temperatures may require increased ventilation during peak hours."
                      : "Temperatures remain in the optimal range for most crops."
                  }
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Humidity & Precipitation</h3>
                <p className="text-sm text-muted-foreground">
                  {
                    forecast.some(day => day.condition === "rainy" || day.condition === "stormy")
                      ? "Rainy conditions expected. Monitor greenhouse humidity to prevent excess moisture and potential fungal issues."
                      : "Dry conditions expected. Ensure adequate irrigation and monitor humidity levels."
                  }
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Wind Considerations</h3>
                <p className="text-sm text-muted-foreground">
                  {
                    forecast.some(day => day.windSpeed > 15)
                      ? "High winds expected. Secure greenhouse structures and reduce vent openings when winds exceed 15 km/h."
                      : "Wind speeds remain moderate. Standard ventilation protocols are appropriate."
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default WeatherForecast;
