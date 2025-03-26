
import { SensorData } from "@/lib/mock-data";

export interface SensorCardProps {
  sensor: SensorData;
  className?: string;
  onClick?: (sensor: SensorData) => void;
}
