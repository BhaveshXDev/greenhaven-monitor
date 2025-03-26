
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import SensorCard from "@/components/SensorCard";
import DeviceCard from "@/components/DeviceCard";
import ChartCard from "@/components/ChartCard";
import { api } from "@/lib/api";
import { SensorData, Device } from "@/lib/mock-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSensor, setSelectedSensor] = useState<SensorData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [sensorData, deviceData] = await Promise.all([
          api.getSensorData(),
          api.getDevices(),
        ]);
        
        setSensorData(sensorData);
        setDevices(deviceData);
        
        if (sensorData.length > 0) {
          setSelectedSensor(sensorData[0]);
        }
      } catch (error) {
        toast.error("Failed to load dashboard data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Poll for new sensor data every 30 seconds
    const interval = setInterval(async () => {
      try {
        const newSensorData = await api.getSensorData();
        setSensorData(newSensorData);
      } catch (error) {
        console.error("Failed to refresh sensor data:", error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleDeviceStatusChange = (deviceId: string, status: Device["status"]) => {
    setDevices(prev => 
      prev.map(device => 
        device.id === deviceId 
          ? { ...device, status, lastActive: new Date().toISOString() } 
          : device
      )
    );
  };

  const getSystemStatus = () => {
    if (sensorData.some(sensor => sensor.status === "critical")) {
      return { label: "Critical", color: "text-rose-500" };
    }
    if (sensorData.some(sensor => sensor.status === "warning")) {
      return { label: "Warning", color: "text-amber-500" };
    }
    if (devices.some(device => device.status === "offline")) {
      return { label: "Warning", color: "text-amber-500" };
    }
    return { label: "Optimal", color: "text-emerald-500" };
  };

  const systemStatus = getSystemStatus();

  const handleSensorClick = (sensor: SensorData) => {
    setSelectedSensor(sensor);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light">Dashboard</h1>
          <p className="text-muted-foreground">
            Greenhouse monitoring and control
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">System Status:</span>
          <Badge variant="outline" className={cn("capitalize", systemStatus.color)}>
            {systemStatus.label}
          </Badge>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className="h-36 rounded-xl bg-muted/50 animate-pulse-subtle" 
            />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sensorData.map((sensor) => (
              <SensorCard
                key={sensor.id}
                sensor={sensor}
                className={cn(
                  "cursor-pointer hover:border-primary/20 transition-all duration-200",
                  selectedSensor?.id === sensor.id && "border-primary/40"
                )}
                onClick={() => handleSensorClick(sensor)}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {selectedSensor && (
              <ChartCard
                sensor={selectedSensor}
                className="lg:col-span-2"
              />
            )}
            
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="font-medium">Devices</h3>
                <div className="space-y-2">
                  {devices.map((device) => (
                    <DeviceCard
                      key={device.id}
                      device={device}
                      onStatusChange={handleDeviceStatusChange}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
