
import { SensorData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Thermometer, Droplets, Wind } from "lucide-react";

interface SensorCardProps {
  sensor: SensorData;
  className?: string;
  onClick?: (sensor: SensorData) => void;
}

const SensorCard = ({ sensor, className, onClick }: SensorCardProps) => {
  const percentage = Math.min(
    100,
    Math.max(0, ((sensor.value - sensor.min) / (sensor.max - sensor.min)) * 100)
  );

  const statusColors = {
    normal: "bg-emerald-500",
    warning: "bg-amber-500",
    critical: "bg-rose-500",
  };

  const getIcon = () => {
    switch (sensor.id.split("-")[0]) {
      case "temp":
        return <Thermometer className="h-5 w-5 text-rose-500" />;
      case "humidity":
        return <Droplets className="h-5 w-5 text-sky-500" />;
      case "co2":
        return (
          <svg
            className="h-5 w-5 text-emerald-500"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 15C8 16.6569 9.34315 18 11 18H13C14.6569 18 16 16.6569 16 15C16 13.3431 14.6569 12 13 12H11C9.34315 12 8 10.6569 8 9C8 7.34315 9.34315 6 11 6H13C14.6569 6 16 7.34315 16 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 3V6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 18V21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "airflow":
        return <Wind className="h-5 w-5 text-indigo-500" />;
      default:
        return null;
    }
  };

  const handleClick = () => {
    if (onClick) onClick(sensor);
  };

  return (
    <Card 
      className={cn("overflow-hidden", className)}
      onClick={handleClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getIcon()}
            <CardTitle className="text-base">{sensor.name}</CardTitle>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "capitalize px-2 py-0 h-5 text-[10px] font-semibold",
              sensor.status === "normal" && "text-emerald-700 border-emerald-200 bg-emerald-50",
              sensor.status === "warning" && "text-amber-700 border-amber-200 bg-amber-50",
              sensor.status === "critical" && "text-rose-700 border-rose-200 bg-rose-50"
            )}
          >
            {sensor.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-baseline">
              <span className="sensor-value">{sensor.value.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground ml-1">
                {sensor.unit}
              </span>
            </div>
            <div className="text-xs text-muted-foreground flex gap-1 items-center">
              <span>Range: {sensor.min} - {sensor.max}{sensor.unit}</span>
            </div>
          </div>

          <div className="space-y-1">
            <Progress value={percentage} className="h-1.5" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{sensor.min}{sensor.unit}</span>
              <span>{sensor.max}{sensor.unit}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SensorCard;
