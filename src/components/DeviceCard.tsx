
import { Device } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Fan, Cpu, Power } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface DeviceCardProps {
  device: Device;
  onStatusChange?: (deviceId: string, status: Device["status"]) => void;
  className?: string;
}

const DeviceCard = ({ device, onStatusChange, className }: DeviceCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(device.status);
  
  const getIcon = () => {
    switch (device.type) {
      case "fan":
        return <Fan className="h-5 w-5" />;
      case "sensor":
        return <Cpu className="h-5 w-5" />;
      default:
        return null;
    }
  };
  
  const getStatusColor = (status: Device["status"]) => {
    switch (status) {
      case "online":
        return "text-emerald-700 border-emerald-200 bg-emerald-50";
      case "offline":
        return "text-slate-700 border-slate-200 bg-slate-50";
      case "maintenance":
        return "text-amber-700 border-amber-200 bg-amber-50";
      default:
        return "";
    }
  };
  
  const toggleDeviceStatus = async () => {
    setIsLoading(true);
    try {
      const newStatus = currentStatus === "online" ? "offline" : "online";
      await api.updateDeviceStatus(device.id, newStatus);
      setCurrentStatus(newStatus);
      if (onStatusChange) {
        onStatusChange(device.id, newStatus);
      }
      toast.success(`${device.name} is now ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update device status");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className={cn("border overflow-hidden", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-muted rounded-md p-2">
              {getIcon()}
            </div>
            <div>
              <h3 className="font-medium text-sm">{device.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge 
                  variant="outline" 
                  className={cn(
                    "capitalize px-2 py-0 h-5 text-[10px] font-semibold",
                    getStatusColor(currentStatus)
                  )}
                >
                  {currentStatus}
                </Badge>
                {device.batteryLevel && (
                  <span className="text-xs text-muted-foreground">
                    {device.batteryLevel}% battery
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <Button 
            size="sm" 
            variant={currentStatus === "online" ? "default" : "outline"}
            className="h-8 w-8 p-0 rounded-full"
            onClick={toggleDeviceStatus}
            disabled={isLoading}
          >
            <Power className={cn(
              "h-4 w-4",
              currentStatus === "online" ? "" : "text-muted-foreground"
            )} />
            <span className="sr-only">
              {currentStatus === "online" ? "Turn off" : "Turn on"}
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceCard;
