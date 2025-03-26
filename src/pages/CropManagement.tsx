import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crop } from "@/lib/mock-data";
import { firebaseApi } from "@/lib/firebase-api";
import { toast } from "sonner";
import CropCard from "@/components/CropCard";
import { Thermometer, Droplets, Calendar, MapPin, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const CropManagement = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchCrops = async () => {
      setIsLoading(true);
      try {
        const data = await firebaseApi.getCrops();
        setCrops(data);
      } catch (error) {
        toast.error("Failed to load crop data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCrops();
  }, []);

  const openCropDetails = async (cropId: string) => {
    try {
      const crop = await firebaseApi.getCropById(cropId);
      setSelectedCrop(crop);
      setIsDialogOpen(true);
    } catch (error) {
      toast.error("Failed to load crop details");
    }
  };

  const calculateGrowthProgress = (crop: Crop) => {
    if (crop.status === "harvested") return 100;
    
    const plantedDate = new Date(crop.plantedDate);
    const harvestDate = new Date(crop.harvestDate);
    const today = new Date();
    
    if (today > harvestDate) return 100;
    
    const totalDays = (harvestDate.getTime() - plantedDate.getTime()) / (1000 * 60 * 60 * 24);
    const daysElapsed = (today.getTime() - plantedDate.getTime()) / (1000 * 60 * 60 * 24);
    
    return Math.min(100, Math.max(0, Math.round((daysElapsed / totalDays) * 100)));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-light">Crop Management</h1>
        <p className="text-muted-foreground">
          Monitor and manage your greenhouse crops
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i} 
              className="h-64 rounded-xl bg-muted/50 animate-pulse-subtle" 
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops.map((crop) => (
            <CropCard
              key={crop.id}
              crop={crop}
              onClick={() => openCropDetails(crop.id)}
            />
          ))}
        </div>
      )}

      {selectedCrop && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
            <div className="relative h-48 w-full">
              <img 
                src={selectedCrop.image} 
                alt={selectedCrop.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-4 left-6">
                <h2 className="text-2xl font-medium text-white">{selectedCrop.name}</h2>
                <p className="text-white/80">{selectedCrop.variety}</p>
              </div>
              <Badge 
                variant="outline" 
                className={cn(
                  "absolute top-4 right-4 capitalize",
                  selectedCrop.status === "growing" ? "bg-emerald-500/20 text-emerald-100 border-emerald-500/30" :
                  selectedCrop.status === "harvested" ? "bg-amber-500/20 text-amber-100 border-amber-500/30" :
                  "bg-rose-500/20 text-rose-100 border-rose-500/30"
                )}
              >
                {selectedCrop.status}
              </Badge>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Planted: {new Date(selectedCrop.plantedDate).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Harvest: {new Date(selectedCrop.harvestDate).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedCrop.location}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Growth Progress</span>
                  <span>{calculateGrowthProgress(selectedCrop)}%</span>
                </div>
                <Progress value={calculateGrowthProgress(selectedCrop)} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer className="h-4 w-4 text-rose-500" />
                      <span className="text-sm font-medium">Optimal Temperature</span>
                    </div>
                    <p className="text-sm">
                      {selectedCrop.optimalTemp.min}°C - {selectedCrop.optimalTemp.max}°C
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Optimal Humidity</span>
                    </div>
                    <p className="text-sm">
                      {selectedCrop.optimalHumidity.min}% - {selectedCrop.optimalHumidity.max}%
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {selectedCrop.notes && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Notes</h3>
                  <p className="text-sm text-muted-foreground">{selectedCrop.notes}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CropManagement;
