
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Wind, Droplets, Thermometer, Zap, Timer, CloudRain } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const modes = [
  { id: "auto", name: "Automatic", description: "Automatically adjust based on conditions", icon: <Wind className="h-5 w-5" /> },
  { id: "schedule", name: "Scheduled", description: "Run on a preset schedule", icon: <Timer className="h-5 w-5" /> },
  { id: "manual", name: "Manual", description: "Set fan speeds manually", icon: <Zap className="h-5 w-5" /> },
  { id: "weather", name: "Weather-based", description: "Adjust according to forecast", icon: <CloudRain className="h-5 w-5" /> },
];

const VentilationControl = () => {
  const [selectedMode, setSelectedMode] = useState("auto");
  const [fanSpeeds, setFanSpeeds] = useState({
    "fan-1": 60,
    "fan-2": 40,
  });
  const [autoSettings, setAutoSettings] = useState({
    tempThreshold: 25,
    humidityThreshold: 70,
    nightModeEnabled: true,
    energySaving: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleFanSpeedChange = async (fanId: string, value: number) => {
    setFanSpeeds(prev => ({ ...prev, [fanId]: value }));
    
    // Only call API when in manual mode to avoid excessive API calls while dragging
    if (selectedMode === "manual") {
      try {
        await api.setFanSpeed(fanId, value);
      } catch (error) {
        console.error("Failed to set fan speed:", error);
      }
    }
  };

  const applySettings = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls
      await Promise.all([
        api.setFanSpeed("fan-1", fanSpeeds["fan-1"]),
        api.setFanSpeed("fan-2", fanSpeeds["fan-2"]),
      ]);
      
      toast.success("Ventilation settings applied successfully");
    } catch (error) {
      toast.error("Failed to apply ventilation settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-light">Ventilation Control</h1>
        <p className="text-muted-foreground">
          Manage your greenhouse ventilation system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Control Mode</CardTitle>
              <CardDescription>
                Select how you want to control the ventilation system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {modes.map(mode => (
                  <Card 
                    key={mode.id}
                    className={cn(
                      "cursor-pointer transition-all duration-200 overflow-hidden",
                      selectedMode === mode.id ? "border-primary ring-1 ring-primary" : "hover:border-primary/20"
                    )}
                    onClick={() => setSelectedMode(mode.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-3">
                          <div className="p-2 rounded-full bg-muted">
                            {mode.icon}
                          </div>
                          {selectedMode === mode.id && (
                            <Badge variant="outline" className="bg-primary/10 border-primary/20 text-[10px]">
                              Active
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-medium text-sm">{mode.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {mode.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fan Control</CardTitle>
              <CardDescription>
                Adjust the speed of individual fans
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Wind className="h-4 w-4 mr-2 text-primary" />
                      <Label htmlFor="fan-1" className="text-sm font-medium">Main Ventilation Fan</Label>
                    </div>
                    <span className="text-sm font-medium">{fanSpeeds["fan-1"]}%</span>
                  </div>
                  <Slider
                    id="fan-1"
                    min={0}
                    max={100}
                    step={5}
                    value={[fanSpeeds["fan-1"]]}
                    onValueChange={(value) => handleFanSpeedChange("fan-1", value[0])}
                    disabled={selectedMode !== "manual"}
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Wind className="h-4 w-4 mr-2 text-primary" />
                      <Label htmlFor="fan-2" className="text-sm font-medium">Secondary Fan</Label>
                    </div>
                    <span className="text-sm font-medium">{fanSpeeds["fan-2"]}%</span>
                  </div>
                  <Slider
                    id="fan-2"
                    min={0}
                    max={100}
                    step={5}
                    value={[fanSpeeds["fan-2"]]}
                    onValueChange={(value) => handleFanSpeedChange("fan-2", value[0])}
                    disabled={selectedMode !== "manual"}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automatic Settings</CardTitle>
              <CardDescription>
                Configure thresholds for automatic ventilation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Thermometer className="h-4 w-4 mr-2 text-rose-500" />
                    <Label htmlFor="temp-threshold" className="text-sm">Temperature Threshold</Label>
                  </div>
                  <span className="text-sm">{autoSettings.tempThreshold}°C</span>
                </div>
                <Slider
                  id="temp-threshold"
                  min={15}
                  max={35}
                  step={1}
                  value={[autoSettings.tempThreshold]}
                  onValueChange={(value) => setAutoSettings(prev => ({ ...prev, tempThreshold: value[0] }))}
                  disabled={selectedMode !== "auto"}
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Droplets className="h-4 w-4 mr-2 text-blue-500" />
                    <Label htmlFor="humidity-threshold" className="text-sm">Humidity Threshold</Label>
                  </div>
                  <span className="text-sm">{autoSettings.humidityThreshold}%</span>
                </div>
                <Slider
                  id="humidity-threshold"
                  min={30}
                  max={90}
                  step={5}
                  value={[autoSettings.humidityThreshold]}
                  onValueChange={(value) => setAutoSettings(prev => ({ ...prev, humidityThreshold: value[0] }))}
                  disabled={selectedMode !== "auto"}
                />
              </div>
              
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="night-mode" className="text-sm">Night Mode</Label>
                  </div>
                  <Switch
                    id="night-mode"
                    checked={autoSettings.nightModeEnabled}
                    onCheckedChange={(checked) => setAutoSettings(prev => ({ ...prev, nightModeEnabled: checked }))}
                    disabled={selectedMode !== "auto"}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="energy-saving" className="text-sm">Energy Saving</Label>
                  </div>
                  <Switch
                    id="energy-saving"
                    checked={autoSettings.energySaving}
                    onCheckedChange={(checked) => setAutoSettings(prev => ({ ...prev, energySaving: checked }))}
                    disabled={selectedMode !== "auto"}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Button 
            className="w-full"
            onClick={applySettings}
            disabled={isLoading}
          >
            {isLoading ? "Applying Settings..." : "Apply Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VentilationControl;
