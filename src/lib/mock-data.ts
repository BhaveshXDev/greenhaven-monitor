
export interface SensorData {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: "normal" | "warning" | "critical";
  min: number;
  max: number;
  timestamp: string;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  status: "online" | "offline" | "maintenance";
  batteryLevel?: number;
  lastActive: string;
  location: string;
}

export interface Crop {
  id: string;
  name: string;
  variety: string;
  plantedDate: string;
  harvestDate: string;
  status: "growing" | "harvested" | "issue";
  optimalTemp: { min: number; max: number };
  optimalHumidity: { min: number; max: number };
  location: string;
  notes: string;
  image: string;
}

export interface WeatherForecast {
  date: string;
  condition: "sunny" | "cloudy" | "rainy" | "stormy";
  temperature: { min: number; max: number };
  humidity: number;
  windSpeed: number;
  precipitation: number;
}

export const mockSensorData: SensorData[] = [
  {
    id: "temp-1",
    name: "Temperature",
    value: 23.5,
    unit: "°C",
    status: "normal",
    min: 18,
    max: 28,
    timestamp: new Date().toISOString(),
  },
  {
    id: "humidity-1",
    name: "Humidity",
    value: 68,
    unit: "%",
    status: "normal",
    min: 40,
    max: 80,
    timestamp: new Date().toISOString(),
  },
  {
    id: "co2-1",
    name: "CO₂ Level",
    value: 850,
    unit: "ppm",
    status: "normal",
    min: 400,
    max: 1000,
    timestamp: new Date().toISOString(),
  },
  {
    id: "airflow-1",
    name: "Air Flow",
    value: 12.3,
    unit: "m³/min",
    status: "normal",
    min: 8,
    max: 20,
    timestamp: new Date().toISOString(),
  }
];

export const mockDevices: Device[] = [
  {
    id: "fan-1",
    name: "Main Ventilation Fan",
    type: "fan",
    status: "online",
    batteryLevel: 87,
    lastActive: new Date().toISOString(),
    location: "Section A",
  },
  {
    id: "fan-2",
    name: "Secondary Fan",
    type: "fan",
    status: "online",
    batteryLevel: 92,
    lastActive: new Date().toISOString(),
    location: "Section B",
  },
  {
    id: "sensor-1",
    name: "Environment Sensor 1",
    type: "sensor",
    status: "online",
    batteryLevel: 65,
    lastActive: new Date().toISOString(),
    location: "Section A",
  },
  {
    id: "sensor-2",
    name: "Environment Sensor 2",
    type: "sensor",
    status: "online",
    batteryLevel: 78,
    lastActive: new Date().toISOString(),
    location: "Section B",
  },
];

export const mockCrops: Crop[] = [
  {
    id: "crop-1",
    name: "Tomatoes",
    variety: "Roma",
    plantedDate: "2023-03-15",
    harvestDate: "2023-05-30",
    status: "growing",
    optimalTemp: { min: 20, max: 25 },
    optimalHumidity: { min: 60, max: 80 },
    location: "Section A",
    notes: "Growing well, needs more calcium",
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRvbWF0byUyMHBsYW50fGVufDB8fDB8fHww",
  },
  {
    id: "crop-2",
    name: "Lettuce",
    variety: "Butterhead",
    plantedDate: "2023-04-01",
    harvestDate: "2023-05-15",
    status: "growing",
    optimalTemp: { min: 15, max: 22 },
    optimalHumidity: { min: 50, max: 70 },
    location: "Section B",
    notes: "Growing faster than expected",
    image: "https://images.unsplash.com/photo-1582726458086-30efc3a14532?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGV0dHVjZSUyMHBsYW50fGVufDB8fDB8fHww",
  },
  {
    id: "crop-3",
    name: "Cucumbers",
    variety: "English",
    plantedDate: "2023-03-20",
    harvestDate: "2023-06-01",
    status: "growing",
    optimalTemp: { min: 21, max: 28 },
    optimalHumidity: { min: 70, max: 90 },
    location: "Section C",
    notes: "Need support for climbing",
    image: "https://images.unsplash.com/photo-1566486189376-d5f21e25aae4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y3VjdW1iZXIlMjBwbGFudHxlbnwwfHwwfHx8MA%3D%3D",
  },
];

export const mockWeatherForecast: WeatherForecast[] = [
  {
    date: new Date().toISOString(),
    condition: "sunny",
    temperature: { min: 18, max: 25 },
    humidity: 65,
    windSpeed: 10,
    precipitation: 0,
  },
  {
    date: new Date(Date.now() + 86400000).toISOString(),
    condition: "cloudy",
    temperature: { min: 16, max: 22 },
    humidity: 72,
    windSpeed: 8,
    precipitation: 20,
  },
  {
    date: new Date(Date.now() + 172800000).toISOString(),
    condition: "rainy",
    temperature: { min: 15, max: 20 },
    humidity: 85,
    windSpeed: 15,
    precipitation: 60,
  },
  {
    date: new Date(Date.now() + 259200000).toISOString(),
    condition: "cloudy",
    temperature: { min: 17, max: 23 },
    humidity: 78,
    windSpeed: 12,
    precipitation: 10,
  },
  {
    date: new Date(Date.now() + 345600000).toISOString(),
    condition: "sunny",
    temperature: { min: 19, max: 26 },
    humidity: 60,
    windSpeed: 7,
    precipitation: 0,
  },
];

// Helper function to generate chart data for the past 24 hours
export const generateHistoricalData = (
  type: "temperature" | "humidity" | "co2" | "airflow",
  dataPoints: number = 24
) => {
  let baseValue: number;
  let variance: number;
  let unit: string;

  switch (type) {
    case "temperature":
      baseValue = 22;
      variance = 3;
      unit = "°C";
      break;
    case "humidity":
      baseValue = 65;
      variance = 10;
      unit = "%";
      break;
    case "co2":
      baseValue = 800;
      variance = 200;
      unit = "ppm";
      break;
    case "airflow":
      baseValue = 15;
      variance = 5;
      unit = "m³/min";
      break;
  }

  const now = new Date();
  return Array.from({ length: dataPoints }).map((_, i) => {
    const timestamp = new Date(now.getTime() - (dataPoints - i - 1) * 3600000);
    const value = baseValue + (Math.random() * 2 - 1) * variance;
    return {
      timestamp: timestamp.toISOString(),
      value: Number(value.toFixed(1)),
      unit,
    };
  });
};
